import { Injectable } from '@angular/core';

import { WatsonSpeechToTextWebSocketService } from '../websocket';
const Microphone = require('./ibm/Microphone'); // written by IBM

import { SimpleStore, updatedProperty } from '../simple-store';
import { AppState, MicrophoneState } from '../../state';
import { microphoneStateType, socketStateType } from '../../state';


const micOptions = {
  bufferSize: 8192 // ctx.buffersize
};


@Injectable()
export class MicrophoneService {
  private running: boolean;
  private mic: any;


  constructor(
    private recognizeService: WatsonSpeechToTextWebSocketService,
    private store: SimpleStore<AppState>,
  ) {
    this.store.getState()
      .filter(updatedProperty.bind([socketStateType]))
      .subscribe(state => {
        if (this.running && (state.socketState === 'error' || state.socketState === 'close')) {
          this.stop();
        }
      });
  }


  get ws(): WebSocket | null {
    return this.recognizeService.getWebSocketInstance();
  }


  record(): void {
    this.stop();

    console.log('Starting WebSocket');
    this.recognizeService.webSocketStart()
      .then(() => {
        if (!this.running) {
          console.log('Starting microphone');
          this.mic = new Microphone(micOptions);
          this.mic.onAudio = (blob: Blob) => {
            if (this.ws && this.ws.readyState < 2) {
              this.ws.send(blob);
            }
          };
          this.mic.record();
          this.running = true;
          this.store.setState(microphoneStateType, { isActive: this.running } as MicrophoneState);
        } else {
          console.log('recording is already running.');
        }
      });
  }


  stop(): void {
    console.log('Stopping microphone, sending stop action message');
    this.recognizeService.webSocketStop();
    if (this.mic) {
      this.mic.onAudio = () => { };
      this.mic.stop();
      this.mic = null;
    }
    this.running = false;
    this.store.setState(microphoneStateType, { isActive: this.running } as MicrophoneState);
  }

}
