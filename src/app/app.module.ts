import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'

import { LibModule } from '../lib/lib.module'

import { AppComponent } from './app.component'
import { MicControllerComponent } from './mic-controller'
import { SlideViewerComponent } from './slide-viewer'
import { CometTowerComponent, CometComponent } from './comet'
import { FlashComponent } from './flash'
import { LangSelectorComponent } from './lang-selector'
import { SlideUrlComponent } from './slide-url'

import { ReactiveStoreService } from '../state'
import {
  WatsonSpeechToTextStartOption,
  GcpTranslatorUrl, McsTranslatorUrl, UseMockTranslator,
} from '../opaque-tokens'
import {
  watsonSpeechToTextStartOption,
  gcpTranslatorUrl, mcsTranslatorUrl, useMockTranslator,
} from '../config'



@NgModule({
  declarations: [
    AppComponent,
    MicControllerComponent,
    SlideViewerComponent,
    CometComponent,
    CometTowerComponent,
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
    ReactiveStoreService,
    { provide: WatsonSpeechToTextStartOption, useValue: watsonSpeechToTextStartOption },
    { provide: GcpTranslatorUrl, useValue: gcpTranslatorUrl },
    { provide: McsTranslatorUrl, useValue: mcsTranslatorUrl },
    { provide: UseMockTranslator, useValue: useMockTranslator },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
