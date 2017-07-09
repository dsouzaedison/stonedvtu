import React, {Component} from 'react';
import {
    AppRegistry
} from 'react-native';
import {StackNavigator} from 'react-navigation';
import Login from './components/Login';

const appNavigator = StackNavigator({
    Login: {
        screen: Login
    }
}, {
    initialRoute: Login,
    headerMode: 'none'
});

AppRegistry.registerComponent('stonedvtu', () => appNavigator);
