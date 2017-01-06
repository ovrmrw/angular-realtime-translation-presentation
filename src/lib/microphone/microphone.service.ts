import { Injectable } from '@angular/core'

import { WatsonSpeechToTextWebSocketService } from '../websocket'
const Microphone = require('./ibm/Microphone') // written by IBM

import { SimpleStore, replaceAction } from '../simple-store'
import { AppState, MicrophoneState, KEY } from '../../state'


const AudioCtx = window.AudioContext
let audioContext: AudioContext
if (AudioCtx) {
  audioContext = new AudioCtx() // AudioContextはここで一回だけ生成する。
} else {
  throw new Error('AudioContext is not found on window object.')
}

const MIC_OPTIONS = {
  bufferSize: 8192,
  inputChannels: 1,
  outputChannels: 1,
  audioContext,
}


@Injectable()
export class MicrophoneService {
  private running: boolean
  private mic: any


  constructor(
    private recognizeService: WatsonSpeechToTextWebSocketService,
    private store: SimpleStore<AppState>,
  ) {
    this.initGetState()
  }


  private initGetState(): void {
    this.store.getState()
      .filterByUpdatedKey(KEY.socketState)
      .subscribe(state => {
        if (this.running && (state.socketState === 'error' || state.socketState === 'close')) {
          this.stop()
        }
      })
  }


  get ws() {
    return this.recognizeService.getWebSocketInstance()
  }


  record(): void {
    this.stop()

    console.log('Starting WebSocket')
    this.recognizeService.webSocketStart()
      .then(() => {
        if (!this.running) {
          console.log('Starting microphone')
          this.mic = new Microphone(MIC_OPTIONS)
          this.mic.onAudio = (blob: Blob) => {
            if (this.ws && this.ws.readyState < 2) {
              this.ws.send(blob)
            }
          }
          this.mic.record()
          this.running = true
          this.store.setState(KEY.microphoneState, replaceAction({ isActive: this.running }))
        } else {
          console.log('recording is already running.')
        }
      })
  }


  stop(): void {
    console.log('Stopping microphone, sending stop action message')
    this.recognizeService.webSocketStop()
    if (this.mic) {
      this.mic.onAudio = () => { }
      this.mic.stop()
      this.mic = null
    }
    this.running = false
    this.store.setState(KEY.microphoneState, replaceAction({ isActive: this.running }))
  }

}
