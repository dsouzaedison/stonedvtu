import * as actionsTypes from '../actionCreators/actionTypes';
import * as constants from '../components/constants';

const initialState = {
    app: {},
    appData: {},
    baseUrl: 'https://vtuauracore.firebaseapp.com/',
    circulars: {},
    endpoints: {},
    syllabus: {},
    newsUrl: '',
    news: [],
    activeTab: 'Home',
    contentType: 'VTU AURA',
    sem: 1,
    branch: 'cs',
    subject: {},
    fileUrl: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf',
    pdfUrl: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf',
    loadStatus: {
        app: true,
        news: true
    },
    localAppData: {
        token: null,
        hash: null,
        favorites: []
    },
    token: null,
    splashText: 'Loading...'
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
                    mediaBaseUrl: action.payload.mediaBaseUrl,
                    syllabus: action.payload.appData.syllabus,
                    notes: action.payload.appData.notes,
                    questionPapers: action.payload.appData.questionPapers,
                    endpoints: action.payload.endpoints,
                    contentType: 'VTU AURA',
                    loadStatus: Object.assign(
                        {},
                        state.loadStatus,
                        {app: false}
                    ),
                    isAvailable: {...action.payload.isAvailable},
                    resultsUrl: action.payload.resultsUrl,
                    circulars: action.payload.circulars
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
        case actionsTypes.UPDATE_FILE_URL:
            // let url = state.mediaBaseUrl;
            //
            // if (state.contentType === constants.contentType.syllabus) {
            //     url += state.endpoints.syllabus;
            // } else if (state.contentType === constants.contentType.notes) {
            //     url += state.endpoints.notes;
            // } else if (state.contentType === constants.contentType.questionPapers) {
            //     url += state.endpoints.questionPapers;
            // }
            //
            // if (state.sem !== 1 && state.sem !== 2) {
            //     if (state.branch === constants.branches.CS) {
            //         url += 'cs/';
            //     } else if (state.branch === constants.branches.IS) {
            //         url += 'is/'
            //     } else if (state.branch === constants.branches.EC) {
            //         url += 'ec/'
            //     } else if (state.branch === constants.branches.ME) {
            //         url += 'me/'
            //     } else if (state.branch === constants.branches.CV) {
            //         url += 'cv/'
            //     } else if (state.branch === constants.branches.AE) {
            //         url += 'ae/'
            //     }
            // } else {
            //     url += 'junior/';
            // }
            //
            // if (state.contentType !== 'Syllabus') {
            //     if (state.sem === 1 || state.sem === 2) {
            //         // url += 'junior/';
            //     } else if (state.sem === 3) {
            //         url += 'three/'
            //     } else if (state.sem === 4) {
            //         url += 'four/'
            //     } else if (state.sem === 5) {
            //         url += 'five/'
            //     } else if (state.sem === 6) {
            //         url += 'six/'
            //     } else if (state.sem === 7) {
            //         url += 'seven/'
            //     } else if (state.sem === 8) {
            //         url += 'eight/'
            //     }
            //
            //     url += state.subject.folderName + '/';
            // }

            return Object.assign(
                {},
                state,
                {fileUrl: action.payload}
            )

        case actionsTypes.UPDATE_CIRCULAR_PDF_URL:
            return Object.assign(
                {},
                state,
                {pdfUrl: action.payload}
            )

        case actionsTypes.LOAD_LOCAL_APP_DATA:
            return Object.assign(
                {},
                state,
                {
                    localAppData: action.payload,
                    appData: (action.payload.appData)? action.payload.appData.appData: null,
                    app: action.payload,
                    newsUrl: (action.payload.appData)? action.payload.appData.newsUrl: null,
                    mediaBaseUrl: (action.payload.appData)? action.payload.appData.mediaBaseUrl: null,
                    syllabus: (action.payload.appData)? action.payload.appData.appData.syllabus: null,
                    notes: (action.payload.appData)? action.payload.appData.appData.notes: null,
                    questionPapers: (action.payload.appData)? action.payload.appData.appData.questionPapers: null,
                    endpoints: (action.payload.appData)? action.payload.appData.endpoints: null,
                    contentType: 'VTU AURA',
                    loadStatus: Object.assign(
                        {},
                        state.loadStatus,
                        {app: false}
                    ),
                    isAvailable: (action.payload.appData)? {...action.payload.appData.isAvailable}: null,
                    resultsUrl: (action.payload.appData)? action.payload.appData.resultsUrl: null,
                    circulars: (action.payload.circulars)? action.payload.circulars : null
                }
        )

        case actionsTypes.SET_TOKEN:
            return Object.assign(
                {},
                state,
                {
                    token: action.payload
                }
            )

        case actionsTypes.SET_SPLASH_TEXT:
            return Object.assign(
                {},
                state,
                {
                    splashText: action.payload
                }
            )

        default:
            return state;
    }
}