import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { SimpleStore } from '../lib/simple-store';
import { AppState } from '../state';
import { Disposer } from '../lib/class';
import { WatsonSpeechToTextService } from '../lib/watson';


@Component({
  selector: 'app-root',
  template: `
    <app-slide></app-slide>
    <app-microphone></app-microphone>
    <app-meteor-tower></app-meteor-tower>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Disposer implements OnInit, OnDestroy {
  recognized;
  transcriptList: string[];
  translatedList: string[];


  constructor(
    private simpleStore: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    this.disposable = this.simpleStore.getState()
      .subscribe(state => {
        this.recognized = state.recognized;
        this.transcriptList = state.transcriptList;
        this.translatedList = state.translatedList;
        this.cd.markForCheck();
      });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}
