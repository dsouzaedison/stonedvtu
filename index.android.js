import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import {StackNavigator} from 'react-navigation';
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
    }
}, {
    initialRouteName: 'Home',
    headerMode: 'none',
});

AppRegistry.registerComponent('stonedvtu', () => appNavigator);
