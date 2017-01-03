import { NgModule } from '@angular/core'

import { McsTranslatorTextService } from './translator-text.service'
import { McsTranslatorTextServiceMock } from './translator-text.service.mock'


@NgModule({
  providers: [
    McsTranslatorTextService,
    McsTranslatorTextServiceMock,
  ],
})
export class McsModule { }
