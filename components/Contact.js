import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Linking,
    StyleSheet,
    Dimensions,
    DrawerLayoutAndroid,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";

import Navbar from './Navbar';
import Menu from './Menu';
import AppCenter from "appcenter";

export class Contact extends Component {
    constructor() {
        super();
        this.state = {
            installID: ''
        };
    }

    componentDidMount() {
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
                            <View style={styles.errorContainer}>
                                <Image source={require('../assets/homebg.jpg')} style={styles.img}>
                                    <Icon name="envelope" style={styles.navIcon}/>
                                    <Text style={{color: '#fff', fontSize: 25, fontWeight: 'bold'}}>Want To Share
                                        Something?</Text>
                                    <Text
                                        style={{color: '#fff', fontSize: 18, marginHorizontal: 5, textAlign: 'center'}}>
                                        We're all ears! Drop us a mail.</Text>
                                    <Text style={{color: '#fff', fontSize: 15, marginHorizontal: 5}}>
                                        (We'll revert back to you ASAP. Promise! <Icon name="smile-o"/>)
                                    </Text>
                                    <TouchableOpacity style={styles.emailButton}
                                                      onPress={() => Linking.openURL("mailto:?to=vtuaura@gmail.com&subject=Token\=" + this.props.token + "/" + this.state.installID)}>
                                        <Text style={styles.emailBtnText}>
                                            <Icon name="paper-plane" style={styles.paperPlane}/> Create
                                        </Text>
                                    </TouchableOpacity>
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
    },
    emailButton: {
        borderWidth: 1,
        borderColor: '#fff',
        marginTop: 20,
        paddingVertical: 5,
        paddingHorizontal: 30,
        borderRadius: 4
    },
    emailBtnText: {
        color: '#fff',
        fontSize: 16
    },
    paperPlane: {
        color: '#fff',
        fontSize: 16,
        paddingRight: 5
    }
})

function mapStateToProps(state) {
    return {
        token: state.token,
    };
}

export default connect(mapStateToProps, null)(Contact);