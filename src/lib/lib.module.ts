import { NgModule } from '@angular/core'

import { WebSocketModule } from './websocket'
import { MicrophoneModule } from './microphone'
import { WatsonModule } from './watson'
// import { GcpModule } from './gcp'
import { SimpleStoreModule } from './simple-store'
import { DomModule } from './dom'
// import { McsModule } from './mcs'
import { TranslatorModule } from './translator';


@NgModule({
  imports: [
    WebSocketModule,
    MicrophoneModule,
    WatsonModule,
    // GcpModule,
    SimpleStoreModule,
    DomModule,
    // McsModule,
    TranslatorModule,
  ]
})
export class LibModule { }
