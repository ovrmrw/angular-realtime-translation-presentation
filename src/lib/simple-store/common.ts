import { OpaqueToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';


export const QueueConcurrent = new OpaqueToken('QueueConcurrent');

export const InitialState = new OpaqueToken('InitialState');


export type Action = {
  key: string;
  value: any;
  subject: Subject<any>;
};


type Value<T, K extends keyof T> = T[K];
type Callback<T, K extends keyof T> = (value: T[K]) => T[K];

export type ValueTypes<T, K extends keyof T> =
  Value<T, K> | Callback<T, K> |
  Promise<Value<T, K>> | Promise<Callback<T, K>> |
  Observable<Value<T, K>> | Observable<Callback<T, K>>;
