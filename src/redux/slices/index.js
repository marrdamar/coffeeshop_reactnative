/* eslint-disable prettier/prettier */
import {combineReducers} from '@reduxjs/toolkit';

import userSlice from './auth';
import cartSlice from './cart';

const reducers = combineReducers({
  user: userSlice,
  cart: cartSlice,
});

export default reducers;
