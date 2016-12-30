import * as uuid from 'uuid';


export const initialState: AppState = {
  transcripting: '',
  transcript: '',
  transcriptList: [],
  translated: '',
  translatedList: [],
  content: '',
  restore: false,
  afterRestored: false,
  uuid: uuid.v4(), // 起動毎にクライアントを識別するためのユニークなIDを生成する。
  speechToText: {
    bufferSize: 8192,
    token: '',
    currentModel: 'en-US_BroadbandModel',
    sessionPermissions: true,
    playbackON: false,
  },
  recognized: null,
  microphoneState: {
    isActive: false
  },
  recognizeModel: 'en',
  translateTo: 'jp',
  socketState: '',
  _last: '',
};


export type AppState = {
  transcripting: string;
  transcript: string;
  translated: string;
  transcriptList: string[];
  translatedList: string[];
  content: string;
  restore: boolean;
  afterRestored: boolean;
  uuid: string;
  speechToText: WatsonSpeechToText;
  recognized: RecognizedObject | null;
  microphoneState: MicrophoneState;
  recognizeModel: string;
  translateTo: string;
  socketState: string;
  _last: string;
};


export interface MicrophoneState {
  isActive: boolean;
}


export interface WatsonSpeechToText {
  currentModel: string;
  // models?: ModelWatsonSpeechToText,
  token: string;
  bufferSize: number;
  sessionPermissions: boolean;
  playbackON: boolean;
}


export interface ModelWatsonSpeechToText {
  url: string;
  rate: number;
  name: string;
  language: string;
  description: string;
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
