import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-slide',
  template: `
    <iframe 
      src="https://docs.google.com/presentation/d/1mumaB2_ZnQpsYquqm-iPoj_HMMbwSrpd44ynSPBfUMg/embed?start=false&loop=false&delayms=3000"
      frameborder="0" [width]="screenWidth" [height]="screenHeight" allowfullscreen="true" 
      mozallowfullscreen="true" webkitallowfullscreen="true">
    </iframe>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideComponent implements OnInit {
  screenWidth: number;
  screenHeight: number;


  constructor(
    private cd: ChangeDetectorRef,
  ) { }


  ngOnInit() {
    this.resizeScreen();

    Observable.fromEvent<Event>(window, 'resize')
      .subscribe(event => {
        this.resizeScreen();
      });
  }


  resizeScreen() {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight - 50;
    this.cd.markForCheck();
  }

}


/*
<iframe src="https://docs.google.com/presentation/d/1mumaB2_ZnQpsYquqm-iPoj_HMMbwSrpd44ynSPBfUMg/embed?start=false&loop=false&delayms=3000" frameborder="0" width="960" height="569" allowfullscreen="true" mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
*/
