import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  authUser = this.afAuth.user;
  constructor(private afAuth: AngularFireAuth) {

  }

  loginGoogle() {
    this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());
  }
  // loginTwitter() {
  //   this.afAuth.signInWithPopup(new auth.TwitterAuthProvider());
  // }
  // loginFB() {
  //   this.afAuth.signInWithPopup(new auth.FacebookAuthProvider());
  // }
}
