import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { SimpleStore } from '../lib/simple-store';
import { AppState } from '../state';
import { Disposer } from '../lib/class';
import { WatsonSpeechToTextService } from '../lib/watson';
import { WindowService } from '../lib/dom';


@Component({
  selector: 'app-root',
  template: `
    <app-slide></app-slide>
    <form class="form-inline">
      <div class="form-group col-xs-4">
        <app-microphone></app-microphone>
      </div>
      <div class="form-group col-xs-4">
        <app-lang-selector></app-lang-selector>
      </div>
      <div class="offset-xs-4"></div>
    </form>

    <app-flash></app-flash>
    <app-meteor-tower></app-meteor-tower>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Disposer implements OnInit, OnDestroy {
  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
    private __windowService: WindowService,
  ) {
    super();
  }


  ngOnInit() {

  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}
