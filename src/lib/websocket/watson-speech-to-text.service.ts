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


@Injectable()
export class WatsonSpeechToTextWebSocketService {
  private ws: WebSocket;
  private connectedToken: string;
  private _cachedData: RecognizedObject;


  constructor(
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
    private recognizeService: WatsonSpeechToTextService,
    private translateService: GcpTranslatorService,
  ) { }


  private createUrl(token: string, model: string): string {
    return RECOGNIZE_URL + '?watson-token=' + token + '&model=' + model;
  }


  webSocketStart(): Promise<Event> {
    return new Promise<Event>((resolve, reject) => {
      this.recognizeService.requestToken()
        .then(token => {
          this.store.getState().take(1).subscribe(state => {
            const model = state.speechToText.currentModel;

            if (this.connectedToken !== token && token && model) {
              const tokenSetUrl = this.createUrl(token, model);
              this.ws = new WebSocket(tokenSetUrl);

              this.ws.onmessage = (event) => {
                // console.log('ws.onmessage:', event);
                const data = JSON.parse(event.data) as RecognizedObject;
                console.log('data:', data);

                if (data) {
                  this.dispatcher$.next(new RecognizedDataAction(data));

                  if (data.results[0].final) {
                    const transcript = data.results[0].alternatives[0].transcript;
                    this.dispatcher$.next(new PushTranscriptAction(transcript));
                    this.dispatcher$.next(
                      this.translateService.requestTranslate(transcript)
                        .then(translated => new PushTranslatedAction(translated))
                    );
                  }
                }


                // setTimeout(() => {
                //   if (data && !lodash.isEqual(this._cachedData, data)) {
                //     if (data.results[0].final) { // 認識が完了しているかどうか。
                //       this._cachedData = data;
                //       const transcript = data.results[0].alternatives[0].transcript;
                //       // console.log('final:', state.recognized.results[0].alternatives[0].transcript);
                //       this.dispatcher$.next(new PushTranscriptAction(transcript));

                //       this.dispatcher$.next(
                //         this.translateService.requestTranslate(transcript)
                //           .then(translated => new PushTranslatedAction(translated))
                //       );
                //     }
                //   }
                // }, 0);
              };

              this.ws.onerror = (event) => {
                console.error('ws.onerror');
                console.error(event);
                reject(event);
              };

              this.ws.onopen = (event) => {
                console.log('ws.onopen');
                console.log(event);
                this.ws.send(JSON.stringify({
                  'action': 'start',
                  'content-type': 'audio/l16;rate=16000',
                  'interim_results': true,
                  'continuous': true,
                  'word_confidence': true,
                  'timestamps': true,
                  // 'max_alternatives': 3,
                  // 'inactivity_timeout': 600,
                  // 'word_alternatives_threshold': 0.001,
                  'smart_formatting': true,
                }));
                console.log('{action:"start"} is sent.');
                resolve(event);
              };

              this.ws.onclose = (event) => {
                console.log('ws.onclose');
                console.log(event);
              };

              this.connectedToken = token;
            }
          });
        });
    });
  }


  webSocketStop() {
    this.ws.send(JSON.stringify({
      'action': 'stop'
    }));
    console.log('{action:"stop"} is sent.');
    this.ws.close();
  }


  getWebSocketInstance(): WebSocket {
    return this.ws;
  }

}
