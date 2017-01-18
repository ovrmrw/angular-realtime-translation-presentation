import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core'

import { Disposer } from '../lib/class'
import { WindowService } from '../lib/dom'


@Component({
  selector: 'app-root',
  template: `
    <app-slide-viewer></app-slide-viewer>
    <div class="form-inline">
      <div class="form-group col-xs-4">
        <app-mic-controller></app-mic-controller>
      </div>
      <div class="form-group col-xs-3">
        <app-lang-selector></app-lang-selector>
      </div>
      <div class="form-group col-xs-5">
        <app-slide-url></app-slide-url>
      </div>
    </div>

    <app-flash></app-flash>
    <app-comet-tower></app-comet-tower>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Disposer implements OnInit, OnDestroy {
  constructor(
    private cd: ChangeDetectorRef,
    private __windowService: WindowService,
  ) {
    super()
  }


  ngOnInit() {

  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }

}
