import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const TOKEN_URL = 'http://localhost:4000/api/watson/speech-to-text/token';


@Injectable()
export class WatsonSpeechToTextService {
  constructor(
    private http: Http,
  ) { }


  requestToken(): Promise<string> {
    return this.http.get(TOKEN_URL)
      .map(res => res.json() as { token: string })
      .map(obj => obj.token)
      .toPromise();
  }

}
