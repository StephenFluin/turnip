import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import { verifyToken } from './verify-token';

const app = express();

app.use(cors());
const serviceAccount = require('/home/stephen/Downloads/turnip-9775c-firebase-adminsdk-adpie-ecec3790c0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://turnip-9775c.firebaseio.com',
});

app.get('/adduser', (req, res) => {
  res.send('hi');
  const db = admin.database();
  const ref = db.ref('/islands/4000');
  ref
    .set({ message: 'hello world!!' })
    .then((value) => console.log('success', value))
    .catch((err) => console.error('error', err));
});

app.post('/islands/:destination/queue', (req, res) => {
  const destination = req.params['destination'];
  const name = req.body['name'];
  verifyToken(req)
    .then((decoded) => {
      const db = admin.database();
      const ref = db.ref(`/private/queues/${destination}`);
      // This needs to be a push/not set because we need the order
      ref.push({ name: name, uid: decoded.uid });
      res.send({ message: `Seems to work ${decoded.uid}.` });
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});
app.post('/islands/:destination/removeFromQueue', (req, res) => {
  const destination = req.params['destination'];
  const target = req.body['target'];
  verifyToken(req)
    .then((decoded) => {
      const db = admin.database();
      const ref = db.ref(`/private/queues/${destination}`);
      let removed = false;
      ref
        .once('value')
        .then((queueSnapshot) => {
          const queue = <any>queueSnapshot.toJSON();
          for (const key of Object.keys(queue)) {
            if (
              // Allow users to delete themselves
              queue[key].uid === decoded.uid ||
              // Or let islands delete anyone from their queue
              (queue[key].uid === target && decoded.uid === destination)
            ) {
              db.ref(`/private/queues/${destination}/${key}`)
                .remove()
                .then(() => {
                  res.send({ message: 'removed' });
                })
                .catch((err) => {
                  console.error(err);
                  res.status(500).send({ message: 'error, could not remove' });
                });
              removed = true;
              break;
            } else {
              console.debug(`queue uid: ${queue[key].uid}, target: ${target}, uid: ${decoded.uid}, destination: ${destination}`)
            }
          }
          if(!removed) {
            res.send({message: 'could not find item to remove with right permissions'});
          }
        })
        .catch((err) => {
          console.error(err);
          res.send({ message: 'could not find queue' });
        });

    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

app.get('/islands/:destination/status', (req, res) => {
  const destination = req.params['destination'];
  const db = admin.database();
  verifyToken(req)
    .then((decoded) => {
      if(decoded.uid === destination) {
        // Island Owner
        const ref = db.ref(`/private/queues/${destination}`);
          ref.once('value').then(queueSnapshot => {
            const queue = queueSnapshot.toJSON() || {};
            res.send({myQueue:queue});
          })
          .catch(err => {
            console.error(err);
            res.status(500).send({message: 'could not read island queue'});
          })
      } else {
        // Island Visitor
        const ref = db.ref(`/private/queues/${destination}`);
        Promise.all([ref.once('value'), Promise.resolve(decoded.uid)])
        .then(([value, uid]) => {

          // One of: Not Queued, Queued but not ready, or ready
          const queue: { [key: string]: { name: string; uid: string } } = <any>value.toJSON();
          if(!queue) {
            res.send({status:'not-queued',queueLength: 0});
            return;
          }
          let status: 'not-queued' | 'ready' | 'not-ready' = 'not-queued';

          const queueLength = Object.keys(queue).length;
          let position = 1;
          for (const key of Object.keys(queue)) {
            if (queue[key].uid === uid) {
              if (position > 3) {
                status = 'not-ready';
                break;
              } else {
                status = 'ready';
                break;
              }
            }
            position++;
          }

          if (status === 'ready') {
            db.ref(`/user/${destination}/code`)
              .once('value')
              .then((code) => {
                console.log('code is', code.toJSON());
                res.send({ status, queueLength, position, code });
              })
              .catch((err) => {
                console.error(err);
                res.status(404).send('Could not find a dodo code for this island');
              });
          } else {
            res.send({ status, queueLength, position });
          }
        })
        .catch(err => {
          console.error(err);
          res.status(500).send({message: 'error in queue lookup'});
        });

      }

    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({message: 'error in token verification'});
    });

});

export const api = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
