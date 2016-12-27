import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';


@Component({
  selector: 'app-shooting',
  template: `
    <div [@flyInOut]="'in'" class="shooting" [style.left.px]="screenWidth" [style.top.px]="top">
      {{text}}
    </div>
  `,
  styleUrls: ['./shooting.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(-5000px)' })),
      transition('void => *', [
        style({ transform: 'translateX(0px)' }),
        animate(1000 * 25)
      ]),
    ])
  ]
})
export class ShootingComponent implements OnInit {
  @Input() text: string;
  @Input() top: number;
  screenWidth: number;


  ngOnInit() {
    // this.text = 'this is a test';
    this.screenWidth = window.innerWidth;
    // this.top = 100;
  }

}
