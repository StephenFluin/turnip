import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap } from 'rxjs/operators';
import { Island } from '../island';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import { combineLatest, Subject, BehaviorSubject } from 'rxjs';
@Component({
  selector: 'app-island-view',
  templateUrl: './island-view.component.html',
})
export class IslandViewComponent {
  islandData = this.route.paramMap.pipe(
    switchMap((params) =>
      this.db
        .object<Island>(`/islands/${params.get('id')}`)
        .valueChanges()
        .pipe(map((island) => ({ key: params.get('id'), ...island })))
    )
  );

  queueChange = new BehaviorSubject(true);

  queueData = combineLatest([this.afAuth.user.pipe(switchMap((user) => user.getIdToken())), this.route.paramMap, this.queueChange]).pipe(
    switchMap(([token, params]) => {
      console.log('new queuedata', token, params);
      return this.http.get(`${environment.endpoint}/islands/${params.get('id')}/status`, {
        params: { token },
      });
    })
  );
  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private http: HttpClient,
    private auth: AuthService,
    private afAuth: AngularFireAuth
  ) {
    this.queueChange.next(true);
    console.log('nexting queuechange');
  }

  queue(islandId) {
    this.http
      .post(`${environment.endpoint}/islands/${islandId}/queue`, {
        token: this.auth.syncToken,
        name: this.auth.syncName,
      })
      .subscribe(result => {
        console.log(result);
        this.queueChange.next(true);
      });
  }
}
