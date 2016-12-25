import { NgModule } from '@angular/core';

import { GcpTranslatorService } from './translator.service';


@NgModule({
  providers: [
    GcpTranslatorService,
  ],
})
export class GcpModule { }
