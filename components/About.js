import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    Clipboard,
    Dimensions,
    ToastAndroid,
    TouchableOpacity,
    DrawerLayoutAndroid
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from './Navbar';
import Menu from './Menu';
import DeviceInfo from "react-native-device-info";
import {connect} from "react-redux";
import AppCenter from "appcenter";
import Analytics from 'appcenter-analytics';
import {ENV} from "../config";
import * as actionCreators from "../actionCreators";

let mode = (ENV==='dev')?  '(Developement Mode)': '';

export class About extends Component {
    constructor() {
        super();
        this.state = {
            installID: '',
            showDeviceId: false,
            showInstallId: false
        };
    }

    componentDidMount() {
        Analytics.trackEvent('About', {});
        AppCenter.getInstallId()
            .then(installID => this.setState({
                installID
            }));
    }

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
                            <Image source={require('../assets/homebg.jpg')} style={styles.aboutContainer} blurRadius={10}>
                                <Image source={require('../assets/logo.png')} style={styles.logo}/>
                                <Text style={styles.appName}>VTU Aura</Text>
                                <Text style={styles.appVersion}>App Version: {DeviceInfo.getVersion()}</Text>
                                <Text style={{color: '#eee'}}>{mode}</Text>
                               <View style={styles.idWrapper}>
                                   <View style={styles.set}>
                                       <Text style={styles.property}>Device ID</Text>
                                       <View style={styles.valueContainer}>
                                           {
                                               !this.state.showDeviceId &&
                                               <TouchableOpacity onPress={() => this.setState({
                                                   showDeviceId: true
                                               })}>
                                                   <MaterialIcon name="remove-red-eye" style={styles.fontIcon}/>
                                               </TouchableOpacity>
                                           }
                                           <TouchableOpacity onPress={() => this.copyToClipboard(this.props.token)}>
                                               {
                                                   !this.state.showDeviceId &&
                                                   <MaterialIcon name="content-copy" style={styles.fontIcon}/>
                                               }
                                               {
                                                   this.state.showDeviceId &&
                                                   <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="middle">{this.props.token}</Text>
                                               }
                                           </TouchableOpacity>
                                       </View>
                                   </View>
                                   <View style={styles.set}>
                                       <Text style={styles.property}>Install ID</Text>
                                       <View style={styles.valueContainer}>
                                           {
                                               !this.state.showInstallId &&
                                               <TouchableOpacity onPress={() => this.setState({
                                                   showInstallId: true
                                               })}>
                                                   <MaterialIcon name="remove-red-eye" style={styles.fontIcon}/>
                                               </TouchableOpacity>
                                           }
                                           <TouchableOpacity onPress={() => this.copyToClipboard(this.state.installID)}>
                                               {
                                                   !this.state.showInstallId &&
                                                   <MaterialIcon name="content-copy" style={styles.fontIcon}/>
                                               }
                                               {
                                                   this.state.showInstallId &&
                                                   <Text style={styles.valueText} numberOfLines={1} ellipsizeMode="middle">{this.state.installID}</Text>
                                               }
                                           </TouchableOpacity>
                                       </View>
                                   </View>
                               </View>
                                <View style={styles.messageWrapper}>
                                    <Text style={styles.message}>Thank you for being a part of VTU Aura. If you liked
                                        this app please rate us on Play Store. Also share this app with your
                                        friends. If you have any suggestions, please let us know in the
                                        contact section.</Text>
                                </View>
                                <TouchableOpacity style={styles.eulaButton} onPress={() => {
                                    this.props.changeContentType('Terms');
                                    this.props.navigation.navigate('Terms');
                                }}>
                                    <Text style={styles.eulaButtonText}><MaterialCommunityIcon name="seal" style={styles.seal}/> License Agreement</Text>
                                </TouchableOpacity>
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
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold'
    },
    appVersion: {
        fontSize: 16,
        color: '#fff'
    },
    property: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold'
    },
    valueContainer: {
        flexDirection: 'row'
    },
    valueText: {
        fontSize: 18,
        color: '#dcdcdc',
        width: Dimensions.get('window').width/2 - 20,
        paddingHorizontal: 10,
        marginTop: 15
    },
    set: {
        marginTop: 20,
        alignItems: 'center',
        width: Dimensions.get('window').width/2
    },
    messageWrapper: {
        paddingHorizontal: 25,
        marginTop: 30
    },
    message: {
        borderTopWidth: 1,
        borderTopColor: '#b3b3b3',
        color: '#d1d1d1',
        textAlign: 'center',
        paddingTop: 15
    },
    fontIcon: {
        color: '#fff',
        fontSize: 30,
        marginTop: 10,
        marginHorizontal: 10
    },
    idWrapper: {
        flexDirection: 'row',
    },
    eulaButton: {
        marginTop: 20
    },
    eulaButtonText: {
        color: '#eee',
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    },
    seal: {
        color: '#fff',
        fontSize: 14
    }
})


function mapStateToProps(state) {
    return {
        token: state.token,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        changeContentType: (contentType) => {
            dispatch(actionCreators.changeContentType(contentType));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(About);