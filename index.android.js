import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from './components/Login';
import Settings from './components/Settings';
import Home from './components/Home';
import BranchSelector from './components/BranchSelector';
import Syllabus from './components/Syllabus';
import Notes from './components/Notes';
import SemSelector from './components/SemSelector';
import Subjects from './components/Subjects';
import StudyMaterials from './components/StudyMaterials';
import PdfViewer from './components/PdfViewer';
import WebViewer from './components/WebViewer';

const appNavigator = StackNavigator({
    Login: {
        screen: Login
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
