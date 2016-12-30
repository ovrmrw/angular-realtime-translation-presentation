import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { MicrophoneComponent } from './microphone';
import { SlideComponent } from './slide.component';
import { MeteorTowerComponent, MeteorComponent } from './meteor';

import { LibModule } from '../lib/lib.module';
import { QueueConcurrent, InitialState } from '../lib/simple-store';
import { initialState } from '../state';


@NgModule({
  declarations: [
    AppComponent,
    MicrophoneComponent,
    SlideComponent,
    MeteorComponent,
    MeteorTowerComponent,
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
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
