/* eslint-disable prettier/prettier */
import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  delivery: '',
  notes: '',
  shoppingCart: [],
  // number: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    increment: (prevState, action) => {
      const exsistIdx = prevState.shoppingCart.findIndex(
        item =>
          item.product_id === action.payload.id &&
          item.size_id === action.payload.size,
      );

      if (exsistIdx !== -1) {
        // Jika objek dg nilai id yg sama sudah ada di dalam array,
        // tambahkan nilai qty pada objek tersebut
        const existItem = prevState.shoppingCart[exsistIdx];
        const updatedItem = {
          ...existItem,
          qty: existItem.qty + 1,
        };
        const updatedCart = [
          ...prevState.shoppingCart.slice(0, exsistIdx),
          updatedItem,
          ...prevState.shoppingCart.slice(exsistIdx + 1),
        ];
        return {
          ...prevState,
          shoppingCart: updatedCart,
        };
      }
    },
    decrement: (prevState, action) => {
      const exsistIdx = prevState.shoppingCart.findIndex(
        item =>
          item.product_id === action.payload.id &&
          item.size_id === action.payload.size,
      );
      console.log(action.payload, exsistIdx);

      if (exsistIdx !== -1) {
        // Jika objek dg nilai id yg sama sudah ada di dalam array,
        // tambahkan nilai qty pada objek tersebut
        const existItem = prevState.shoppingCart[exsistIdx];
        const updatedItem = {
          ...existItem,
          qty: existItem.qty - 1,
        };
        const updatedCart = [
          ...prevState.shoppingCart.slice(0, exsistIdx),
          updatedItem,
          ...prevState.shoppingCart.slice(exsistIdx + 1),
        ];
        return {
          ...prevState,
          shoppingCart: updatedCart,
        };
      }
    },
    deliveryMethod: (prevState, action) => {
      return {...prevState, delivery: action.payload};
    },
    notes: (prevState, action) => {
      return {...prevState, notes: action.payload};
    },
    addtoCart: (prevState, action) => {
      // console.log(action.payload);

      const exsistIdx = prevState.shoppingCart.findIndex(
        item =>
          item.product_id === action.payload.product_id &&
          item.size_id === action.payload.size_id,
      );

      if (exsistIdx !== -1) {
        // Jika objek dg nilai id yg sama sudah ada di dalam array,
        // tambahkan nilai qty pada objek tersebut
        const existItem = prevState.shoppingCart[exsistIdx];
        const updatedItem = {
          ...existItem,
          qty: existItem.qty + action.payload.qty,
        };
        const updatedCart = [
          ...prevState.shoppingCart.slice(0, exsistIdx),
          updatedItem,
          ...prevState.shoppingCart.slice(exsistIdx + 1),
        ];
        return {
          ...prevState,
          shoppingCart: updatedCart,
        };
      } else {
        // Jika objek dg nilai id yg sama belum ada di dalam array,
        // tambahkan objek baru ke dalam array
        const updatedCart = [...prevState.shoppingCart, action.payload];
        return {
          ...prevState,
          shoppingCart: updatedCart,
        };
      }

      // return {
      //   ...prevState,
      //   shoppingCart: prevState.shoppingCart.concat(action.payload),
      // };
    },
    deleteItem: (prevState, action) => {
      const updatedCart = prevState.shoppingCart.filter(
        item =>
          item.product_id !== action.payload.id ||
          item.size_id !== action.payload.size,
      );
      return {...prevState, shoppingCart: updatedCart};
      // const exsistIdx = prevState.shoppingCart.findIndex(
      //   item =>
      //     item.product_id === action.payload.product_id &&
      //     item.size_id === action.payload.size_id,
      // );
      // const updatedCart = [
      //   ...prevState.shoppingCart.slice(0, exsistIdx),
      //   ...prevState.shoppingCart.slice(exsistIdx + 1),
      // ];
      // return {
      //   ...prevState,
      //   shoppingCart: updatedCart,
      // };
    },
    resetCart: () => {
      return initialState;
    },
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice.reducer;
