import { Observable } from 'rxjs';
import { AppState, RecognizedObject } from './store.types';


export class UpdateContentAction {
  constructor(public content: string) { }
}

export class RestoreAction {
  constructor(public cloudState: AppState) { }
}

export class RecognizedDataAction {
  constructor(public data: RecognizedObject) { }
}

export class TokenAction {
  constructor(public token: string) { }
}

export class PushTranscriptAction {
  constructor(public transcript: string) { }
}

export class PushTranslatedAction {
  constructor(public translated: string) { }
}

export class MicrophoneActiveAction {
  constructor(public isActive: boolean) { }
}


export type _Actions =
  UpdateContentAction | RestoreAction |
  RecognizedDataAction | TokenAction |
  PushTranscriptAction | PushTranslatedAction | MicrophoneActiveAction
  ;


export type Action = _Actions | Promise<_Actions> | Observable<_Actions>;
