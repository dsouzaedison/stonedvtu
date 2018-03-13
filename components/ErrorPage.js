import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    DrawerLayoutAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from "./Navbar";
import {NavigationActions} from 'react-navigation';

export default class ErrorPage extends Component {
    constructor() {
        super();
        this.openDrawer = this.openDrawer.bind(this);
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    connect = () => {
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'Splash'}),
            ]
        });

        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles.errorContainer}>
                <Navbar hideNav="errorPage"/>
                <Image source={require('../assets/homebg.jpg')} style={styles.img} blurRadius={10}>
                    <Icon name="frown-o" style={styles.navIcon}/>
                    <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>Bummer!</Text>
                    <Text style={{color: '#fff', fontSize: 18, marginHorizontal: 5, textAlign: 'center'}}>Your Internet
                        Doesn't Seem To Be Working.</Text>
                    <Text style={{color: '#fff', fontSize: 15, marginHorizontal: 5, textAlign: 'center'}}>(Please check
                        your internet settings)</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={this.connect}>
                        <Text style={styles.retryText}><Icon name="wifi" color="#fff" size={18}/> Connect</Text>
                    </TouchableOpacity>
                </Image>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#eee'
        // resizeMode: 'cover',
    },
    errorContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: Dimensions.get('window').width,
        // resizeMode: 'cover',
        flex: 1,
        flexDirection: 'column',
        height: null,
        justifyContent: 'center',
        alignItems: 'center'
    },
    navIcon: {
        fontSize: 100,
        color: '#fff'
    },
    retryButton: {
        marginTop: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#fff',
        paddingHorizontal: 30,
        paddingVertical: 5,
        borderRadius: 4
    },
    retryText: {
        color: '#fff',
        fontSize: 18
    }
})