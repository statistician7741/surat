import * as actionTypes from "../types/layout.type";

export const setIsDev = ( isDev ) => dispatch => {
  return dispatch({ type: actionTypes.SET_ISDEV, isDev })
}