import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { Disposer } from '../../lib/class';
import { SimpleStore, updatedProperty } from '../../lib/simple-store';
import { AppState } from '../../state';
import { recognizedType } from '../../state';


@Component({
  selector: 'app-flash',
  template: `
    <div class="flash">{{text}}</div>
  `,
  styleUrls: ['./flash.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashComponent extends Disposer implements OnInit, OnDestroy {
  text: string = '';


  constructor(
    private store: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    this.disposable = this.store.getState()
      .filter(updatedProperty.bind([recognizedType]))
      .subscribe(state => {
        if (state.recognized && state.recognized.results && !state.recognized.results[0].final) {
          this.text = state.recognized.results[0].alternatives[0].transcript;
        } else {
          this.text = '';
        }
        this.cd.markForCheck();
      });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}
