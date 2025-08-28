import { configureStore } from "@reduxjs/toolkit";
import {productListReducer, productDetailsReducer} from "./reducers/productReducers";
import {designListReducer, categoryListReducer, designDetailsReducer} from './reducers/designReducer'
import {cartReducer} from './reducers/cartReducers'
 
export const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    categoryList: categoryListReducer,
    designList: designListReducer,
    designDetails: designDetailsReducer,
    cart: cartReducer,
  },
});