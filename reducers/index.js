import * as actionsTypes from '../actionCreators/actionTypes';
import * as actionCreators from '../actionCreators';

const initialState = {
    appLoaded: false,
    appData: {},
    message: 'Welcome to Redux'
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case actionsTypes.LOAD_STATUS:
            return Object.assign(
                {},
                ...state,
                {appLoaded: action.status}
            );
        case actionsTypes.SAVE_APP_DATA:
            return Object.assign(
                {},
                ...state,
                {
                    appData: action.payload,
                    appLoaded: appReducer(state, actionCreators.isLoaded(true)).appLoaded
                }
            );

        default:
            return state;
    }
}