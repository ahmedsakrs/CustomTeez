import axios from 'axios'
import {
    DESIGN_LIST_REQUEST,
    DESIGN_LIST_SUCCESS,
    DESIGN_LIST_FAIL,

    DESIGN_DETAILS_REQUEST,
    DESIGN_DETAILS_SUCCESS,
    DESIGN_DETAILS_FAIL,

    CATEGORY_LIST_REQUEST,
    CATEGORY_LIST_SUCCESS,
    CATEGORY_LIST_FAIL,
} from '../constants/designConstants'

export const listCategory = () => async (dispatch) => {
    try {
        dispatch({ type: CATEGORY_LIST_REQUEST })

        const { data } = await axios.get('/api/designCategories/')

        dispatch({
            type: CATEGORY_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: CATEGORY_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listDesigns = (category) => async (dispatch) => {
    try {
        dispatch({ type: DESIGN_LIST_REQUEST })

        const { data } = await axios.get(`/api/designCategories/${category}`)

        dispatch({
            type: DESIGN_LIST_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DESIGN_LIST_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}

export const listDesignDetails = (design_id) => async (dispatch) => {
    try {
        dispatch({ type: DESIGN_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/designs/${design_id}`)

        dispatch({
            type: DESIGN_DETAILS_SUCCESS,
            payload: data
        })

    } catch (error) {
        dispatch({
            type: DESIGN_DETAILS_FAIL,
            payload: error.response && error.response.data.detail
                ? error.response.data.detail
                : error.message,
        })
    }
}