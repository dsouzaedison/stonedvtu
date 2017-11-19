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

export function saveNewsData(payload) {
    return {
        type: actionsTypes.SAVE_NEWS_DATA,
        payload
    }
}

export function updateLoadStatus(status) {
    return {
        type: actionsTypes.SAVE_NEWS_DATA,
        status
    }
}

export function changeTab(payload) {
    return {
        type: actionsTypes.CHANGE_TAB,
        payload
    }
}

export function changeContentType(payload) {
    return {
        type: actionsTypes.CHANGE_CONTENT_TYPE,
        payload
    }
}

export function setSemester(payload) {
    return {
        type: actionsTypes.SEM_CHANGED,
        payload
    }
}

export function setBranch(payload) {
    return {
        type: actionsTypes.BRANCH_CHANGED,
        payload
    }
}

export function setSubject(payload) {
    return {
        type: actionsTypes.SUBJECT_CHANGED,
        payload
    }
}

export function updateFileUrl(payload) {
    return {
        type: actionsTypes.UPDATE_FILE_URL,
        payload
    }
}

export function updateCircularPdf(payload) {
    return {
        type: actionsTypes.UPDATE_CIRCULAR_PDF_URL,
        payload
    }
}

export function loadLocalAppData(payload) {
    return {
        type: actionsTypes.LOAD_LOCAL_APP_DATA,
        payload
    }
}

export function setToken(payload) {
    return {
        type: actionsTypes.SET_TOKEN,
        payload
    }
}