import React, {Component} from 'react';
import {
    DrawerLayoutAndroid,
    Text,
    View,
    StyleSheet,
    ScrollView,
    BackHandler
} from 'react-native';
import Navbar from "./Navbar";
import Menu from "./Menu";
import Analytics from "appcenter-analytics";
import * as actionCreators from "../actionCreators";
import {connect} from "react-redux";

export class Terms extends Component {
    openDrawer = () => {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer = () => {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    componentDidMount() {
        Analytics.trackEvent('Terms Page', {});
        BackHandler.addEventListener('hardwareBackPress', this.nativeBackHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.nativeBackHandler);
    }

    nativeBackHandler = () => {
        this.props.changeContentType('About');
        this.props.navigation.goBack();
        return true;
    }

    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu closeDrawer={this.closeDrawer} home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}/>
                    <View style={styles.container}>
                        <ScrollView>
                            <Text style={[styles.section, styles.bold]}>
                                End-User License Agreement (EULA) of VTU Aura
                            </Text>
                            <Text style={styles.section}>
                                This End-User License Agreement ("EULA") is a legal agreement between you and JS Freaks
                            </Text>
                            <Text style={styles.section}>
                                This EULA agreement governs your acquisition and use of our VTU Aura software
                                ("Software") directly from JS Freaks or indirectly through a JS Freaks authorized reseller
                                or distributor (a "Reseller").
                            </Text>
                            <Text style={styles.section}>
                                Please read this EULA agreement carefully before completing the installation process and
                                using the VTU Aura software. It provides a license to use the VTU Aura software and
                                contains warranty information and liability disclaimers.
                            </Text>
                            <Text style={styles.section}>
                                If you register for a free trial of the VTU Aura software, this EULA agreement will also
                                govern that trial. By clicking "accept" or installing and/or using the VTU Aura
                                software, you are confirming your acceptance of the Software and agreeing to become
                                bound by the terms of this EULA agreement.
                            </Text>
                            <Text style={styles.section}>
                                If you are entering into this EULA agreement on behalf of a company or other legal
                                entity, you represent that you have the authority to bind such entity and its affiliates
                                to these terms and conditions. If you do not have such authority or if you do not agree
                                with the terms and conditions of this EULA agreement, do not install or use the
                                Software, and you must not accept this EULA agreement.
                            </Text>
                            <Text style={styles.section}>
                                This EULA agreement shall apply only to the Software supplied by JS Freaks herewith
                                regardless of whether other software is referred to or described herein. The terms also
                                apply to any JS Freaks updates, supplements, Internet-based services, and support
                                services for the Software, unless other terms accompany those items on delivery. If so,
                                those terms apply.
                            </Text>
                            <Text style={[styles.section, styles.bold]}>
                                License Grant
                            </Text>
                            <Text style={styles.section}>
                                JS Freaks hereby grants you a personal, non-transferable, non-exclusive licence to use
                                the VTU Aura software on your devices in accordance with the terms of this EULA
                                agreement.
                            </Text>
                            <Text style={styles.section}>
                                You are permitted to load the VTU Aura software (for example a PC, laptop, mobile or
                                tablet) under your control. You are responsible for ensuring your device meets the
                                minimum requirements of the VTU Aura software.
                            </Text>
                            <Text style={styles.section}>
                                You are not permitted to:
                            </Text>
                            <Text style={styles.section}>
                                - Edit, alter, modify, adapt, translate or otherwise change the whole or any part of the
                                Software nor permit the whole or any part of the Software to be combined with or become
                                incorporated in any other software, nor decompile, disassemble or reverse engineer the
                                Software or attempt to do any such things {'\n\n'}
                                - Reproduce, copy, distribute, resell or otherwise use the Software for any commercial
                                purpose{'\n\n'}
                                - Allow any third party to use the Software on behalf of or for the benefit of any third
                                party{'\n\n'}
                                - Use the Software in any way which breaches any applicable local, national or
                                international law{'\n\n'}
                                - use the Software for any purpose that JS Freaks considers is a breach of this EULA
                                agreement
                            </Text>
                            <Text style={[styles.section, styles.bold]}>
                                Intellectual Property and Ownership
                            </Text>
                            <Text style={styles.section}>
                                JS Freaks shall at all times retain ownership of the Software as originally downloaded by
                                you and all subsequent downloads of the Software by you. The Software (and the
                                copyright, and other intellectual property rights of whatever nature in the Software,
                                including any modifications made thereto) are and shall remain the property of JS Freaks.
                            </Text>
                            <Text style={styles.section}>
                                JS Freaks reserves the right to grant licences to use the Software to third parties.
                            </Text>
                            <Text style={[styles.section, styles.bold]}>
                                Termination
                            </Text>
                            <Text style={styles.section}>
                                This EULA agreement is effective from the date you first use the Software and shall
                                continue until terminated. You may terminate it at any time upon written notice to
                                JS Freaks.
                            </Text>
                            <Text style={styles.section}>
                                It will also terminate immediately if you fail to comply with any term of this EULA
                                agreement. Upon such termination, the licenses granted by this EULA agreement will
                                immediately terminate and you agree to stop all access and use of the Software. The
                                provisions that by their nature continue and survive will survive any termination of
                                this EULA agreement.
                            </Text>
                            <Text style={[styles.section, styles.bold]}>
                                Governing Law
                            </Text>
                            <Text style={styles.section}>
                                This EULA agreement, and any dispute arising out of or in connection with this EULA
                                agreement, shall be governed by and construed in accordance with the laws of India.
                            </Text>
                        </ScrollView>
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
        backgroundColor: '#fff',
        paddingHorizontal: 10
    },
    section: {
        paddingVertical: 5
    },
    bold: {
        fontWeight: 'bold'
    }
});


function mapDispatchToProps(dispatch) {
    return {
        changeContentType: (text) => {
            dispatch(actionCreators.changeContentType(text));
        }
    }
}

export default connect(null, mapDispatchToProps)(Terms)