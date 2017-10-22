import  React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, DrawerLayoutAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class ErrorPage extends Component {
    constructor() {
        super();
        this.openDrawer = this.openDrawer.bind(this);
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    render() {
        return (
            <View style={styles.errorContainer}>
                <Image source={require('../assets/homebg.jpg')} style={styles.img}>
                    <Icon name="frown-o" style={styles.navIcon}/>
                    <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>Bummer!</Text>
                    <Text style={{color: '#fff', fontSize: 18, marginHorizontal: 5, textAlign: 'center'}}>Your Internet Doesn't Seem To Be Working.</Text>
                    <Text style={{color: '#fff', fontSize: 15, marginHorizontal: 5, textAlign: 'center'}}>(Please check your internet settings and restart the app)</Text>
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
    }
})