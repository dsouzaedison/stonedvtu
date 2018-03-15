import React, {Component} from 'react';
import {
    AppRegistry,
    Alert,
    Dimensions
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import {createStore, combineReducers} from 'redux';
import {Provider} from 'react-redux';

import * as actionCreators from './actionCreators';
import appReducer from './reducers';

import Splash from './components/Splash';
import Home from './components/Home';
import BranchSelector from './components/BranchSelector';
import Syllabus from './components/Syllabus';
import Notes from './components/Notes';
import SemSelector from './components/SemSelector';
import Subjects from './components/Subjects';
import StudyMaterials from './components/StudyMaterials';
import TechnologyNews from './components/TechnologyNews';
import PdfViewer from './components/PdfViewer';
import WebViewer from './components/WebViewer';
import ErrorPage from './components/ErrorPage';
import UnderProgress from "./components/UnderProgress";
import Contact from "./components/Contact";
import Circular from "./components/Circular";
import Favorites from "./components/Favorites";
import About from "./components/About";
import Analytics from 'appcenter-analytics';
import Terms from "./components/Terms";

let store = createStore(appReducer);
const screens = ['Home', 'Circular', 'Syllabus', 'Notes', 'Question Papers', 'Technology News', 'Contact Us', 'Favorites'];

const AppNavigator = StackNavigator({
    Splash: {
        screen: Splash
    },
    Home: {
        screen: Home
    },
    BranchSelector: {
        screen: BranchSelector
    },
    Syllabus: {
        screen: Syllabus
    },
    Notes: {
        screen: Notes
    },
    SemSelector: {
        screen: SemSelector
    },
    Subjects: {
        screen: Subjects
    },
    StudyMaterials: {
        screen: StudyMaterials
    },
    PdfViewer: {
        screen: PdfViewer
    },
    WebViewer: {
        screen: WebViewer
    },
    ErrorPage: {
        screen: ErrorPage
    },
    TechnologyNews: {
        screen: TechnologyNews
    },
    UnderProgress: {
        screen: UnderProgress
    },
    Circular: {
        screen: Circular
    },
    Contact: {
        screen: Contact
    },
    Favorites: {
        screen: Favorites
    },
    About: {
        screen: About
    },
    Terms: {
        screen: Terms
    }
}, {
    initialRouteName: 'Splash',
    headerMode: 'none',
    transitionConfig: () => ({
        screenInterpolator: false
    })
});


export class App extends Component {
    constructor() {
        super();
        this.state = store.getState();
        this.syncState = this.syncState.bind(this);
    }

    syncState() {
        this.setState(store.getState());
        // console.log('Store Updated!!! \n' + JSON.stringify(this.state.appData));
    }

    componentDidMount() {
        Analytics.trackEvent('App Loaded', {});
        this.setState(store.getState());
        const unsubscribe = store.subscribe(this.syncState);
        // console.log('Redux: ' + JSON.stringify(store.getState()))
        Dimensions.addEventListener('change', ({ window: { width, height } }) => {
            const orientation = width > height ? 'LANDSCAPE' : 'PORTRAIT';
            if(orientation === 'LANDSCAPE') {
                Alert.alert(
                    'Currently we do not support Landscape Mode',
                    'We request you to go back to Portrait Mode to enjoy hassle free services.',
                    [
                        {text: 'Okay', onPress: () => console.log('Okay Pressed!'), style: 'cancel'}
                    ],
                    {cancelable: true}
                )
            }
        });
    }

    getCurrentRouteName(navigationState) {
        if (!navigationState) {
            return null;
        }
        const route = navigationState.routes[navigationState.index];
        // dive into nested navigators
        if (route.routes) {
            return this.getCurrentRouteName(route);
        }
        return route.routeName;
    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigator onNavigationStateChange={(prevState, currentState) => {
                    let currentScreen = this.getCurrentRouteName(currentState);
                    let prevScreen = this.getCurrentRouteName(prevState);
                    // console.log('Prev Screen: ' + prevScreen);
                    // console.log('Curr Screen: ' + currentScreen);
                    if(screens.indexOf(currentScreen) > -1) {
                        if(currentScreen === 'Home')
                            currentScreen = 'VTU Aura';
                        store.dispatch(actionCreators.changeContentType(currentScreen));
                    }
                }}/>
            </Provider>
        )
    }
}

AppRegistry.registerComponent('VTUAura', () => App);
