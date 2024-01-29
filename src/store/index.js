import { calculatePrice, cart, detail, products, selectedOptions } from "./cart/cart";
import { userSlice } from "./user/user";
import {configureStore} from "@reduxjs/toolkit"



const rootReducer = {
    selectedOptions: selectedOptions.reducer,
    cart: cart.reducer,
    calculatePrice: calculatePrice.reducer,
    detail: detail.reducer,
    products: products.reducer,
    userSlice : userSlice.reducer
  };
  
export const store = configureStore({
    reducer: rootReducer,
  });