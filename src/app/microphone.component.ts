import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MicrophoneService } from '../lib/microphone';


@Component({
  selector: 'app-microphone',
  template: `
    <button class="btn btn-primary" (click)="record()">Mic Record</button>
    <button class="btn btn-secondary" (click)="stop()">Mic Stop</button>
	`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MicrophoneComponent {
  btnDisabled: boolean = false;
  message: string;


  constructor(
    private micService: MicrophoneService,
  ) { }


  record() {
    this.micService.record();
  }


  stop() {
    this.micService.stop();
  }

}
