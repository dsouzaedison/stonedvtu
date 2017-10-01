import * as actionsTypes from './actionTypes';

export function isLoaded(status) {
    return {
        type: actionsTypes.LOAD_STATUS,
        status
    }
}

export function saveAppData(payload) {
    return {
        type: actionsTypes.SAVE_APP_DATA,
        payload
    }
}