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

export default class Settings extends Component {
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
                            <Image source={require('../assets/banneredit.png')} style={styles.bannerTop}>
                                <View style={styles.bannerOverlay}>
                                    <View style={styles.naviconWrapper}>
                                        <View style={styles.iconWrapperLeft}>
                                            <Icon name="bars" style={styles.barsIcon}/>
                                        </View>
                                        <View style={styles.iconWrapperRight}>
                                            <Icon name="bell" style={styles.bellIcon}/>
                                        </View>
                                    </View>
                                    <View style={styles.avatarBlock}>
                                        <View style={styles.avatarWrapper}></View>
                                        <Text style={styles.userName}>Welcome, Guest</Text>
                                    </View>
                                </View>
                            </Image>
                            <ScrollView>
                                <Image source={require('../assets/quote1.jpg')} style={styles.storyBanner}></Image>
                                <Image source={require('../assets/quote1.jpg')} style={styles.storyBanner}></Image>
                                <Image source={require('../assets/quote1.jpg')} style={styles.storyBanner}></Image>
                                <Image source={require('../assets/quote1.jpg')} style={styles.storyBanner}></Image>
                                {/*<View style={styles.storyCard}>*/}
                                {/*<Image source={require('../assets/homeBanner.jpg')} style={styles.storyBanner}>*/}
                                {/*<Text style={{padding: 10, color: '#fff', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'flex-end'}}>*/}
                                {/*"Lorem Ipsum is simply dummy text of the printing and typesetting industry."*/}
                                {/*</Text>*/}
                                {/*</Image>*/}
                                {/*</View>*/}
                            </ScrollView>
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

    }
});

