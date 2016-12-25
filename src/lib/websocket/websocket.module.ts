import { NgModule, OpaqueToken } from '@angular/core';

import { WatsonSpeechToTextWebSocketService } from './watson-speech-to-text.service';


@NgModule({
  providers: [
    WatsonSpeechToTextWebSocketService,
  ]
})
export class WebSocketModule { }
