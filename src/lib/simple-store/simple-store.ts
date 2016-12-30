import { Injectable, NgZone, Inject } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { QueueConcurrent, Action, ValueTypes } from './common';
import { AppState, initialState } from './state';


@Injectable()
export class SimpleStore {
  private simpleStore$ = new Subject<Action>();
  private provider$ = new BehaviorSubject<AppState>(initialState);


  constructor(
    private zone: NgZone,
    @Inject(QueueConcurrent)
    private concurrent: number,
  ) {
    const queue =
      this.simpleStore$
        .mergeMap(action => {
          if (action.value instanceof Promise || action.value instanceof Observable) {
            return Observable.from(action.value).mergeMap(value => Observable.of({ key: action.key, value }));
          } else {
            return Observable.of(action);
          }
        }, (this.concurrent || 1));


    queue
      .scan((state, action) => {
        if (action.value instanceof Function) {
          state[action.key] = action.value.call(null, state[action.key]);
        } else {
          state[action.key] = action.value;
        }
        return Object.assign({}, state);
      }, initialState)
      .subscribe(newState => {
        console.log('newState:', newState);
        this.zone.run(() => {
          this.provider$.next(newState);
        });
      });
  }


  setState<K extends keyof AppState>(key: K, value: ValueTypes<K, AppState>): void {
    this.simpleStore$.next({ key, value });
  }


  getState(): Observable<AppState> {
    return this.provider$;
  }

}
