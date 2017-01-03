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
  },
  slideUrl: '',
};


/* Stateの型定義。 */
export type AppState = {
  transcript: string,
  translated: string,
  transcriptList: string[],
  translatedList: string[],
  recognized: RecognizedObject | null,
  microphoneState: MicrophoneState,
  socketState: string,
  windowState: WindowState,
  translationConfig: TranslationConfig,
  slideUrl: string,
};


/* Component, Serviceでimportして使う文字列。 */
export const transcriptKey = 'transcript';
export const translatedKey = 'translated';
export const transcriptListKey = 'transcriptList';
export const translatedListKey = 'translatedList';
export const recognizedKey = 'recognized';
export const microphoneStateKey = 'microphoneState';
export const socketStateKey = 'socketState';
export const windowStateKey = 'windowState';
export const translationConfigKey = 'translationConfig';
export const slideUrlKey = 'slideUrl';


/* AppState keysと上記の文字列定義に差異がないかチェックする。 */
const __AppStateKeyValidation__: (keyof AppState)[] = [
  transcriptKey,
  translatedKey,
  transcriptListKey,
  translatedListKey,
  recognizedKey,
  microphoneStateKey,
  socketStateKey,
  windowStateKey,
  translationConfigKey,
  slideUrlKey,
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
  engine: string;
}
