import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleStore } from '../simple-store';
import { AppState, WindowState } from '../../state';
import { windowStateType } from '../../state';


@Injectable()
export class WindowService {
  constructor(
    private store: SimpleStore<AppState>,
  ) {
    this.updateWindowState();

    Observable
      .merge(...[
        Observable.fromEvent(window, 'load'),
        Observable.fromEvent(window, 'resize'),
      ])
      .debounceTime(100)
      .subscribe(event => {
        // console.log('event:', event);
        this.updateWindowState();
      });
  }


  updateWindowState(): void {
    const obj: WindowState = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    };
    this.store.setState(windowStateType, obj);
  }

}
