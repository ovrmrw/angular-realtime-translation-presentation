import { latestUpdatedProperty } from './simple-store';


export function contains<T>(state: T, keys: string[]): boolean {
  return keys.some(key => key === state[latestUpdatedProperty]);
}
