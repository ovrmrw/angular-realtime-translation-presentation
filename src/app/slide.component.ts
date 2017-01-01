import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Disposer } from '../lib/class';
import { SimpleStore } from '../lib/simple-store';
import { AppState } from '../state';
import { windowStateKey } from '../state';


@Component({
  selector: 'app-slide',
  template: `
    <iframe 
      src="https://docs.google.com/presentation/d/1mumaB2_ZnQpsYquqm-iPoj_HMMbwSrpd44ynSPBfUMg/embed?start=false&loop=false&delayms=3000"
      frameborder="0" [width]="screenWidth" [height]="screenHeight" allowfullscreen="true" 
      mozallowfullscreen="true" webkitallowfullscreen="true">
    </iframe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent extends Disposer implements OnInit, OnDestroy {
  screenWidth: number;
  screenHeight: number;


  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    this.initGetState();
  }


  private initGetState(): void {
    this.disposable = this.store.getState()
      .filterByUpdatedKey(windowStateKey)
      .subscribe(state => {
        this.screenWidth = state.windowState.innerWidth;
        this.screenHeight = state.windowState.innerHeight - 50;
        this.cd.markForCheck();
      });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}


/*
<iframe src="https://docs.google.com/presentation/d/1mumaB2_ZnQpsYquqm-iPoj_HMMbwSrpd44ynSPBfUMg/embed?start=false&loop=false&delayms=3000" 
frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
*/
