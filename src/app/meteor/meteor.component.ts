import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';


@Component({
  selector: 'app-meteor',
  template: `
    <div class="meteor no-select" 
      (click)="onClick()"
      [@flyInOut]="true" 
      [style.left.px]="startPosition" [style.top.px]="top" [style.color]="color" [style.zIndex]="index"
      [style.opacity]="opacity">{{text}}
    </div>
  `,
  styleUrls: ['./meteor.component.css'],
  animations: [
    trigger('flyInOut', [
      state('true', style({ transform: 'translateX(-5000px)' })), // 最終的に到達する座標。
      transition('void => 1', [
        style({ transform: 'translateX(0px)' }),
        animate(1000 * 15) // 15秒かけて移動する。
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MeteorComponent implements OnInit {
  @Input() text: string;
  @Input() top: number;
  @Input() index: number;
  @Input() color: string;
  // screenWidth: number;
  startPosition: number;
  opacity: number = 1;


  ngOnInit() {
    // this.screenWidth = window.innerWidth;
    this.startPosition = window.innerWidth - (window.innerWidth / 5);
  }


  onClick(): void {
    this.opacity = 0;
  }

}
