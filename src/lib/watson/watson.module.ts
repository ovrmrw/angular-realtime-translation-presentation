import { NgModule } from '@angular/core';

import { WatsonSpeechToTextService } from './speech-to-text.service';


@NgModule({
  providers: [
    WatsonSpeechToTextService
  ],
})
export class WatsonModule { }
