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
import { RouterModule} from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    IslandViewComponent,
    IslandMyComponent,
    IslandNewComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
