import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import { verifyToken } from './verify-token';

const app = express();

app.use(cors());

admin.initializeApp();

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
      ref.push({name: name, uid: decoded.uid});
      res.send({ message: `Seems to work ${decoded.uid}.` });
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
