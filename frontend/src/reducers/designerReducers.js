import {
  APPLIED_DESIGN_REQUEST,
  APPLIED_DESIGN_SUCCESS,
  APPLIED_DESIGN_FAIL,
} from "../constants/designerConstants";

export const appliedDesignReducer = (state = { appliedDesign: {} }, action) => {
  switch (action.type) {
    case APPLIED_DESIGN_REQUEST:
      return { loading: true, ...state };

    case APPLIED_DESIGN_SUCCESS:
      return { loading: false, appliedDesign: action.payload };

    case APPLIED_DESIGN_FAIL:
      return { loading: false, error: action.payload };

    default:
      return state;
  }
};
