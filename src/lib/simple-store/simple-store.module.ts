import { NgModule } from '@angular/core';

import { QueueConcurrent, InitialState } from './common';
import { SimpleStore } from './simple-store';


@NgModule({
  providers: [
    // { provide: QueueConcurrent, useValue: 99 },
    SimpleStore,
  ]
})
export class SimpleStoreModule { }
