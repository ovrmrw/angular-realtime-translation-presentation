import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

const TOKEN_URL = 'http://localhost:4000/api/watson/speech-to-text/token';


@Injectable()
export class WatsonSpeechToTextService {
  constructor(
    private http: Http,
  ) { }


  async requestToken(): Promise<string> {
    const result = await this.http.get(TOKEN_URL)
      .map(res => res.json() as TokenObject)
      .map(obj => obj.token)
      .toPromise();
    return result;
  }

}


interface TokenObject {
  token: string;
}
