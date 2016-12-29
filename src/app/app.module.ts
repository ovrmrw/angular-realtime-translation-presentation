import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { LibModule } from '../lib/lib.module';
import { MicrophoneComponent } from './microphone';
import { SlideComponent } from './slide.component';
import { MeteorTowerComponent, MeteorComponent } from './meteor';
// import { MeteorTowerComponent } from './meteor/meteor-tower.component';


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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
