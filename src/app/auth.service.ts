import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AppModule } from './app.module';

@Injectable({
  providedIn: 'any',
})
export class AuthService {
  syncUid: string;
  syncToken: string;
  syncName: string;
  constructor(afAuth: AngularFireAuth) {
    afAuth.user.subscribe((user) => {
      this.syncUid = user.uid;
      this.syncName = user.displayName;
      user.getIdToken().then((token) => (this.syncToken = token));
    });
  }
}
