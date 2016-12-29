import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import * as uuid from 'uuid';
import * as lodash from 'lodash';

import { Dispatcher, Provider, ReducerContainer } from './common';
import { FirebaseEffector } from './firebase-effector';
import { AppState } from './store.types';
import {
  Action,
  RestoreAction, PushTranscriptAction, PushTranslatedAction
} from './actions';
import {
  contentStateReducer, restoreStateMapper, afterRestoredStateReducer,
  transcriptListStateReducer, transcriptStateReducer,
  translatedStateReducer, translatedListStateReducer,
  watsonConfigStateReducer, recognizedStateReducer, microphoneStateReducer,
} from './reducers';


const initialState: AppState = {
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
    ready: false
  }
};


@Injectable()
export class Store {
  private provider$: Provider<AppState>;
  private dispatcherQueue$: Dispatcher<Action>;
  private firebaseEffectorTrigger$ = new Subject<AppState>();
  private firebaseRestoreFinished$ = new Subject<boolean>();
  private _cachedRecognized: any;


  constructor(
    private zone: NgZone,
    private dispatcher$: Dispatcher<Action>,
    @Inject(FirebaseEffector) @Optional()
    private firebaseEffector: FirebaseEffector | null,
  ) {
    this.provider$ = new BehaviorSubject<AppState>(initialState);
    this.createDispatcherQueue();
    this.combineReducers();
    this.applyEffectors();
  }


  private createDispatcherQueue(): void {
    this.dispatcherQueue$ = // DispatcherではなくDispatcherQueueをReducerに代入する。
      this.dispatcher$
        // .concatMap(action => { // Actionをdispatch順に処理する。
        .mergeMap(action => {
          if (action instanceof Promise || action instanceof Observable) {
            return Observable.from(action);
          } else {
            return Observable.of(action);
          }
        })
        .share() as Dispatcher<Action>;
  }


  private combineReducers(): void {
    ReducerContainer
      .zip<AppState>(...[
        recognizedStateReducer(initialState.recognized, this.dispatcherQueue$),
        transcriptStateReducer(initialState.transcript, this.dispatcherQueue$),
        transcriptListStateReducer(initialState.transcriptList, this.dispatcherQueue$),
        translatedStateReducer(initialState.translated, this.dispatcherQueue$),
        translatedListStateReducer(initialState.translatedList, this.dispatcherQueue$),
        watsonConfigStateReducer(initialState.speechToText, this.dispatcherQueue$),
        microphoneStateReducer(initialState.microphoneState, this.dispatcherQueue$),
        contentStateReducer(initialState.content, this.dispatcherQueue$),
        restoreStateMapper(this.dispatcherQueue$),
        afterRestoredStateReducer(initialState.afterRestored, this.dispatcherQueue$),

        (recognized, transcript, transcriptList, translated, translatedList, speechToText, microphoneState, content, restore, afterRestored): AppState => {
          const obj = { recognized, transcript, transcriptList, translated, translatedList, speechToText, microphoneState, content, restore, afterRestored };
          return Object.assign<{}, AppState, {}>({}, initialState, obj);
        }
      ])
      .subscribe(newState => {
        console.log('newState:', newState);
        this.zone.run(() => { // Zoneが捕捉できるようにするためにzone.runでラップしている。
          this.provider$.next(newState);
        });
        this.effectAfterReduced(newState);
      });
  }


  private effectAfterReduced(state: AppState): void {
    this.firebaseEffectorTrigger$.next(state);

    // if (state.recognized && !lodash.isEqual(this._cachedRecognized, state.recognized)) {
    //   if (state.recognized.results[0].final) {
    //     this._cachedRecognized = state.recognized;
    //     const transcript = state.recognized.results[0].alternatives[0].transcript;
    //     // console.log('final:', state.recognized.results[0].alternatives[0].transcript);
    //     this.dispatcher$.next(new PushTranscriptAction(transcript));
    //     this.dispatcher$.next(new PushTranslatedAction(transcript));
    //   }
    // }
  }


  private applyEffectors(): void {
    if (this.firebaseEffector) {

      /* Firebase Inbound (Firebaseからデータを取得する) */
      this.firebaseEffector.connect$<AppState>('jserinfo')
        .map(cloudState => {
          if (cloudState) {
            return cloudState;
          } else {
            this.firebaseRestoreFinished$.next(true);
            return initialState;
          }
        }) // クラウドからデータを取得できない場合はinitialStateに置き換える。
        .filter(state => initialState.uuid !== state.uuid) // 自分以外のクライアントがクラウドデータを変更した場合だけ自分に反映させる。
        .subscribe(state => {
          console.log('============================= Firebase Inbound (uuid:' + state.uuid + ')');
          this.dispatcher$.next(new RestoreAction(state));
          this.firebaseRestoreFinished$.next(true);
        });


      /* Firebase Outbound (データ更新毎にFirebaseへ保存する) */
      this.firebaseEffectorTrigger$
        .combineLatest(this.firebaseRestoreFinished$, (state, afterRestored) => {
          return { state, afterRestored };
        })
        .filter(obj => obj.afterRestored) // RestoreAction発行済みの場合は通過する。
        .filter(obj => !obj.state.restore) // RestoreActionではない場合のみ通過する。
        .map(obj => obj.state)
        .debounceTime(200)
        .subscribe(state => {
          console.log('============================= Firebase Outbound (uuid:' + state.uuid + ')');
          if (this.firebaseEffector) {
            this.firebaseEffector.saveCurrentState('jserinfo', state);
          }
        });

    }
  }


  getState(): Observable<AppState> {
    return this.provider$;
  }

}
