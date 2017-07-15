import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from './components/Login';
import Home from './components/Home';
import Settings from './components/Settings';
import Syllabus from './components/Syllabus';
import Notes from './components/Notes';
import SemSelector from './components/SemSelector';
import Subjects from './components/Subjects';
import PdfViewer from './components/PdfViewer';
import WebViewer from './components/WebViewer';

const appNavigator = StackNavigator({
    Login: {
        screen: Login
    },
    Home: {
        screen: Home
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
    Settings: {
        screen: Settings
    },
    PdfViewer: {
        screen: PdfViewer
    },
    WebViewer: {
        screen: WebViewer
    }
}, {
    initialRouteName: 'Subjects',
    headerMode: 'none',
});

AppRegistry.registerComponent('stonedvtu', () => appNavigator);
