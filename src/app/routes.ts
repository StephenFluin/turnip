import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { IslandMyComponent } from './island-my/island-my.component';
import { IslandNewComponent } from './island-new/island-new.component';
import { IslandViewComponent } from './island-view/island-view.component';

import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard';

const unauthorized = () => redirectUnauthorizedTo(['login']);
const loggedIn = () => redirectLoggedInTo(['/']);

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent, ...canActivate(loggedIn) },
  { path: 'islands/my', component: IslandMyComponent, ...canActivate(unauthorized) },
  { path: 'islands/new', component: IslandNewComponent, ...canActivate(unauthorized) },
  { path: 'islands/:id', component: IslandViewComponent, ...canActivate(unauthorized) },
];
