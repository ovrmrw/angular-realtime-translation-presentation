import { Component, ChangeDetectionStrategy, ChangeDetectorRef, OnInit, OnDestroy, Inject } from '@angular/core'

import { MicrophoneService } from '../../lib/microphone'
import { SimpleStore } from '../../lib/simple-store'
import { AppState, TranslationConfig, KEY } from '../../state'
import { GcpTranslatorUrl, McsTranslatorUrl } from '../../opaque-tokens';


const EnToJaGcp = 'en -> ja (GCP)'
const JaToEnGcp = 'ja -> en (GCP)'
const EnToJaMcs = 'en -> ja (MCS)'
const JaToEnMcs = 'ja -> en (MCS)'

const EnToJaGcpConfig: Partial<TranslationConfig> = {
  recognizeModel: 'en-US_BroadbandModel',
  translateTo: 'ja',
  engine: 'gcp',
}

const JaToEnGcpConfig: Partial<TranslationConfig> = {
  recognizeModel: 'ja-JP_BroadbandModel',
  translateTo: 'en',
  engine: 'gcp',
}

const EnToJaMcsConfig: Partial<TranslationConfig> = {
  recognizeModel: 'en-US_BroadbandModel',
  translateTo: 'ja',
  engine: 'mcs',
}

const JaToEnMcsConfig: Partial<TranslationConfig> = {
  recognizeModel: 'ja-JP_BroadbandModel',
  translateTo: 'en',
  engine: 'mcs',
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
    this.focusSlideViewer()
  }


  setTranslationConfig(selected: string): void {
    if (selected === EnToJaGcp) {
      this.store.setter(KEY.translationConfig, this.mergeUrl(EnToJaGcpConfig))
    } else if (selected === JaToEnGcp) {
      this.store.setter(KEY.translationConfig, this.mergeUrl(JaToEnGcpConfig))
    } else if (selected === EnToJaMcs) {
      this.store.setter(KEY.translationConfig, this.mergeUrl(EnToJaMcsConfig))
    } else if (selected === JaToEnMcs) {
      this.store.setter(KEY.translationConfig, this.mergeUrl(JaToEnMcsConfig))
    }
  }


  mergeUrl(obj: Partial<TranslationConfig>): TranslationConfig | never {
    if (obj.engine) {
      if (obj.engine.toUpperCase() === 'GCP') {
        obj.translatorUrl = this.gcpTranslatorUrl
      } else if (obj.engine.toUpperCase() === 'MCS') {
        obj.translatorUrl = this.mcsTranslatorUrl
      }
    }
    if (!obj.translatorUrl) {
      throw new Error('translatorUrl is not defined.')
    }
    return obj as TranslationConfig
  }


  focusSlideViewer(): void {
    this.store.setter(KEY.signalFocusSlideViewer, null)
  }

}
