import * as actionsTypes from '../actionCreators/actionTypes';
import * as actionCreators from '../actionCreators';

const initialState = {
    app: {},
    appData: {},
    baseUrl: 'https://vtuauracore.firebaseapp.com/',
    syllabus: {},
    newsUrl: '',
    news: [],
    activeTab: 'Home',
    contentType: 'VTU AURA',
    sem: 1,
    branch: 'cs',
    subject: {},
    loadStatus: {
        app: true,
        news: true
    }
};

export default function appReducer(state = initialState, action) {
    switch (action.type) {
        case actionsTypes.SAVE_APP_DATA:
            return Object.assign(
                {},
                state,
                {
                    app: action.payload,
                    appData: action.payload.appData,
                    newsUrl: action.payload.newsUrl,
                    syllabus: action.payload.appData.syllabus,
                    loadStatus: Object.assign(
                        {},
                        state.loadStatus,
                        {app: false}
                    )
                }
            );
        case actionsTypes.SAVE_NEWS_DATA:
            return Object.assign(
                {},
                state,
                {
                    news: action.payload,
                    loadStatus: Object.assign(
                        {},
                        state.loadStatus,
                        {news: false}
                    )
                }
            );
        case actionsTypes.CHANGE_TAB:
            return Object.assign(
                {},
                state,
                {activeTab: action.payload}
            );
        case actionsTypes.CHANGE_CONTENT_TYPE:
            return Object.assign(
                {},
                state,
                {contentType: action.payload}
            );
        case actionsTypes.SEM_CHANGED:
            return Object.assign(
                {},
                state,
                {sem: action.payload}
            )
        case actionsTypes.BRANCH_CHANGED:
            return Object.assign(
                {},
                state,
                {branch: action.payload}
            )
        case actionsTypes.SUBJECT_CHANGED:
            return Object.assign(
                {},
                state,
                {subject: action.payload}
            )

        default:
            return state;
    }
}