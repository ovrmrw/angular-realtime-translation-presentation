import { NgModule } from '@angular/core';

import { WebSocketModule } from './websocket';
import { StoreModule } from './store';
import { MicrophoneModule } from './microphone';
import { WatsonModule } from './watson';
import { GcpModule } from './gcp';


@NgModule({
  imports: [
    WebSocketModule,
    StoreModule,
    MicrophoneModule,
    WatsonModule,
    GcpModule,
  ]
})
export class LibModule { }
