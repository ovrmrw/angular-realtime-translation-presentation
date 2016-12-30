import { OpaqueToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';


export const QueueConcurrent = new OpaqueToken('QueueConcurrent');

export const InitialState = new OpaqueToken('InitialState');


export type Action = {
  key: string;
  value: any;
  subject: Subject<any>;
};


type Value<K extends keyof T, T> = T[K];
type Func<K extends keyof T, T> = (value: T[K]) => T[K];

export type ValueTypes<K extends keyof T, T> =
  Value<K, T> | Func<K, T> | Promise<Value<K, T>> | Promise<Func<K, T>> | Observable<Value<K, T>> | Observable<Func<K, T>>;
