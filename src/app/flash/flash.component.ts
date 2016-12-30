import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleStore, contains } from '../../lib/simple-store';
import { AppState } from '../../state';

const RECOGNIZED = 'recognized';
const _keyValidation: (keyof AppState)[] = [RECOGNIZED];


@Component({
  selector: 'app-flash',
  template: `
    <div class="flash">{{text}}</div>
  `,
  styleUrls: ['./flash.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FlashComponent implements OnInit {
  text: string = '';


  constructor(
    private simpleStore: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.simpleStore.getState()
      .filter(state => contains(state, [RECOGNIZED]))
      .subscribe(state => {
        if (state.recognized && state.recognized.results && !state.recognized.results[0].final) {
          this.text = state.recognized.results[0].alternatives[0].transcript;
        } else {
          this.text = '';
        }
        this.cd.markForCheck();
      });
  }

}
