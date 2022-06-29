import * as actionTypes from "../types/organik.type";

const OrganikReducer = (
  state = {
    pemohon: {},
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_PEMOHON:
      return {
        ...state,
        pemohon: action.pemohon
      }
      default:
        return state
  }
};

export default OrganikReducer;