import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { routes } from './routes';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { IslandViewComponent } from './island-view/island-view.component';
import { IslandMyComponent } from './island-my/island-my.component';
import { IslandNewComponent } from './island-new/island-new.component';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    IslandViewComponent,
    IslandMyComponent,
    IslandNewComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyCon810hNGfUWvRE1-YUzpwRXfGIHvHHu4',
      authDomain: 'turnip-9775c.firebaseapp.com',
      databaseURL: 'https://turnip-9775c.firebaseio.com',
      projectId: 'turnip-9775c',
      storageBucket: 'turnip-9775c.appspot.com',
      messagingSenderId: '693857126800',
      appId: '1:693857126800:web:e26d34da01afdd5d07cb15',
      measurementId: 'G-HFPM18TDMY',
    }),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
