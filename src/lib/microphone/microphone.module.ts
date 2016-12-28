import { NgModule } from '@angular/core';

import { MicrophoneService } from './microphone.service';


@NgModule({
  providers: [
    MicrophoneService,
  ]
})
export class MicrophoneModule { }
