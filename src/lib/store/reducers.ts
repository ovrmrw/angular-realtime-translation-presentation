import { Dispatcher, StateReducer, NonStateReducer } from './common';
import { WatsonSpeechToText, RecognizedObject } from './store.types';
import {
  Action,
  UpdateContentAction, RestoreAction,
  RecognizedDataAction, TokenAction,
  PushTranscriptAction, PushTranslatedAction,
} from './actions';


export const contentStateReducer: StateReducer<string> =
  (initState: string, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof UpdateContentAction) {
        return action.content;
      } else if (action instanceof RestoreAction) {
        return action.cloudState.content || '';
      } else {
        return state;
      }
    }, initState);


export const restoreStateMapper: NonStateReducer<boolean> =
  (dispatcher$: Dispatcher<Action>) =>
    dispatcher$.map(action => {
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return false;
      }
    });


export const afterRestoredStateReducer: StateReducer<boolean> =
  (initState: boolean, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return state;
      }
    }, initState);


export const transcriptStateReducer: StateReducer<string> =
  (initState: string, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof PushTranscriptAction) {
        return action.transcript;
      } else {
        return state;
      }
    }, initState);


export const transcriptListStateReducer: StateReducer<string[]> =
  (initState: string[], dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof PushTranscriptAction) {
        return [...state, action.transcript];
      } else {
        return state;
      }
    }, initState);


export const translatedStateReducer: StateReducer<string> =
  (initState: string, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof PushTranslatedAction) {
        return action.translated;
      } else {
        return state;
      }
    }, initState);


export const translatedListStateReducer: StateReducer<string[]> =
  (initState: string[], dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof PushTranslatedAction) {
        return [...state, action.translated];
      } else {
        return state;
      }
    }, initState);


export const watsonConfigStateReducer: StateReducer<WatsonSpeechToText> =
  (initState: WatsonSpeechToText, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof TokenAction) {
        return Object.assign(state, { token: action.token });
      } else {
        return state;
      }
    }, initState);


export const recognizedStateReducer: StateReducer<RecognizedObject | null> =
  (initState: RecognizedObject | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof RecognizedDataAction) {
        if (action.data.state) { // {state:'listening'}の場合
          return state;
        } else {
          return action.data;
        }
      } else {
        return state;
      }
    }, initState);


export const translationStateReducer: StateReducer<WatsonSpeechToText> =
  (initState: WatsonSpeechToText, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan((state, action) => {
      if (action instanceof TokenAction) {
        return Object.assign(state, { token: action.token });
      } else {
        return state;
      }
    }, initState);