import * as admin from 'firebase-admin';
import { Request } from 'express';

export const verifyToken = (req: Request) => {
    const token: string = req.body['token'];
    return admin.auth().verifyIdToken(token)
};
