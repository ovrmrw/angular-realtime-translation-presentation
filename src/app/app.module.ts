import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { LibModule } from '../lib/lib.module';
import { MicComponent } from './mic.component';
import { SlideComponent } from './slide.component';
import { ShootingComponent } from './shooting/shooting.component';
import { ShootingTowerComponent } from './shooting/shooting-tower.component';


@NgModule({
  declarations: [
    AppComponent,
    MicComponent,
    SlideComponent,
    ShootingComponent,
    ShootingTowerComponent,
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
