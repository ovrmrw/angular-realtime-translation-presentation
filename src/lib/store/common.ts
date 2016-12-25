import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { Action } from './actions';


@Injectable()
export class Dispatcher<T> extends Subject<T> {
  next(action: T) { super.next(action); }
}


export function createDispatcher() {
  return new Dispatcher<Action>();
}


export class Provider<T> extends Subject<T> {
  next(state: T) { super.next(state); }
}


export class ReducerContainer<T> extends Observable<T> {
}


export interface StateReducer<T> {
  (state: T, dispatcher: Dispatcher<any>): Observable<T>;
}


export interface NonStateReducer<T> {
  (dispatcher: Dispatcher<any>): Observable<T>;
}
