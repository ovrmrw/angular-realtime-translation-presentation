import { NgModule } from '@angular/core';

import { WebSocketModule } from './websocket';
import { StoreModule } from './store';
import { MicrophoneModule } from './microphone';
import { WatsonModule } from './watson';
import { GcpModule } from './gcp';
import { SimpleStoreModule } from './simple-store';
import { DomModule } from './dom';


@NgModule({
  imports: [
    WebSocketModule,
    StoreModule,
    MicrophoneModule,
    WatsonModule,
    GcpModule,
    SimpleStoreModule,
    DomModule,
  ]
})
export class LibModule { }
