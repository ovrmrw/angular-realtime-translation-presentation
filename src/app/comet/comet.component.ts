import { Component, ChangeDetectionStrategy, ChangeDetectorRef, Input, OnInit, ElementRef } from '@angular/core'
import { trigger, state, style, animate, transition } from '@angular/core'
import { Observable } from 'rxjs'


@Component({
  selector: 'app-comet',
  template: `
    <div class="comet no-select" 
      (click)="onClick()"
      [@flyInOut]="true" 
      [style.left.px]="startPosition" [style.top.px]="top" [style.color]="color" [style.zIndex]="index"
      [style.opacity]="opacity">{{text}}
    </div>
  `,
  styleUrls: ['./comet.component.css'],
  animations: [
    trigger('flyInOut', [
      state('true', style({ transform: 'translateX(-9000px)' })), // 最終的に到達する座標。
      transition('void => 1', [
        style({ transform: 'translateX(0px)' }),
        animate(1000 * 20) // 20秒かけて移動する。
      ]),
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CometComponent implements OnInit {
  @Input() text: string
  @Input() top: number
  @Input() index: number
  @Input() color: string
  startPosition: number
  opacity: number = 1


  constructor(
    private el: ElementRef,
  ) { }


  ngOnInit() {
    this.startPosition = Math.round(window.innerWidth - (window.innerWidth / 5))
  }


  onClick(): void {
    this.opacity = 0
  }

}
