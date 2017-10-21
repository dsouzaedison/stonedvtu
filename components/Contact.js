import  React, {Component} from 'react';
import {View, Text, Image, StyleSheet, Dimensions, DrawerLayoutAndroid} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

import Navbar from './Navbar';
import Menu from './Menu';

export default class Contact extends Component {
    constructor() {
        super();
        this.openDrawer = this.openDrawer.bind(this);
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}
                                    contentType={this.props.contentType}/>
                            <View style={styles.errorContainer}>
                                <Image source={require('../assets/homebg.jpg')} style={styles.img}>
                                    <Icon name="envelope" style={styles.navIcon}/>
                                    <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>Want To Share Something?</Text>
                                    <Text style={{color: '#fff', fontSize: 18, marginHorizontal: 5, textAlign: 'center'}}>We're all ears!</Text>
                                    <Text style={{color: '#fff', fontSize: 18, marginHorizontal: 5, textAlign: 'center'}}>Drop us a mail at admin@thisapp.com</Text>
                                    <Text style={{color: '#fff', fontSize: 15, marginHorizontal: 5}}>
                                        (We'll revert back to you ASAP. Promise! <Icon name="smile-o"/>)
                                    </Text>
                                </Image>
                            </View>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
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
        fontSize: 85,
        color: '#fff'
    }
})