import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'

import { Disposer } from '../../lib/class'
import { MicrophoneService } from '../../lib/microphone'
import { SimpleStore } from '../../lib/simple-store'
import { AppState, KEY } from '../../state'
import { slideViewerId } from '../../config';


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
  isActive: boolean


  constructor(
    private microphoneService: MicrophoneService,
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super()
  }


  ngOnInit() {
    this.initGetState()
  }


  private initGetState(): void {
    this.disposable = this.store.getter()
      .filterByUpdatedKey(KEY.microphoneState)
      .subscribe(state => {
        this.isActive = state.microphoneState.isActive
        this.cd.markForCheck()
      })
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }


  record() {
    this.microphoneService.record()
    this.focusSlideViewer()
  }


  stop() {
    this.microphoneService.stop()
    this.focusSlideViewer()
  }


  /**
   * スライドにフォーカスを移してiframeのスライドがキーボードイベントをキャッチできるようにする。
   */
  focusSlideViewer() {
    this.store.setter(KEY.signalFocusSlideViewer, null)
  }

}
