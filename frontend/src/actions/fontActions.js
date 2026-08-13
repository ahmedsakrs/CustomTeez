import axios from 'axios'
import {
  FONT_LIST_REQUEST,
  FONT_LIST_SUCCESS,
  FONT_LIST_FAIL,
} from "../constants/fontConstants";


export const listFonts = () => async (dispatch) => {
    try {
        dispatch({ type: FONT_LIST_REQUEST })

        const { data } = await axios.get('/api/fonts/')

        dispatch({
            type: FONT_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: FONT_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

