import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';

import { MicrophoneService } from '../../lib/microphone';
import { SimpleStore, isUpdatedKey } from '../../lib/simple-store';
import { AppState, TranslationConfig } from '../../state';
import { translationConfigKey } from '../../state';


const EnglishToJapansese = 'en -> ja';
const JapaneseToEnglish = 'ja -> en';

const EnglishToJapanseseConfig: TranslationConfig = {
  recognizeModel: 'en-US_BroadbandModel',
  translateTo: 'ja'
};

const JapaneseToEnglishConfig: TranslationConfig = {
  recognizeModel: 'ja-JP_BroadbandModel',
  translateTo: 'en'
};


@Component({
  selector: 'app-lang-selector',
  template: `
    <label for="language">Language:</label>
    <select (change)="onChanged($event)" class="form-control" id="language" required>
      <option *ngFor="let lang of langs" [value]="lang">{{lang}}</option>
    </select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LangSelectorComponent {
  langs = [EnglishToJapansese, JapaneseToEnglish];


  constructor(
    private store: SimpleStore<AppState>,
    private micService: MicrophoneService,
  ) { }


  onChanged(event: Event): void {
    // console.log('onChanged', event.target['value']);
    const selected: string = event.target['value'];
    if (selected === EnglishToJapansese) {
      this.store.setState(translationConfigKey, EnglishToJapanseseConfig);
    } else if (selected === JapaneseToEnglish) {
      this.store.setState(translationConfigKey, JapaneseToEnglishConfig);
    }
    this.micService.stop();
  }

}
