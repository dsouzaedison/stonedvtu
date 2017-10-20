import React, {Component} from 'react';
import {
    AppRegistry
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

let store = createStore(appReducer);

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
    Contact: {
        screen: Contact
    }
}, {
    initialRouteName: 'Splash',
    headerMode: 'none',
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
        this.setState(store.getState());
        const unsubscribe = store.subscribe(this.syncState);

        // console.log('Redux: ' + JSON.stringify(store.getState()))
    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        )
    }
}

AppRegistry.registerComponent('stonedvtu', () => App);
