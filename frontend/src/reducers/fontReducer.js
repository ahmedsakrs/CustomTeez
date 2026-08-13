import {
  FONT_LIST_REQUEST,
  FONT_LIST_SUCCESS,
  FONT_LIST_FAIL,
} from "../constants/fontConstants";

export const fontListReducer = (state = { fonts: [] }, action) => {
  switch (action.type) {
    case FONT_LIST_REQUEST:
      return { loading: true, fonts: [] };

    case FONT_LIST_SUCCESS:
      return {
        loading: false,
        fonts: action.payload,
      };

    case FONT_LIST_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
