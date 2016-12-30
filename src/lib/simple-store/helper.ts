import { latestUpdatedProperty } from './simple-store';


export function updatedProperty<T>(...keys: string[]): (state: T) => boolean {
  return (state) => keys.some(key => key === state[latestUpdatedProperty]);
}
