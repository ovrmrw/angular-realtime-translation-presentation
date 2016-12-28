import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-meteor-tower',
  template: `
    <ng-container>
      <app-meteor *ngFor="let meteor of meteors" [text]="meteor.text" [top]="meteor.top"></app-meteor>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeteorTowerComponent implements OnInit {
  meteors: Meteor[] = [];
  screenHeight: number = window.innerHeight;


  constructor(
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    let previousTop = 9999;

    Observable
      .interval(2000)
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
        this.meteors = this.meteors.filter(meteor => meteor.timestamp > timestamp - 1000 * 30);
      });

    Observable.fromEvent<Event>(window, 'resize')
      .subscribe(event => {
        this.screenHeight = window.innerHeight;
      });
  }

}


interface Meteor {
  text: string;
  top: number;
  timestamp: number;
}
