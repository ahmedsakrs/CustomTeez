import axios from 'axios'
import {
    SET_APPLIED_DEISGN,
} from '../constants/designerConstants'


export const setDesigner = (appliedDesign) => async (dispatch) => {

    dispatch({
        type: SET_APPLIED_DEISGN,
        payload: {
            product: appliedDesign.product,
            product_name: appliedDesign.product_name,
            product_color: appliedDesign.product_color,
            image: appliedDesign.image,
            selected_designs: appliedDesign.selected_designs
        }
    })

}
