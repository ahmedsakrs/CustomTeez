import axios from 'axios'
import {
    SET_APPLIED_DEISGN,
} from '../constants/designerConstants'


export const setDesigner = (appliedDesign) => async (dispatch) => {

    dispatch({
        type: SET_APPLIED_DEISGN,
        payload: {
            product: appliedDesign.product,
            product_color: appliedDesign.product_color
        }
    })

}
