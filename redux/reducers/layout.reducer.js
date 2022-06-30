import * as actionTypes from "../types/layout.type";

const LayoutReducer = (
  state = {
    isDev: false,
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ISDEV:
      return {
        ...state,
        isDev: action.isDev
      }
    default: return state
  }
};

export default LayoutReducer;