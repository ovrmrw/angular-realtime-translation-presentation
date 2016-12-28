import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';


@Component({
  selector: 'app-meteor',
  template: `
    <div class="meteor" [@flyInOut]="'in'" [style.left.px]="screenWidth - 100" [style.top.px]="top">
      {{text}}
    </div>
  `,
  styleUrls: ['./meteor.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(-5000px)' })),
      transition('void => *', [
        style({ transform: 'translateX(0px)' }),
        animate(1000 * 15)
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeteorComponent implements OnInit {
  @Input() text: string;
  @Input() top: number;
  screenWidth: number;


  ngOnInit() {
    this.screenWidth = window.innerWidth;
  }

}
