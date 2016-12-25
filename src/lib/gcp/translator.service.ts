import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const TRANSLATE_URL = 'http://localhost:4000/api/gcp/translator/ja/';


@Injectable()
export class GcpTranslatorService {
  constructor(
    private http: Http,
  ) { }


  requestTranslate(text: string): Promise<string> {
    return this.http.get(TRANSLATE_URL + text)
      .map(res => res.json() as { translation: string })
      .map(obj => obj.translation)
      .toPromise();
  }

}
