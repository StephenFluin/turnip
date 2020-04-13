import { Component, OnDestroy, NgZone } from '@angular/core';
import { Island } from '../island';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-island-new',
  templateUrl: './island-new.component.html',
})
export class IslandNewComponent implements OnDestroy {
  island: Island;
  destroy = new Subject();

  syncUid: string;
  constructor(private db: AngularFireDatabase, private afAuth: AngularFireAuth, private router: Router, private zones: NgZone) {
    this.afAuth.user.pipe(takeUntil(this.destroy)).subscribe((user) => {
      this.syncUid = user.uid;
    });
  }

  createIsland(event, name, code, description) {
    event.preventDefault();
    console.log('island created', name, code, description);

    this.db
      .object(`/islands/${this.syncUid}`)
      .set({
        name,
        code,
        description,
        date: new Date().toISOString(),
      })
      .then((result) => {
       this.zones.run(() => {
        this.router.navigateByUrl('/');
        });
      })
      .catch(console.error);
  }

  ngOnDestroy() {
    this.destroy.next();
  }
}
