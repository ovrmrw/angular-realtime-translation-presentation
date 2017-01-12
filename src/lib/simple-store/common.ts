import { OpaqueToken } from '@angular/core'
import { Observable, Subject } from 'rxjs'


export const StoreQueueConcurrent = new OpaqueToken('StoreQueueConcurrent')

export const StoreInitialState = new OpaqueToken('StoreInitialState')


export interface Action {
  key: string,
  value: any,
  subject: Subject<any>,
}


type ObjectValue<T, K extends keyof T> = T[K]
type ObjectValueResolver<T, K extends keyof T> = (value: T[K]) => T[K]

export type ValueOrResolver<T, K extends keyof T> =
  ObjectValue<T, K> | ObjectValueResolver<T, K> |
  Promise<ObjectValue<T, K>> | Promise<ObjectValueResolver<T, K>> |
  Observable<ObjectValue<T, K>> | Observable<ObjectValueResolver<T, K>>


export function mergeObject<T>(obj: T, partials: Partial<{[P in keyof T]: T[P]}>[]): T {
  return partials.reduce<T>((p, partial) => {
    return { ...<any>p, ...<any>partial }
  }, obj)
}


export type ObjectKeys<T> = {[P in keyof T]: P}


export type ObjectKey<T, K extends keyof T> = K
