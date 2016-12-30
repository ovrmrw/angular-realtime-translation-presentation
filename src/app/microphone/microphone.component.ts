import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MicrophoneService } from '../../lib/microphone';

import { SimpleStore, contains } from '../../lib/simple-store';
import { AppState } from '../../state';
import { Disposer } from '../../lib/class';

const MICROPHONE_STATE = 'microphoneState';
const _keyValidation: (keyof AppState)[] = [MICROPHONE_STATE];


@Component({
  selector: 'app-microphone',
  template: `
    <button class="btn btn-primary" (click)="record()">Mic Record</button>
    <button class="btn btn-secondary" (click)="stop()">Mic Stop</button>
    <span *ngIf="isActive" class="blinking font-active"> MIC IS ACTIVE </span>
	`,
  styleUrls: ['./microphone.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicrophoneComponent extends Disposer implements OnInit, OnDestroy {
  isActive: boolean;


  constructor(
    private microphoneService: MicrophoneService,
    private simpleStore: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    this.disposable = this.simpleStore.getState()
      .filter(state => contains(state, [MICROPHONE_STATE]))
      .subscribe(state => {
        this.isActive = state.microphoneState.isActive;
        this.cd.markForCheck();
      });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  record() {
    this.microphoneService.record();
  }


  stop() {
    this.microphoneService.stop();
  }

}
