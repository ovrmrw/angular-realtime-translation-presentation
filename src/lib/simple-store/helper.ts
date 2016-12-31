import { latestUpdatedProperty } from './simple-store';


export function updatedProperty(...keys: string[]): (state) => boolean {
  return (state) => keys.some(key => key === state[latestUpdatedProperty]);
}
