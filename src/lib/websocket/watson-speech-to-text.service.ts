import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as lodash from 'lodash';

import { WatsonSpeechToTextService } from '../watson';
import { GcpTranslatorService } from '../gcp';
import {
  Store, Dispatcher, Action, RecognizedObject,
  RecognizedDataAction, PushTranscriptAction, PushTranslatedAction
} from '../store';


const RECOGNIZE_URL = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize';

const startOptions = {
  'action': 'start',
  'content-type': 'audio/l16;rate=16000',
  'interim_results': true,
  'continuous': true,
  'word_confidence': true,
  'timestamps': true,
  // 'max_alternatives': 3,
  'inactivity_timeout': 2, // 30,
  // 'word_alternatives_threshold': 0.001,
  'smart_formatting': true,
};

const stopOptions = {
  'action': 'stop'
};


@Injectable()
export class WatsonSpeechToTextWebSocketService {
  private ws: WebSocket | null = null;
  socketState$ = new Subject<string>();


  constructor(
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
    private recognizeService: WatsonSpeechToTextService,
    private translateService: GcpTranslatorService,
  ) {
    this.socketState$
      .subscribe(state => {
        console.log('socket state:', state);
      });
  }


  private createUrl(token: string, model: string): string {
    return RECOGNIZE_URL + '?watson-token=' + token + '&model=' + model;
  }


  webSocketStart(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.recognizeService.requestToken()
        .then(token => {
          this.store.getState().take(1).subscribe(state => {
            const model = state.speechToText.currentModel;

            if (!this.ws && token && model) {
              const tokenSetUrl = this.createUrl(token, model);
              this.ws = new WebSocket(tokenSetUrl);

              this.ws.onmessage = (event) => {
                console.log('ws.onmessage:', event);
                const data = JSON.parse(event.data) as RecognizedObject;
                console.log('data:', data);

                if (data.error) {
                  this.webSocketStop();
                  return;
                }

                if (data && data.results) {
                  this.dispatcher$.next(new RecognizedDataAction(data));

                  if (data.results[0].final) { // 認識が完了しているかどうか。
                    const transcript = data.results[0].alternatives[0].transcript;
                    this.dispatcher$.next(new PushTranscriptAction(transcript));
                    this.dispatcher$.next(
                      // this.translateService.requestTranslate(transcript)
                      //   .then(translated => new PushTranslatedAction(translated))
                      Observable.of(new PushTranslatedAction('(TRANSLATED)' + transcript)).delay(500)
                    );
                  }
                }
              };

              this.ws.onerror = (event) => {
                console.error('ws.onerror', event);
                // this.dispatcher$.next(new MicrophoneActiveAction(false));                
                reject();
                this.socketState$.next(event.type);
              };

              this.ws.onopen = (event) => {
                console.log('ws.onopen', event);
                if (this.ws) {
                  this.ws.send(JSON.stringify(startOptions));
                  console.log('{ action: "start" } is sent.');
                }
                // this.dispatcher$.next(new MicrophoneActiveAction(true));                
                resolve();
                this.socketState$.next(event.type);
              };

              this.ws.onclose = (event) => {
                console.log('ws.onclose', event);
                // this.dispatcher$.next(new MicrophoneActiveAction(false));
                this.socketState$.next(event.type);
              };
            }
          });
        });
    });
  }


  webSocketStop() {
    if (this.ws) {
      this.ws.send(JSON.stringify(stopOptions));
      console.log('{ action: "stop" } is sent.');
      this.ws.close();
      this.ws = null;
    }
  }


  getWebSocketInstance(): WebSocket | null {
    return this.ws;
  }

}
