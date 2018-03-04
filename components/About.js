import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Clipboard,
    ToastAndroid,
    TouchableOpacity,
    DrawerLayoutAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import Menu from './Menu';
import DeviceInfo from "react-native-device-info";
import {connect} from "react-redux";

export class About extends Component {
    openDrawer = () => {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer = () => {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    copyToClipboard = (text) => {
        Clipboard.setString(text);
        ToastAndroid.show('Copied to Clipboard!', ToastAndroid.SHORT);
    }

    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu closeDrawer={this.closeDrawer} home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}
                                    contentType={this.props.contentType}/>
                            <Image source={require('../assets/loginbg.jpg')} style={styles.aboutContainer}>
                                <Image source={require('../assets/logo.png')} style={styles.logo}/>
                                <Text style={styles.appName}>VTU Aura</Text>
                                <Text style={styles.appVersion}>App Version: {DeviceInfo.getVersion()}</Text>
                                <View style={styles.set}>
                                    <Text style={styles.property}>Device Identifier</Text>
                                    <TouchableOpacity onPress={() => this.copyToClipboard(this.props.token)}>
                                        <Text style={styles.value}>{this.props.token}</Text>
                                    </TouchableOpacity>
                                </View>
                            </Image>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        )
    }
}

const styles = new StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#eee'
    },
    aboutContainer: {
        flex: 1,
        flexDirection: 'column',
        width: null,
        height: null,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        height: 100,
        width: 100,
        resizeMode: 'cover'
    },
    appName: {
        fontSize: 22,
        color: '#fff',
        fontWeight: 'bold'
    },
    appVersion: {
        fontSize: 16,
        color: '#fff'
    },
    property: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold'
    },
    value: {
        fontSize: 20,
        color: '#dcdcdc'
    },
    set: {
        marginVertical: 15,
        alignItems: 'center'
    }
})


function mapStateToProps(state) {
    return {
        token: state.token,
    };
}

export default connect(mapStateToProps, null)(About);