import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LibModule } from '../lib/lib.module';

import { AppComponent } from './app.component';
import { MicrophoneComponent } from './microphone';
import { SlideComponent } from './slide.component';
import { MeteorTowerComponent, MeteorComponent } from './meteor';
import { FlashComponent } from './flash';
import { LangSelectorComponent } from './lang-selector';

import { QueueConcurrent, InitialState } from '../lib/simple-store';
import { initialState } from '../state';

import { WatsonSpeechToTextStartOption } from '../lib/websocket';

const watsonSpeechToTextStartOption = {
  'content-type': 'audio/l16;rate=16000',
  'interim_results': true,
  'continuous': true,
  'word_confidence': true,
  'timestamps': true,
  // 'max_alternatives': 3,
  'inactivity_timeout': 10, // 30,
  // 'word_alternatives_threshold': 0.001,
  'smart_formatting': true,
};


@NgModule({
  declarations: [
    AppComponent,
    MicrophoneComponent,
    SlideComponent,
    MeteorComponent,
    MeteorTowerComponent,
    FlashComponent,
    LangSelectorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LibModule,
  ],
  providers: [
    { provide: QueueConcurrent, useValue: 99 },
    { provide: InitialState, useValue: initialState },
    { provide: WatsonSpeechToTextStartOption, useValue: watsonSpeechToTextStartOption },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
