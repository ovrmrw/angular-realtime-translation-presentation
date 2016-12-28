import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../lib/store';
import { Disposer } from '../lib/class';
import { WatsonSpeechToTextService } from '../lib/watson';


@Component({
  selector: 'app-root',
  template: `
    <app-slide></app-slide>
    <app-microphone></app-microphone>    
    <ul>
      <li *ngFor="let transcript of transcriptList">{{transcript}}</li>
    </ul>
    <ul>
      <li *ngFor="let translated of translatedList">{{translated}}</li>
    </ul>
    <pre>{{recognized | json}}</pre>
    <app-meteor-tower></app-meteor-tower>
  `,
  styleUrls: ['./app.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Disposer implements OnInit, OnDestroy {
  title = 'app works!';
  recognized;
  transcriptList: string[];
  translatedList: string[];

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
    private wsttService: WatsonSpeechToTextService,
  ) {
    super();
  }


  ngOnInit() {
    this.disposable = this.store.getState().subscribe(state => {
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
