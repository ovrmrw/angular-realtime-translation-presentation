import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleStore, updatedProperty } from '../../lib/simple-store';
import { AppState } from '../../state';
import { Disposer } from '../../lib/class';

const TRANSCRIPT_LIST = 'transcriptList';
const TRANSLATED_LIST = 'translatedList';
const _keyValidation: (keyof AppState)[] = [TRANSCRIPT_LIST, TRANSLATED_LIST];


@Component({
  selector: 'app-meteor-tower',
  template: `
    <app-meteor *ngFor="let m of meteors; let i = index" [text]="m.text" [top]="m.top" [color]="m.color" [index]="i">
    </app-meteor>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeteorTowerComponent extends Disposer implements OnInit, OnDestroy {
  meteors: Meteor[] = [];
  screenHeight: number = window.innerHeight;
  transcriptIndex: number = 0;
  translatedIndex: number = 0;


  constructor(
    private simpleStore: SimpleStore<AppState>,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    let previousTop = 9999;

    Observable
      .interval(2000)
      .filter(() => false)
      .map(value => 'this is a test ' + value)
      .subscribe(text => {
        let top: number;
        do {
          top = (this.screenHeight - 100) * Math.random(); // 高さをランダムに決定。
        } while (Math.abs(top - previousTop) < (this.screenHeight / 10)); // 前回と縦10分割位以上の差がつくこと。
        previousTop = top;

        const timestamp = new Date().getTime();
        this.meteors.push({ text, top, timestamp, color: 'white' });
        this.cd.markForCheck();

        /* filtering array */
        this.meteors = this.meteors.filter(meteor => meteor.timestamp > timestamp - 1000 * 15); // 15秒後に削除する。
      });


    this.disposable = this.simpleStore.getState()
      .filter(updatedProperty(TRANSCRIPT_LIST, TRANSLATED_LIST).bind(this))
      .scan((previousTop, state) => {
        const timestamp: number = new Date().getTime();
        const top: number = this.getTopPosition(previousTop);
        // const top: number = this.getTopPosition2(previousTop, 60);

        if (state.transcriptList.length > this.transcriptIndex) {
          this.meteors.push({ text: state.transcript, top, timestamp, color: 'lightgray' });
          this.transcriptIndex = state.transcriptList.length;
        } else if (state.translatedList.length > this.translatedIndex) {
          this.meteors.push({ text: state.translated, top, timestamp, color: 'springgreen' });
          this.translatedIndex = state.translatedList.length;
        }
        return top;
      }, 0)
      .subscribe(() => {
        this.cd.markForCheck();

        /* filtering array */
        const now = new Date().getTime();
        this.meteors = this.meteors.filter(meteor => meteor.timestamp > now - 1000 * 15); // 15秒後に削除する。
      });


    Observable.fromEvent<Event>(window, 'resize')
      .subscribe(event => {
        this.screenHeight = window.innerHeight;
      });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  getTopPosition(previousTop: number): number {
    let top: number;
    do {
      top = (this.screenHeight - 100) * Math.random(); // 高さをランダムに決定。
    } while (Math.abs(top - previousTop) < (this.screenHeight / 10)); // 前回と縦10分割位以上の差がつくこと。
    return top;
  }


  getTopPosition2(previousTop: number, diff: number): number {
    if (previousTop + diff > this.screenHeight - 100) {
      return 0;
    } else {
      return previousTop + diff;
    }
  }

}


interface Meteor {
  text: string;
  top: number;
  timestamp: number;
  color: string;
}
