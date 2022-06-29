import * as actionTypes from "../types/organik.type";

export const setPemohon = (pemohon) => dispatch => {
    return dispatch({ type: actionTypes.SET_PEMOHON, pemohon })
}