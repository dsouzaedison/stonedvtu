import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';

export default class Home extends Component {
    render() {
        let navigationView = (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>
                    I'm in the Drawer!
                </Text>
            </View>
        );

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                renderNavigationView={() => navigationView}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar/>
                            <ScrollView>
                                <View style={{flexDirection: 'row'}}>

                                    <Image source={require('../assets/diamonds.png')} style={styles.diamonds}>
                                        <ScrollView>
                                            <View style={[styles.card, styles.pink]}>

                                            </View>
                                            <View style={[styles.card, styles.grey]}>

                                            </View>
                                            <View style={[styles.card, styles.blue]}>

                                            </View>
                                            <View style={[styles.card, styles.purple]}>

                                            </View>
                                            <View style={[styles.card, styles.white]}>

                                            </View>
                                            <View style={[styles.card, styles.cyan]}>

                                            </View>
                                            <View style={[styles.card, styles.orange]}>

                                            </View>
                                            <View style={[styles.card, styles.pink]}>

                                            </View>
                                            <View style={[styles.card, styles.white]}>

                                            </View>
                                        </ScrollView>
                                    </Image>
                                </View>
                            </ScrollView>

                            {/*<View style={styles.storyCard}>*/}
                            {/*<Image source={require('../assets/homeBanner.jpg')} style={styles.storyBanner}>*/}
                            {/*<Text style={{padding: 10, color: '#fff', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'flex-end'}}>*/}
                            {/*"Lorem Ipsum is simply dummy text of the printing and typesetting industry."*/}
                            {/*</Text>*/}
                            {/*</Image>*/}
                            {/*</View>*/}

                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        backgroundColor: '#eee'
        // resizeMode: 'cover',
    },
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    bannerTop: {
        height: 200,
        width: null
    },
    bannerOverlay: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0)',
        padding: 10
    },
    naviconWrapper: {
        flexDirection: 'row',
    },
    iconWrapperLeft: {
        flex: 1,
    },
    iconWrapperRight: {
        flex: 1,
        alignItems: 'flex-end'
    },
    barsIcon: {
        color: '#fff',
        fontSize: 30,
    },
    bellIcon: {
        color: '#fff',
        fontSize: 30,
    },
    avatarBlock: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarWrapper: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#fff'
    },
    userName: {
        flex: 1,
        alignItems: 'center',
        color: '#fff',
        fontSize: 25,
        marginTop: 15
    },
    storyCard: {
        flexDirection: 'column',
        // height: 250,
        backgroundColor: '#888',
        // margin: 5
    },
    storyBanner: {
        resizeMode: 'cover',
        width: null,
        height: 300,
        margin: 5,
        borderColor: '#fff',
        borderWidth: 4

    },
    diamonds: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    card: {
        height: 100,
        margin: 5,
        padding: 10,
        borderRadius: 4,
        elevation: 2
    },
    white: {
        backgroundColor: 'rgba(255,255,255, 0.9)'
    },
    pink: {
        backgroundColor: 'rgba(233, 30, 99, 0.9)'
    },
    blue: {
        backgroundColor: 'rgba(33,150,243, 0.9)'
    },
    purple: {
        backgroundColor: 'rgba(156,39,176,0.9)'
    },
    cyan: {
        backgroundColor: 'rgba(0, 188, 212, 0.9)'
    },
    orange: {
        backgroundColor: 'rgba(255, 152, 0, 0.9)'
    },
    grey: {
        backgroundColor: 'rgba(96, 125, 139, 0.9))'
    }
});

