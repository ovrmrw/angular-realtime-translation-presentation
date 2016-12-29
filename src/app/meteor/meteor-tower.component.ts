import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Store } from '../../lib/store';


@Component({
  selector: 'app-meteor-tower',
  template: `
    <app-meteor *ngFor="let m of meteors; let i = index" [text]="m.text" [top]="m.top" [index]="i">
    </app-meteor>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeteorTowerComponent implements OnInit {
  meteors: Meteor[] = [];
  screenHeight: number = window.innerHeight;
  transcriptIndex: number = 0;
  translatedIndex: number = 0;
  previousTop: number = 9999;

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) { }


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
        this.meteors.push({ text, top, timestamp });
        this.cd.markForCheck();

        /* filtering array */
        this.meteors = this.meteors.filter(meteor => meteor.timestamp > timestamp - 1000 * 15); // 15秒後に削除する。
      });


    this.store.getState()
      .scan((previousTop, state) => {
        const timestamp: number = new Date().getTime();
        const top: number = this.getTopPosition(previousTop);

        if (state.transcriptList.length > this.transcriptIndex) {
          this.meteors.push({ text: state.transcript, top, timestamp });
          this.transcriptIndex = state.transcriptList.length;
        } else if (state.translatedList.length > this.translatedIndex) {
          this.meteors.push({ text: state.translated, top, timestamp });
          this.translatedIndex = state.translatedList.length;
        }
        return top;
      }, 9999)
      .subscribe(() => this.cd.markForCheck());


    Observable.fromEvent<Event>(window, 'resize')
      .subscribe(event => {
        this.screenHeight = window.innerHeight;
      });
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
}
