import { Injectable } from '@angular/core'


@Injectable()
export class GcpTranslatorServiceMock {
  constructor() { }


  async requestTranslate(text: string): Promise<string> {
    const result = '(translated) ' + text
    return result
  }

}
