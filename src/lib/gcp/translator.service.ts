import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { SimpleStore } from '../simple-store';
import { AppState } from '../../state';

const TRANSLATOR_URL = 'http://localhost:4000/api/gcp/translator';


@Injectable()
export class GcpTranslatorService {
  constructor(
    private http: Http,
    private simpleStore: SimpleStore<AppState>,
  ) { }


  requestTranslate(text: string): Promise<string> {
    return this.simpleStore.getState()
      .take(1).toPromise().then(state => {
        const payload: Payload = {
          translateTo: state.translateTo,
          text,
        };
        return this.http.post(TRANSLATOR_URL, payload)
          .map(res => res.json() as { translation: string })
          .map(obj => obj.translation)
          .toPromise();
      });
  }

}


interface Payload {
  text: string;
  translateTo: string;
}
