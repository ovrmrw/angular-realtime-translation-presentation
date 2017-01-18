import { NgModule } from '@angular/core'

import { WebSocketModule } from './websocket'
import { MicrophoneModule } from './microphone'
import { WatsonModule } from './watson'
import { DomModule } from './dom'
import { TranslatorModule } from './translator'


@NgModule({
  imports: [
    WebSocketModule,
    MicrophoneModule,
    WatsonModule,
    DomModule,
    TranslatorModule,
  ]
})
export class LibModule { }
