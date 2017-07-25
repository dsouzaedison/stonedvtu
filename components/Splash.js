import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    ActivityIndicator
} from 'react-native';

export default class Splash extends Component {
    constructor() {
        super();
        this.state = {
            appData: {}
        };
    }

    updateState(newState) {
        this.setState(newState, function () {
        });
    }

    componentDidMount() {
        return fetch('http://www.conceptevt.com/stonedvtu/getData.php')
            .then((response) => response.json())
            .then((responseJson) => {
                // this.updateState({appData: responseJson[0]});
                console.log('Data Recieved : ' + responseJson[0]);
                this.props.navigation.navigate('Home', this.paramsGenerator({appData: responseJson[0]}));
            })
            .catch((error) => {
                console.log(error.message);
                throw error;
            });
    }

    paramsGenerator(data) {
        let {params} = this.props.navigation.state;
        return Object.assign({}, params, data);
    }

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