import { Component } from '@angular/core';
import { AngularFireList, AngularFireDatabase } from '@angular/fire/database';
import { map } from 'rxjs/operators';
import { Island } from '../island';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  islands: AngularFireList<Island> = this.db.list('/islands');
  islandData = this.islands.snapshotChanges().pipe(
    map((actions) =>
      actions.map((a) => {
        const data = a.payload.val();
        const key = a.payload.key;
        const value = { key, ...data };
        return value;
      })
    )
  );

  constructor(private db: AngularFireDatabase) {}
}
