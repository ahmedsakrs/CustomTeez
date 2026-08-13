import { configureStore } from "@reduxjs/toolkit";
import {productListReducer, productDetailsReducer} from "./reducers/productReducers";
import {designListReducer, categoryListReducer, designDetailsReducer} from './reducers/designReducer'
import {cartReducer} from './reducers/cartReducers'
import {appliedDesignReducer} from './reducers/designerReducers'
import { fontListReducer } from "./reducers/fontReducer";
 
export const store = configureStore({
  reducer: {
    productList: productListReducer,
    productDetails: productDetailsReducer,
    categoryList: categoryListReducer,
    designList: designListReducer,
    designDetails: designDetailsReducer,
    appliedDesign: appliedDesignReducer,
    cart: cartReducer,
    fontList: fontListReducer,
  },
});