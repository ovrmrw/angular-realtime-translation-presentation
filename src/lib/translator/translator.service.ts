import { Injectable, Inject, Optional } from '@angular/core'
import { Http } from '@angular/http'

import { SimpleStore } from '../simple-store'
import { AppState } from '../../state'
import { UseMockTranslator } from '../../opaque-tokens';


@Injectable()
export class TranslatorService {
  constructor(
    private http: Http,
    private store: SimpleStore<AppState>,
    @Inject(UseMockTranslator) @Optional()
    private useMockTranslator: boolean | null,
  ) { }


  async requestTranslate(text: string): Promise<string> {
    let result: string

    if (this.useMockTranslator) { // useMockTranslatorがtrutyのときはTranslator APIを使わない。
      result = '(mocked) ' + text
    } else {
      const state = await this.store.getStateAsPromise()
      const translatorUrl = state.translationConfig.translatorUrl
      const payload: Payload = {
        translateTo: state.translationConfig.translateTo,
        text,
      }
      result = await this.http.post(translatorUrl, payload)
        .map(res => res.json() as TranslationObject)
        .map(obj => obj.translation)
        .toPromise()
    }

    return result
  }
}



interface Payload {
  text: string
  translateTo: string
}


interface TranslationObject {
  translation: string
}
