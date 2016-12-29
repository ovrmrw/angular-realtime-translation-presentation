export interface AppState {
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
}


export interface MicrophoneState {
  ready: boolean;
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
