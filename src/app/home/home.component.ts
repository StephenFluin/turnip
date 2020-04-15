import { Component } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Island } from '../island';
import { keyedValue } from '../keyed-value';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  islands: AngularFireList<Island> = this.db.list('/islands');
  islandData = this.islands.snapshotChanges().pipe(
    keyedValue,
  );

  constructor(private db: AngularFireDatabase) {}
}
