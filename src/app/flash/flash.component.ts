import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core'
import { Observable } from 'rxjs'

import { Disposer } from '../../lib/class'
import { SimpleStore } from '../../lib/simple-store'
import { AppState } from '../../state'
import { recognizedKey } from '../../state'


@Component({
  selector: 'app-flash',
  template: `
    <div class="flash">{{text}}</div>
  `,
  styleUrls: ['./flash.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashComponent extends Disposer implements OnInit, OnDestroy {
  text: string = ''


  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super()
  }


  ngOnInit() {
    this.initGetState()
  }


  private initGetState(): void {
    this.disposable = this.store.getState()
      .filterByUpdatedKey(recognizedKey)
      .subscribe(state => {
        if (state.recognized && state.recognized.results && !state.recognized.results[0].final) {
          this.text = state.recognized.results[0].alternatives[0].transcript
        } else {
          this.text = ''
        }
        this.cd.markForCheck()
      })
  }


  ngOnDestroy() {
    this.disposeSubscriptions()
  }

}
