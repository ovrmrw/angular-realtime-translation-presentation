import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MicService } from '../lib/mic';


@Component({
  selector: 'app-mic',
  template: `
    <button class="btn btn-primary" (click)="record()">Mic Record</button>
    <button class="btn btn-secondary" (click)="stop()">Mic Stop</button>
	`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicComponent {
  btnDisabled: boolean = false;
  message: string;


  constructor(
    // private chatService: NewWebSocketService,
    private micService: MicService,
  ) { }


  record() {
    this.micService.record();
  }


  stop() {
    this.micService.stop();
  }

}
