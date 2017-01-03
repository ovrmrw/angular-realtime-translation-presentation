import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { Disposer } from '../../lib/class';
import { MicrophoneService } from '../../lib/microphone';
import { SimpleStore } from '../../lib/simple-store';
import { AppState } from '../../state';
import { microphoneStateKey } from '../../state';


@Component({
  selector: 'app-mic-controller',
  template: `
    <button class="btn btn-primary" (click)="record()">Mic Record</button>
    <button class="btn btn-secondary" (click)="stop()">Mic Stop</button>
    <span *ngIf="isActive" class="blinking font-active"> MIC IS ACTIVE </span>
	`,
  styleUrls: ['./mic-controller.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicControllerComponent extends Disposer implements OnInit, OnDestroy {
  isActive: boolean;


  constructor(
    private microphoneService: MicrophoneService,
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
      .filterByUpdatedKey(microphoneStateKey)
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
