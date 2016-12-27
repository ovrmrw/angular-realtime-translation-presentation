import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/core';


@Component({
  selector: 'app-shooting-tower',
  template: `
    <ng-container>
      <app-shooting *ngFor="let shoot of shoots; let i = index" [top]="i * 50" [text]="shoot.text">
      </app-shooting>
    </ng-container>
  `,
  styleUrls: ['./shooting.component.css'],
  animations: [
    trigger('flyInOut', [
      state('in', style({ transform: 'translateX(-5000px)' })),
      transition('void => *', [
        style({ transform: 'translateX(0px)' }),
        animate(1000 * 20)
      ]),
    ])
  ]
})
export class ShootingTowerComponent implements OnInit {
  screenHeight: number;
  shoots: any[] = [];


  ngOnInit() {
    this.screenHeight = window.innerHeight;
    this.shoots.push({ text: 'test1' });
    this.shoots.push({ text: 'test2' });

  }

}
