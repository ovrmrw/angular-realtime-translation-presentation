import { Injectable, Inject, Optional } from '@angular/core'
import { Observable, Subject } from 'rxjs'
import * as lodash from 'lodash'

import { WatsonSpeechToTextStartOption } from './common'
import { WatsonSpeechToTextService } from '../watson'
import { TranslatorService } from '../translator'
import { SimpleStore } from '../simple-store'
import { AppState, RecognizedObject, KEY } from '../../state'


const RECOGNIZE_URL = 'wss://stream.watsonplatform.net/speech-to-text/api/v1/recognize'

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
}

const STOP_OPTIONS = {
  'action': 'stop'
}


@Injectable()
export class WatsonSpeechToTextWebSocketService {
  private ws: WebSocket | null = null
  private startOptions: {}


  constructor(
    private store: SimpleStore<AppState>,
    private recognizeService: WatsonSpeechToTextService,
    private translateService: TranslatorService,
    @Inject(WatsonSpeechToTextStartOption) @Optional()
    private options: {} | null,
  ) {
    this.initGetState()
    this.startOptions = { ...START_OPTIONS, ...options } // Object.assign(START_OPTIONS, options)
  }


  private initGetState(): void {
    this.store.getter()
      .filterByUpdatedKey(KEY.socketState)
      .subscribe(state => {
        console.log('socket state:', state.socketState)
      })
  }


  private createUrl(token: string, model: string): string {
    return RECOGNIZE_URL + '?watson-token=' + token + '&model=' + model
  }


  webSocketStart(): Promise<void> {
    return new Promise<void>(async (resolve, reject) => {
      const token = await this.recognizeService.requestToken()
      const state = await this.store.getterAsPromise()
      const model = state.translationConfig.recognizeModel

      if (!this.ws && token && model) {
        const tokenSetUrl = this.createUrl(token, model)
        this.ws = new WebSocket(tokenSetUrl)

        this.ws.onmessage = this.onMessage.bind(this)

        this.ws.onerror = (event) => {
          console.error('ws.onerror', event)
          reject()
          this.store.setter(KEY.socketState, event.type)
        }

        this.ws.onopen = (event) => {
          console.log('ws.onopen', event)
          if (this.ws) {
            this.ws.send(JSON.stringify(START_OPTIONS))
            console.log('{ action: "start" } is sent.')
          }
          resolve()
          this.store.setter(KEY.socketState, event.type)
        }

        this.ws.onclose = (event) => {
          console.log('ws.onclose', event)
          this.store.setter(KEY.socketState, event.type)
        }
      }
    })
  }


  webSocketStop() {
    if (this.ws) {
      this.ws.send(JSON.stringify(STOP_OPTIONS))
      console.log('{ action: "stop" } is sent.')
      this.ws.close()
      this.ws = null
    }
  }


  async onMessage(event): Promise<AppState | null> {
    let appState: AppState | null = null

    console.log('ws.onmessage:', event)
    const data = JSON.parse(event.data) as RecognizedObject
    console.log('data:', data)

    if (data.error) { // ex. in case of error -> {"error": "No speech detected for 10s."}
      this.webSocketStop()
      return appState
    }

    if (data && data.results) {
      appState = await this.store.setter(KEY.recognized, (p) => data.state ? p : data) // ex. in case of state -> {"state": "listening"}

      if (data.results[0].final) { // 認識が完了しているかどうか。
        // const transcript = data.results[0].alternatives[0].transcript
        //   .split(' ')
        //   .filter(text => !text.match(/^D_/))
        //   .filter(text => !text.match(/^%HESITATION/))
        //   .join(' ').trim()
        const transcript = transcriptFinisher(data.results[0].alternatives[0].transcript)

        if (transcript) {
          appState = await this.store.setter(KEY.transcript, transcript)
            .then(s => this.store.setter(KEY.transcriptList, (p) => [...p, transcript]))
            .then(s => this.store.setter(KEY.translated, this.translateService.requestTranslate(transcript)))
            .then(s => this.store.setter(KEY.translatedList, (p) => [...p, s.translated]))
        }
      }
    }
    return appState
  }


  getWebSocketInstance(): Readonly<WebSocket> | null {
    return this.ws
  }

}



export function transcriptFinisher(transcript: string, removeUnword: boolean = true): string {
  let chunks = transcript.split(' ')

  if (removeUnword) {
    chunks = chunks
      .filter(text => !text.match(/^D_/))
      .filter(text => !text.match(/^%HESITATION/))
  }

  return chunks.join(' ').trim()
}
