import * as uuid from 'uuid';


export const initialState: AppState = {
  transcript: '',
  transcriptList: [],
  translated: '',
  translatedList: [],
  restore: false,
  afterRestored: false,
  uuid: uuid.v4(), // 起動毎にクライアントを識別するためのユニークなIDを生成する。
  recognized: null,
  microphoneState: {
    isActive: false
  },
  // recognizeModel: 'en-US_BroadbandModel',
  // translateTo: 'ja',
  socketState: '',
  windowState: {
    innerWidth: 0,
    innerHeight: 0,
  },
  translationConfig: {
    recognizeModel: 'en-US_BroadbandModel',
    translateTo: 'ja',
  }
};


/* Stateの型定義。 */
export type AppState = {
  transcript: string;
  translated: string;
  transcriptList: string[];
  translatedList: string[];
  restore: boolean;
  afterRestored: boolean;
  uuid: string;
  recognized: RecognizedObject | null;
  microphoneState: MicrophoneState;
  // recognizeModel: string;
  // translateTo: string;
  socketState: string;
  windowState: WindowState;
  translationConfig: TranslationConfig;
};


/* Component, Serviceでimportして使う文字列。 */
export const transcriptType = 'transcript';
export const translatedType = 'translated';
export const transcriptListType = 'transcriptList';
export const translatedListType = 'translatedList';
export const recognizedType = 'recognized';
export const microphoneStateType = 'microphoneState';
// export const recognizeModelType = 'recognizeModel';
// export const translateToType = 'translateTo';
export const socketStateType = 'socketState';
export const windowStateType = 'windowState';
export const translationConfigType = 'translationConfig';


/* AppState typeと上記の文字列定義に差異がないかチェックする。 */
const __AppStateTypeValidation__: (keyof AppState)[] = [
  transcriptType,
  translatedType,
  transcriptListType,
  translatedListType,
  recognizedType,
  microphoneStateType,
  // recognizeModelType,
  // translateToType,
  socketStateType,
  windowStateType,
  translationConfigType,
];


export interface MicrophoneState {
  isActive: boolean;
}


export interface RecognizedObject {
  result_index: number;
  results: RecognizedResult[];
  state?: string;
  error?: string;
}


export interface RecognizedResult {
  alternatives: RecognizedAlternative[];
  final: boolean;
}


export interface RecognizedAlternative {
  transcript: string;
  confidence?: number;
  word_confidence?: Array<string | number>[]; // 配列の配列
  timestamp?: Array<string | number>[]; // 配列の配列
}


export interface WindowState {
  innerWidth: number;
  innerHeight: number;
}


export interface TranslationConfig {
  recognizeModel: string;
  translateTo: string;
}
