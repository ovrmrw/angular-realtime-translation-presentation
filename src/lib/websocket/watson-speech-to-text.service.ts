import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import * as lodash from 'lodash';

import { WatsonSpeechToTextStartOption } from './common';
import { WatsonSpeechToTextService } from '../watson';
import { GcpTranslatorService, GcpTranslatorServiceMock } from '../gcp';
import { McsTranslatorTextService, McsTranslatorTextServiceMock } from '../mcs';
import { SimpleStore, replaceAction, pushArrayAction } from '../simple-store';
import { AppState, RecognizedObject } from '../../state';
import { recognizedKey, transcriptKey, transcriptListKey, translatedKey, translatedListKey, socketStateKey } from '../../state';


const RECOGNIZE_URL = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize';

const START_OPTIONS = {
  'action': 'start',
  'content-type': 'audio/l16;rate=16000',
  // 'interim_results': true,
  // 'continuous': true,
  // 'word_confidence': true,
  // 'timestamps': true,
  // 'max_alternatives': 3,
  // 'inactivity_timeout': 30,
  // 'word_alternatives_threshold': 0.001,
  // 'smart_formatting': true,
};

const STOP_OPTIONS = {
  'action': 'stop'
};


@Injectable()
export class WatsonSpeechToTextWebSocketService {
  private ws: WebSocket | null = null;
  private startOptions: {};


  constructor(
    private store: SimpleStore<AppState>,
    private recognizeService: WatsonSpeechToTextService,
    private gcpTranslateService: GcpTranslatorService,
    private gcpTranslateServiceMock: GcpTranslatorServiceMock,
    private mcsTranslateService: McsTranslatorTextService,
    @Inject(WatsonSpeechToTextStartOption) @Optional()
    private options: {} | null,
  ) {
    this.initGetState();
    this.startOptions = Object.assign(START_OPTIONS, options);
  }


  private initGetState(): void {
    this.store.getState()
      .filterByUpdatedKey(socketStateKey)
      .subscribe(state => {
        console.log('socket state:', state.socketState);
      });
  }


  private createUrl(token: string, model: string): string {
    return RECOGNIZE_URL + '?watson-token=' + token + '&model=' + model;
  }


  webSocketStart(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const token = await this.recognizeService.requestToken();
      const state = await this.store.getState().take(1).toPromise();
      const model = state.translationConfig.recognizeModel;

      if (!this.ws && token && model) {
        const tokenSetUrl = this.createUrl(token, model);
        this.ws = new WebSocket(tokenSetUrl);

        this.ws.onmessage = async (event) => {
          console.log('ws.onmessage:', event);
          const data = JSON.parse(event.data) as RecognizedObject;
          console.log('data:', data);

          if (data.error) { // ex. in case of error -> {"error": "No speech detected for 10s."}
            this.webSocketStop();
            return;
          }

          if (data && data.results) {
            this.store.setState(recognizedKey, (p) => data.state ? p : data); // ex. in case of state -> {"state": "listening"}

            if (data.results[0].final) { // 認識が完了しているかどうか。
              const transcript = data.results[0].alternatives[0].transcript.trim()
                .replace(/^D_/, '').replace(/%HESITATION/g, '');

              if (transcript) {
                this.store.setState(transcriptKey, replaceAction(transcript))
                  .then(s => this.store.setState(transcriptListKey, pushArrayAction(s.transcript)))
                  .then(s => {
                    if (s.translationConfig.engine === 'gcp') {
                      return this.store.setState(translatedKey, this.gcpTranslateService.requestTranslate(transcript))
                    } else if (s.translationConfig.engine === 'mcs') {
                      return this.store.setState(translatedKey, this.mcsTranslateService.requestTranslate(transcript))
                    } else {
                      return this.store.setState(translatedKey, this.gcpTranslateServiceMock.requestTranslate(transcript))
                    }
                  })
                  .then(s => this.store.setState(translatedListKey, pushArrayAction(s.translated)));
              }
            }
          }
        };

        this.ws.onerror = (event) => {
          console.error('ws.onerror', event);
          reject();
          this.store.setState(socketStateKey, replaceAction(event.type));
        };

        this.ws.onopen = (event) => {
          console.log('ws.onopen', event);
          if (this.ws) {
            this.ws.send(JSON.stringify(START_OPTIONS));
            console.log('{ action: "start" } is sent.');
          }
          resolve();
          this.store.setState(socketStateKey, replaceAction(event.type));
        };

        this.ws.onclose = (event) => {
          console.log('ws.onclose', event);
          this.store.setState(socketStateKey, replaceAction(event.type));
        };
      }
    });
  }


  webSocketStop() {
    if (this.ws) {
      this.ws.send(JSON.stringify(STOP_OPTIONS));
      console.log('{ action: "stop" } is sent.');
      this.ws.close();
      this.ws = null;
    }
  }


  getWebSocketInstance(): WebSocket | null {
    return this.ws;
  }

}
