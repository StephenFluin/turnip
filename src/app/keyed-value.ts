import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SnapshotAction } from '@angular/fire/database';


export const keyedValue = <T>(input: Observable<SnapshotAction<T>[]>) => input.pipe(map((actions) =>
      actions.map((a) => {
        const data = a.payload.val();
        const key = a.payload.key;
        const value = { key, ...data };
        return value;
      })
    )
);
