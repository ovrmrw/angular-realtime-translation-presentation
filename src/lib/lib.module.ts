import { NgModule } from '@angular/core';

import { WebSocketModule } from './websocket';
import { StoreModule } from './store';
import { MicModule } from './mic';
import { WatsonModule } from './watson';
import { GcpModule } from './gcp';


@NgModule({
  imports: [
    WebSocketModule,
    StoreModule,
    MicModule,
    WatsonModule,
    GcpModule,
  ]
})
export class LibModule { }
