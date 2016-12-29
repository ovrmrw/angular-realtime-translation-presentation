import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { MicrophoneService } from '../../lib/microphone';

import { Store } from '../../lib/store';


@Component({
  selector: 'app-microphone',
  template: `
    <button class="btn btn-primary" (click)="record()">Mic Record</button>
    <button class="btn btn-secondary" (click)="stop()">Mic Stop</button>
    <span *ngIf="messageShow" class="blinking font-active">MIC IS ACTIVE</span>
	`,
  styleUrls: ['./microphone.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicrophoneComponent implements OnInit {
  messageShow: boolean;


  constructor(
    private micService: MicrophoneService,
    private store: Store,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.store.getState()
      .subscribe(state => {
        this.messageShow = state.microphoneState.ready ? true : false;
        this.cd.markForCheck();
      });
  }


  record() {
    this.micService.record();
  }


  stop() {
    this.micService.stop();
  }

}
