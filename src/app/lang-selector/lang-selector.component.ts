import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core'

import { MicrophoneService } from '../../lib/microphone'
import { SimpleStore, replaceAction } from '../../lib/simple-store'
import { AppState, TranslationConfig } from '../../state'
import { translationConfigKey } from '../../state'
import { GcpTranslatorUrl, McsTranslatorUrl } from '../../opaque-tokens';


const EnToJaGcp = 'en -> ja (GCP)'
const JaToEnGcp = 'ja -> en (GCP)'
const EnToJaMcs = 'en -> ja (MCS)'
const JaToEnMcs = 'ja -> en (MCS)'

const EnToJaGcpConfig: TranslationConfig = {
  recognizeModel: 'en-US_BroadbandModel',
  translateTo: 'ja',
  engine: 'gcp',
  translatorUrl: '',
}

const JaToEnGcpConfig: TranslationConfig = {
  recognizeModel: 'ja-JP_BroadbandModel',
  translateTo: 'en',
  engine: 'gcp',
  translatorUrl: '',
}

const EnToJaMcsConfig: TranslationConfig = {
  recognizeModel: 'en-US_BroadbandModel',
  translateTo: 'ja',
  engine: 'mcs',
  translatorUrl: '',
}

const JaToEnMcsConfig: TranslationConfig = {
  recognizeModel: 'ja-JP_BroadbandModel',
  translateTo: 'en',
  engine: 'mcs',
  translatorUrl: '',
}


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
export class LangSelectorComponent implements OnInit {
  langs = [EnToJaMcs, JaToEnMcs, EnToJaGcp, JaToEnGcp]


  constructor(
    private store: SimpleStore<AppState>,
    private micService: MicrophoneService,
    @Inject(GcpTranslatorUrl)
    private gcpTranslatorUrl: string,
    @Inject(McsTranslatorUrl)
    private mcsTranslatorUrl: string,
  ) { }


  ngOnInit() {
    this.setTranslationConfig(this.langs[0])
  }


  onChanged(event: Event): void {
    // console.log('onChanged', event.target['value'])
    const selected: string = event.target['value']
    this.setTranslationConfig(selected)
    this.micService.stop() // 言語切り替えをしたときはマイクを止める。
  }


  setTranslationConfig(selected: string): void {
    if (selected === EnToJaGcp) {
      this.store.setState(translationConfigKey, replaceAction(this.mergeUrl(EnToJaGcpConfig)))
    } else if (selected === JaToEnGcp) {
      this.store.setState(translationConfigKey, replaceAction(this.mergeUrl(JaToEnGcpConfig)))
    } else if (selected === EnToJaMcs) {
      this.store.setState(translationConfigKey, replaceAction(this.mergeUrl(EnToJaMcsConfig)))
    } else if (selected === JaToEnMcs) {
      this.store.setState(translationConfigKey, replaceAction(this.mergeUrl(JaToEnMcsConfig)))
    }
  }


  mergeUrl(obj: TranslationConfig): TranslationConfig {
    if (obj.engine.toUpperCase() === 'GCP') {
      obj.translatorUrl = this.gcpTranslatorUrl
    } else if (obj.engine.toUpperCase() === 'MCS') {
      obj.translatorUrl = this.mcsTranslatorUrl
    }
    if (!obj.translatorUrl) {
      throw new Error('translatorUrl is not defined.')
    }
    return obj
  }

}
