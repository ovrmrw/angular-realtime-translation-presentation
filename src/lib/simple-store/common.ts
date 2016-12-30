import { OpaqueToken } from '@angular/core';
import { Observable } from 'rxjs';


export const QueueConcurrent = new OpaqueToken('QueueConcurrent');


export type Action = {
  key: string;
  value: any;
};


type Val<K extends keyof T, T> = T[K];
type Func<K extends keyof T, T> = (value: T[K]) => T[K];

export type ValueTypes<K extends keyof T, T> =
  Val<K, T> | Func<K, T> | Promise<Val<K, T>> | Promise<Func<K, T>> | Observable<Val<K, T>> | Observable<Func<K, T>>;
