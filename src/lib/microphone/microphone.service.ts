import { Injectable } from '@angular/core';

import { WatsonSpeechToTextWebSocketService } from '../websocket';
const Microphone = require('./ibm/Microphone'); // written by IBM


@Injectable()
export class MicrophoneService {
  private running: boolean;
  private mic: any;


  constructor(
    private speechService: WatsonSpeechToTextWebSocketService,
  ) { }


  get ws(): WebSocket {
    return this.speechService.getWebSocketInstance();
  }


  record() {
    this.speechService.webSocketStart()
      .then(() => {
        const micOptions = {
          bufferSize: 8192 // ctx.buffersize
        };
        if (!this.running) {
          this.mic = new Microphone(micOptions);
          console.log('Not running, handleMicrophone()');
          console.log('starting mic');
          this.mic.onAudio = (blob: Blob) => {
            if (this.ws.readyState < 2) {
              this.ws.send(blob);
            }
          };
          this.mic.record();
          this.running = true;
        } else {
          console.log('recording is already running.');
        }
      });
  }


  stop() {
    this.speechService.webSocketStop();
    console.log('Stopping microphone, sending stop action message');
    this.mic.onAudio = () => { };
    this.mic.stop();
    this.running = false;
  }

}
