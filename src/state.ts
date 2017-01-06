import { ObjectKeys } from './lib/simple-store';


export const initialState: AppState = {
  transcript: '',
  transcriptList: [],
  translated: '',
  translatedList: [],
  recognized: null,
  microphoneState: {
    isActive: false
  },
  socketState: '',
  windowState: {
    innerWidth: 0,
    innerHeight: 0,
  },
  translationConfig: {
    recognizeModel: '', // 'en-US_BroadbandModel',
    translateTo: '', // ja',
    engine: '', // 'gcp',
    translatorUrl: '',
  },
  slideUrl: '',
}


/* Stateの型定義。 */
export interface AppState {
  transcript: string
  translated: string
  transcriptList: string[]
  translatedList: string[]
  recognized: RecognizedObject | null
  microphoneState: MicrophoneState
  socketState: string
  windowState: WindowState
  translationConfig: TranslationConfig
  slideUrl: string
}


/* Component, Serviceでimportして使うKEY。setState()の第一引数に使う。 */
export const KEY: ObjectKeys<AppState> = {
  transcript: 'transcript',
  translated: 'translated',
  transcriptList: 'transcriptList',
  translatedList: 'translatedList',
  recognized: 'recognized',
  microphoneState: 'microphoneState',
  socketState: 'socketState',
  windowState: 'windowState',
  translationConfig: 'translationConfig',
  slideUrl: 'slideUrl',
}


export interface MicrophoneState {
  isActive: boolean
}


export interface RecognizedObject {
  result_index: number
  results: RecognizedResult[]
  state?: string
  error?: string
}


export interface RecognizedResult {
  alternatives: RecognizedAlternative[]
  final: boolean
}


export interface RecognizedAlternative {
  transcript: string
  confidence?: number
  word_confidence?: Array<string | number>[] // 配列の配列
  timestamp?: Array<string | number>[] // 配列の配列
}


export interface WindowState {
  innerHeight: number
  innerWidth: number
}


export interface TranslationConfig {
  recognizeModel: string
  translateTo: string
  engine: string
  translatorUrl: string
}
