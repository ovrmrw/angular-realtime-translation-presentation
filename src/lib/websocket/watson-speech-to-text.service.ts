import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as lodash from 'lodash';

import { WatsonSpeechToTextService } from '../watson';
import { GcpTranslatorService } from '../gcp';
import { SimpleStore, updatedProperty } from '../simple-store';
import { AppState, RecognizedObject } from '../../state';


const RECOGNIZE_URL = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize';

const startOptions = {
  'action': 'start',
  'content-type': 'audio/l16;rate=16000',
  'interim_results': true,
  'continuous': true,
  'word_confidence': true,
  'timestamps': true,
  // 'max_alternatives': 3,
  'inactivity_timeout': 5, // 30,
  // 'word_alternatives_threshold': 0.001,
  // 'smart_formatting': true,
};

const stopOptions = {
  'action': 'stop'
};

const RECOGNIZED = 'recognized';
const TRANSCRIPT = 'transcript';
const TRANSCRIPT_LIST = 'transcriptList';
const TRANSLATED = 'translated';
const TRANSLATED_LIST = 'translatedList';
const SOCKET_STATE = 'socketState';
const _keyValidation: (keyof AppState)[] = [RECOGNIZED, TRANSCRIPT, TRANSCRIPT_LIST, TRANSLATED, TRANSLATED_LIST, SOCKET_STATE];


@Injectable()
export class WatsonSpeechToTextWebSocketService {
  private ws: WebSocket | null = null;


  constructor(
    private simpleStore: SimpleStore<AppState>,
    private recognizeService: WatsonSpeechToTextService,
    private translateService: GcpTranslatorService,
  ) {
    this.simpleStore.getState()
      .filter(updatedProperty(SOCKET_STATE).bind(this))
      .subscribe(state => {
        console.log('socket state:', state.socketState);
      });
  }


  private createUrl(token: string, model: string): string {
    return RECOGNIZE_URL + '?watson-token=' + token + '&model=' + model;
  }


  webSocketStart(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.recognizeService.requestToken()
        .then(token => {
          this.simpleStore.getState()
            .take(1).subscribe(state => {
              const model = state.recognizeModel;

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
                    this.simpleStore.setState(RECOGNIZED, (p) => data.state ? p : data);

                    if (data.results[0].final) { // 認識が完了しているかどうか。
                      const transcript = data.results[0].alternatives[0].transcript.trim();
                      this.simpleStore
                        .setState(TRANSCRIPT, transcript)
                        .then(state => {
                          this.simpleStore.setState(TRANSCRIPT_LIST, (p) => [...p, state.transcript]);
                        });

                      this.simpleStore
                        .setState(TRANSLATED, this.translateService.requestTranslate(transcript))
                        .then(state => {
                          this.simpleStore.setState(TRANSLATED_LIST, (p) => [...p, state.translated]);
                        });
                    }
                  }
                };

                this.ws.onerror = (event) => {
                  console.error('ws.onerror', event);
                  reject();
                  this.simpleStore.setState(SOCKET_STATE, event.type);
                };

                this.ws.onopen = (event) => {
                  console.log('ws.onopen', event);
                  if (this.ws) {
                    this.ws.send(JSON.stringify(startOptions));
                    console.log('{ action: "start" } is sent.');
                  }
                  resolve();
                  this.simpleStore.setState(SOCKET_STATE, event.type);
                };

                this.ws.onclose = (event) => {
                  console.log('ws.onclose', event);
                  this.simpleStore.setState(SOCKET_STATE, event.type);
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
