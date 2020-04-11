import { Component } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  islands: AngularFireList<any> = this.db.list('/islands');
  islandData = this.islands.valueChanges();

  constructor(private db: AngularFireDatabase) {}
}
