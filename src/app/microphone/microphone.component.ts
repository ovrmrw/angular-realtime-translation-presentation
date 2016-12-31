import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { MicrophoneService } from '../../lib/microphone';

import { Disposer } from '../../lib/class';
import { SimpleStore, isUpdatedKey } from '../../lib/simple-store';
import { AppState } from '../../state';
import { microphoneStateKey } from '../../state';


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
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    this.disposable = this.store.getState()
      .filter(isUpdatedKey.bind([microphoneStateKey]))
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
