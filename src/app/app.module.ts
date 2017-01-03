import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { LibModule } from '../lib/lib.module';

import { AppComponent } from './app.component';
import { MicControllerComponent } from './mic-controller';
import { SlideViewerComponent } from './slide-viewer';
import { MeteorTowerComponent, MeteorComponent } from './meteor';
import { FlashComponent } from './flash';
import { LangSelectorComponent } from './lang-selector';
import { SlideUrlComponent } from './slide-url';

import { StoreQueueConcurrent, StoreInitialState, WatsonSpeechToTextStartOption } from '../opaque-tokens';
import { initialState } from '../state';

const watsonSpeechToTextStartOption = {
  'content-type': 'audio/l16;rate=16000',
  'interim_results': true,
  'continuous': true,
  'word_confidence': true,
  'timestamps': true,
  // 'max_alternatives': 3,
  'inactivity_timeout': 20, // 30,
  // 'word_alternatives_threshold': 0.001,
  'smart_formatting': true,
};


@NgModule({
  declarations: [
    AppComponent,
    MicControllerComponent,
    SlideViewerComponent,
    MeteorComponent,
    MeteorTowerComponent,
    FlashComponent,
    LangSelectorComponent,
    SlideUrlComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    LibModule,
  ],
  providers: [
    { provide: StoreQueueConcurrent, useValue: 99 },
    { provide: StoreInitialState, useValue: initialState },
    { provide: WatsonSpeechToTextStartOption, useValue: watsonSpeechToTextStartOption },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
