import * as actionTypes from "../types/organik.type";

export const setActiveUser = (socket) => dispatch => {
    socket.emit('api.socket.organik/s/getActiveUser', (active_user) => {
        return dispatch({ type: actionTypes.SET_ACTIVE_USER, active_user })
    })
}

export const resetActiveUser = () => dispatch => {
    return dispatch({ type: actionTypes.SET_ACTIVE_USER, active_user: {} })
}

export const setOrganik = (socket) => dispatch => {
    socket.emit('api.socket.organik/s/getOrganikAll', (new_organik_all) => {
        return dispatch({ type: actionTypes.SET_ORGANIK, new_organik_all })
    })
}

export const setOrganikMitra = (socket) => dispatch => {
    socket.emit('api.socket.organik/s/getOrgMitraAll', (new_organik_mitra_all) => {
        return dispatch({ type: actionTypes.SET_ORGANIK_MITRA, new_organik_mitra_all })
    })
}

export const setTTDSPD = (socket, ttd, cb) => dispatch => {
    socket.emit('api.socket.spd/s/setTTDSPD', ttd, ( result )=>{
        cb();
        return dispatch({ type: actionTypes.SET_TTD_SPD, ttd })
    })
}

export const initTTDSPD = (socket) => dispatch => {
    socket.emit('api.socket.spd/s/getTTDSPD', ( ttd )=>{
        return dispatch({ type: actionTypes.SET_TTD_SPD, ttd })
    })
}