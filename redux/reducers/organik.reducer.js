import * as actionTypes from "../types/organik.type";

export default (
  state = {
    active_user: {},
    organik_all: [],
    org_mitra_all: [],
    ttd: {
      ka_bps: undefined,
      ppk: undefined,
      ppk_prov: undefined,
      bendahara: undefined,
      bendahara_prov: undefined,
    }
  },
  action
) => {
  switch (action.type) {
    case actionTypes.SET_ACTIVE_USER:
      return {
        ...state,
        active_user: action.active_user
      }
    case actionTypes.SET_ORGANIK:
      return {
        ...state,
        organik_all: action.new_organik_all
      }
    case actionTypes.SET_ORGANIK_MITRA:
      return {
        ...state,
        org_mitra_all: action.new_organik_mitra_all
      }
    case actionTypes.SET_TTD_SPD:
      return {
        ...state,
        ttd: action.ttd
      }
    default: return state
  }
};
