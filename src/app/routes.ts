import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { IslandMyComponent } from './island-my/island-my.component';
import { IslandNewComponent } from './island-new/island-new.component';
import { IslandViewComponent } from './island-view/island-view.component';


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'islands/my', component: IslandMyComponent},
  {path: 'islands/new', component: IslandNewComponent},
  {path: 'islands/:id', component: IslandViewComponent},
];

