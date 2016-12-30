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
  recognizeModel: 'en-US_BroadbandModel',
  translateTo: 'ja',
  socketState: '',
};


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
  recognizeModel: string;
  translateTo: string;
  socketState: string;
};


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
