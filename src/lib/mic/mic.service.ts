import { Injectable } from '@angular/core';

import { WatsonSpeechToTextWebSocketService } from '../websocket';
const Microphone = require('./Microphone'); // written by IBM


@Injectable()
export class MicService {
  private running: boolean;
  private mic: any;


  constructor(
    private speechService: WatsonSpeechToTextWebSocketService,
    // private speechService: SpeechWebSocketMockService,
  ) {
    // this.ws = this.speechService.getWebSocketInstance();
  }


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
          // $('#resultsText').val('');   // clear hypotheses from previous runs      
          console.log('Not running, handleMicrophone()');
          console.log('starting mic');
          // this.mic.onStopRecording = (blob: Blob) => {
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

/*
  recordButton.click((function() {

    var running = false;
    var token = ctx.token;
    var micOptions = {
      bufferSize: ctx.buffersize
    };
    var mic = new Microphone(micOptions);

    return function(evt) {
      // Prevent default anchor behavior
      evt.preventDefault();

      var currentModel = localStorage.getItem('currentModel');
      var currentlyDisplaying = localStorage.getItem('currentlyDisplaying');

      if (currentlyDisplaying == 'sample' || currentlyDisplaying == 'fileupload') {
        showError('Currently another file is being transcribed, please stop the file or wait until it finishes');
        return;
      }
      localStorage.setItem('currentlyDisplaying', 'record');
      if (!running) {
        $('#resultsText').val('');   // clear hypotheses from previous runs
        console.log('Not running, handleMicrophone()');
        handleMicrophone(token, currentModel, mic, function(err) {
          if (err) {
            var msg = 'Error: ' + err.message;
            console.log(msg);
            showError(msg);
            running = false;
            localStorage.setItem('currentlyDisplaying', 'false');
          } else {
            recordButton.css('background-color', '#d74108');
            recordButton.find('img').attr('src', 'images/stop.svg');
            console.log('starting mic');
            mic.record();
            running = true;
          }
        });
      } else {
        console.log('Stopping microphone, sending stop action message');
        recordButton.removeAttr('style');
        recordButton.find('img').attr('src', 'images/microphone.svg');
        $.publish('hardsocketstop');
        mic.stop();
        running = false;
        localStorage.setItem('currentlyDisplaying', 'false');
      }
    };
  })());
  */