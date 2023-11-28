import { Store, AnyAction } from '@reduxjs/toolkit';
import { Persistor } from 'redux-persist';

export interface CustomStore extends Store<unknown, AnyAction> {
  __persistor?: Persistor;
}
