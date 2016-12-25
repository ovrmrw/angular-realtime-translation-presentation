import { NgModule } from '@angular/core';

import { Dispatcher, createDispatcher } from './common';
import { Store } from './store';
import { FirebaseEffector } from './firebase-effector';


@NgModule({
  providers: [
    { provide: Dispatcher, useFactory: createDispatcher },
    Store,
    // FirebaseEffector,
  ],
})
export class StoreModule { }
