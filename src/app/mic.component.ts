import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MicService } from '../lib/mic';


@Component({
  selector: 'app-mic',
  template: `
	  <h2>Mic:</h2>			
    <button class="btn btn-secondary" (click)="record()">record</button>
    <button class="btn btn-secondary" (click)="stop()">stop</button>
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
