import { NgModule } from '@angular/core';

import { QueueConcurrent, InitialState } from './common';
import { SimpleStore } from './simple-store';
import { initialState } from './state';


@NgModule({
  providers: [
    { provide: QueueConcurrent, useValue: 99 },
    { provide: InitialState, useValue: initialState },
    SimpleStore,
  ]
})
export class SimpleStoreModule { }
