import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'

import { ReactiveStoreService, WindowState, KEY } from '../../state'


@Injectable()
export class WindowService {
  constructor(
    private store: ReactiveStoreService,
  ) {
    this.updateWindowState()
    this.initObservableEvents()
  }


  private initObservableEvents(): void {
    Observable
      .merge(...[
        Observable.fromEvent(window, 'load'),
        Observable.fromEvent(window, 'resize'),
      ])
      .debounceTime(100)
      .subscribe(event => {
        // console.log('event:', event)
        this.updateWindowState()
      })
  }


  private updateWindowState(): void {
    const obj: WindowState = {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    }
    this.store.setter(KEY.windowState, obj)
  }

}
