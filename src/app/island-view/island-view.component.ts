import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { map, switchMap } from 'rxjs/operators';
import { Island } from '../island';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

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
  constructor(
    private route: ActivatedRoute,
    private db: AngularFireDatabase,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  queue(islandId) {
    this.http
      .post(`${environment.endpoint}/islands/${islandId}/queue`, {
        token: this.auth.syncToken,
        name: this.auth.syncName,
      })
      .subscribe(console.log);
  }
}
