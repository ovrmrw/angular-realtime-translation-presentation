import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { SimpleStore } from '../simple-store';
import { AppState } from '../../state';


const TRANSLATOR_URL = 'http://localhost:4000/api/mcs/translator';


@Injectable()
export class McsTranslatorTextService {
  constructor(
    private http: Http,
    private store: SimpleStore<AppState>,
  ) { }


  async requestTranslate(text: string): Promise<string> {
    const state = await this.store.getState().take(1).toPromise();
    const payload: Payload = {
      translateTo: state.translationConfig.translateTo,
      text,
    };
    const result = await this.http.post(TRANSLATOR_URL, payload)
      .map(res => res.json() as TranslationObect)
      .map(obj => obj.translation)
      .toPromise();
    return result;
  }

}



interface Payload {
  text: string;
  translateTo: string;
}


interface TranslationObect {
  translation: string;
}