import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from './components/Login';
import Home from './components/Home';
import Settings from './components/Settings';
import WebViewer from './components/WebViewer';

const appNavigator = StackNavigator({
    Login: {
        screen: Login
    },
    Home: {
        screen: Home
    },
    Settings: {
        screen: Settings
    },
    WebViewer: {
        screen: WebViewer
    }
}, {
    initialRouteName: 'Home',
    headerMode: 'none'
});

AppRegistry.registerComponent('stonedvtu', () => appNavigator);


//TODO: inshorts News