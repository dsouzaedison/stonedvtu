import React, {Component} from 'react';
import * as actionCreators from '../actionCreators';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    ActivityIndicator
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";

export class Splash extends Component {
    constructor() {
        super();
        // this.state = {
        //     appData: {}
        // };
        // this.updateState = this.updateState.bind(this);
    }

    // updateState(newState) {
    //     this.props.dispatch(newState);
    //
    //     this.setState(newState, function () {
    //     });
    // }

    componentDidMount() {
        return fetch(this.props.baseUrl, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.props.saveAppData(responseJson);

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Home'}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
                // this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'ErrorPage'}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
                console.log(error.message);
            });
    }

    // paramsGenerator(data) {
    //     let {params} = this.props.navigation.state;
    //     return Object.assign({}, params, data);
    // }

    render() {
        return (
            <Image source={require('../assets/splash.jpg')} style={styles.container}>
                <StatusBar
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                <View style={styles.overlay}>
                    <ActivityIndicator color="#fff" size={30}/>
                    <Text style={styles.text}>Fetching Data...</Text>
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    loaderIcon: {
        color: '#fff',
        fontSize: 30
    },
    text: {
        color: '#fff',
        fontSize: 25,
        paddingHorizontal: 10
    }
});

function mapStateToProps(state) {
    return {
        baseUrl: state.baseUrl
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveAppData: (appData) => {
            dispatch(actionCreators.saveAppData(appData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);