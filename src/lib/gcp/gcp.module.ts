import { NgModule } from '@angular/core'

import { GcpTranslatorService } from './translator.service'
import { GcpTranslatorServiceMock } from './translator.service.mock'


@NgModule({
  providers: [
    GcpTranslatorService,
    GcpTranslatorServiceMock,
  ],
})
export class GcpModule { }
