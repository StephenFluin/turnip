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

export const helloWorld = functions.https.onRequest((request, response) => {
  response.send({ msg: 'Hello from Firebase!', data: request.body, query: request.query });
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

app.get('/islands/:destination/status', (req, res) => {
  const destination = req.params['destination'];
  const db = admin.database();
  verifyToken(req)
    .then((decoded) => {
      const ref = db.ref(`/private/queues/${destination}`);
      return Promise.all([ref.once('value'), Promise.resolve(decoded.uid)]);
    })
    .then(([value, uid]) => {
      // Temporary for debugging, to figure out how to parse the values...
      // One of: Not Queued, Queued but not ready, or ready
      const queue: { [key: string]: {name:string,uid:string} } = <any>value.toJSON();
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

      if(status === 'ready') {
        db.ref(`/user/${destination}/code`).once('value')
        .then(code => {
          console.log("code is",code);
          res.send({status,queueLength,position,code});
        })
        .catch(err => {
          console.error(err);
          res.status(404).send('Could not find a dodo code for this island');
        });

      } else {
        res.send({status,queueLength,position});
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500);
    });
});

export const api = functions.https.onRequest(app);

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
