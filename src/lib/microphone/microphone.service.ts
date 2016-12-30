import { Injectable } from '@angular/core';

import { WatsonSpeechToTextWebSocketService } from '../websocket';
const Microphone = require('./ibm/Microphone'); // written by IBM

import { Dispatcher, Action, MicrophoneActiveAction } from '../store';
import { SimpleStore,AppState } from '../simple-store';

const micOptions = {
  bufferSize: 8192 // ctx.buffersize
};

const MICROPHONE_STATE = 'microphoneState';


@Injectable()
export class MicrophoneService {
  private running: boolean;
  private mic: any;


  constructor(
    private recognizeService: WatsonSpeechToTextWebSocketService,
    // private dispatcher$: Dispatcher<Action>,
    private simpleStore: SimpleStore<AppState>,
  ) {
    this.recognizeService.socketState$
      .subscribe(eventType => {
        if (eventType === 'error' || eventType === 'close') {
          this.stop();
        }
      });
  }


  get ws(): WebSocket | null {
    return this.recognizeService.getWebSocketInstance();
  }


  record() {
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
          // this.dispatcher$.next(new MicrophoneActiveAction(this.running));
          this.simpleStore.setState(MICROPHONE_STATE, { isActive: this.running });
        } else {
          console.log('recording is already running.');
        }
      });
  }


  stop() {
    console.log('Stopping microphone, sending stop action message');
    this.recognizeService.webSocketStop();
    if (this.mic) {
      this.mic.onAudio = () => { };
      this.mic.stop();
      this.mic = null;
    }
    this.running = false;
    // this.dispatcher$.next(new MicrophoneActiveAction(this.running));
    this.simpleStore.setState(MICROPHONE_STATE, { isActive: this.running });
  }

}
