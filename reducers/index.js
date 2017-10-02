import * as actionsTypes from '../actionCreators/actionTypes';
import * as actionCreators from '../actionCreators';

const initialState = {
    app: {},
    appData: {},
    baseUrl: 'https://vtuauracore.firebaseapp.com/',
    syllabus: {},
    newsUrl: '',
    news: [],
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
                ...state,
                {
                    app: action.payload,
                    appData: action.payload.appData,
                    newsUrl: action.payload.newsUrl,
                    syllabus: action.payload.syllabus,
                    loadStatus: {
                        app: false,
                        news: state.loadStatus.news
                    }
                }
            );
        case actionsTypes.SAVE_NEWS_DATA: return Object.assign(
            {},
            ...state,
            {
                news: action.payload,
                loadStatus: {
                    app: state.loadStatus.app,
                    news: false
                }
            }
        );

        default:
            return state;
    }
}