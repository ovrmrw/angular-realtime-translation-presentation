import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';

import { SimpleStore } from '../../lib/simple-store';
import { AppState } from '../../state';
import { Disposer } from '../../lib/class';


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
      .scan((previousTop, state) => {
        const timestamp: number = new Date().getTime();
        const top: number = this.getTopPosition(previousTop);

        if (state.transcriptList.length > this.transcriptIndex) {
          this.meteors.push({ text: state.transcript, top, timestamp, color: 'white' });
          this.transcriptIndex = state.transcriptList.length;
        } else if (state.translatedList.length > this.translatedIndex) {
          this.meteors.push({ text: state.translated, top, timestamp, color: 'springgreen' });
          this.translatedIndex = state.translatedList.length;
        }
        return top;
      }, 9999)
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

}


interface Meteor {
  text: string;
  top: number;
  timestamp: number;
  color: string;
}
