import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    Dimensions,
    Linking,
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import Menu from './Menu';
import {adIds} from "../config";
import * as actionCreators from '../actionCreators';
import {connect} from 'react-redux';
import Analytics from 'appcenter-analytics';

import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';
import AppCenter from "appcenter";

export class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            news: [],
            installID: null
        };

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    componentDidMount() {
        Analytics.trackEvent('Home', {});
        AppCenter.getInstallId()
            .then(installID => this.setState({
                installID
            }));
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer() {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    // async fetchData() {
    //     try {
    //         const value = await AsyncStorage.getItem('userInfo');
    //         if (value !== null) {
    //             // We have data!!
    //             console.log(value);
    //         }
    //     } catch (error) {
    //         // Error retrieving data
    //     }
    // }

    render() {
        let banners = this.props.externalLinks.bannerImages;
        let externalItems = Object.keys(banners).reverse().map((key) => {
            if (banners[key].showBanner) {
                if (banners[key].type === 'webLink') {
                    Analytics.trackEvent('Ad Impression', {id: banners[key].id});
                    return (
                        <TouchableOpacity key={key} onPress={() => {
                            Analytics.trackEvent('Ad Click', {id: banners[key].id});
                            this.props.navigation.navigate('WebViewer', {
                                url: banners[key].meta.url,
                                adId: adIds.banner.clientAdWebView,
                                showAd: banners[key].meta.showAd
                            })
                        }}>
                            <View style={[styles.imageCard]}>
                                <Image source={{uri: banners[key].url}}
                                       style={[styles.storyImage, banners[key].style]}/>
                                <View style={styles.linkHint}>
                                    <Icon name="globe" style={styles.linkHintIcon}/>
                                </View>
                            </View>
                            {
                                banners[key].meta.text &&
                                <Text
                                    style={[styles.linkHintText, banners[key].meta.textStyle]}>{banners[key].meta.text}</Text>
                            }
                        </TouchableOpacity>
                    )
                } else {
                    Analytics.trackEvent('Ad Impression(Only Image)', {id: banners[key].id});
                    return (
                        <View style={[styles.imageCard]} key={key}>
                            <Image source={{uri: banners[key].url}}
                                   style={[styles.storyImage, banners[key].style]}/>
                        </View>
                    )
                }
            }
        });

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu home_nav={this.props.navigation} closeDrawer={this.closeDrawer}
                                                  activeTab={0}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation} contentType={false}/>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../assets/homebg.jpg')} style={styles.diamonds}>
                                    <ScrollView style={{marginBottom: 60}}>
                                        {externalItems}
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/home/abdulKalam.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/home/steveJobs.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <AdMobBanner
                                                adSize="smartBanner"
                                                adUnitID={adIds.banner.home}
                                                testDevices={[AdMobBanner.simulatorId]}
                                                onAdFailedToLoad={error => console.error(error)}
                                            />
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/home/louholtz.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/home/quote.png')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={{alignItems: 'center'}}>
                                            <AdMobBanner
                                                adSize="smartBanner"
                                                adUnitID={adIds.banner.home}
                                                testDevices={[AdMobBanner.simulatorId]}
                                                onAdFailedToLoad={error => console.error(error)}
                                            />
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/home/motivation1.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/home/plan.png')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => {
                                                Analytics.trackEvent('Place Ad Request', {deviceId: this.props.token, installId: this.state.installID});
                                                Linking.openURL("mailto:?to=vtuaura@gmail.com&subject=Advertisement%20Placement%20Request");
                                            }}>
                                            <Text style={styles.marketText}>Contact us to place your Ad.</Text>
                                        </TouchableOpacity>
                                    </ScrollView>
                                </Image>
                            </View>

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
    storyImage: {
        width: null,
        height: 230,
        borderRadius: 4,
        resizeMode: 'cover'
    },
    card: {
        margin: 5,
        borderRadius: 4,
        elevation: 2,
        borderColor: '#fff',
        borderWidth: 0
    },
    imageCard: {
        margin: 5,
        borderRadius: 4,
        elevation: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    white: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)'
    },
    pink: {
        backgroundColor: 'rgba(233, 30, 99, 0.6)'
    },
    blue: {
        backgroundColor: 'rgba(33, 150, 243, 0.6)'
    },
    purple: {
        backgroundColor: 'rgba(156, 39, 176, 0.6)'
    },
    cyan: {
        backgroundColor: 'rgba(0, 188, 212, 0.6)'
    },
    orange: {
        backgroundColor: 'rgba(255, 152, 0, 0.6)'
    },
    grey: {
        backgroundColor: 'rgba(96, 125, 139, 0.6))'
    },
    newsImage: {
        width: null,
        height: 160,
        borderRadius: 4,
        resizeMode: 'cover',
    },
    newsImageOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    newsTitle: {
        color: '#fff',
        fontSize: 20,
        padding: 10
    },
    newsDescription: {
        margin: 10,
        color: '#d1d1d1',
        fontSize: 16
    },
    readMoreWrapper: {
        alignItems: 'flex-end',
        backgroundColor: 'rgba(255,255,255,0.2)'
    },
    dateWrapper: {
        flex: 1,
    },
    date: {
        fontSize: 16,
        color: '#fff',
        margin: 10
    },
    readMore: {
        flex: 1,
        fontSize: 16,
        color: '#fff',
        margin: 10,
        textAlign: 'right',
    },
    drawerContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#555'
    },
    drawerBackgroundImage: {
        flex: 1,
        flexDirection: 'column',
        height: null,
        width: null,
        resizeMode: 'cover'
    },
    drawerTitleImg: {
        flex: 0.3,
        flexDirection: 'row',
        width: null,
        resizeMode: 'cover'
    },
    drawerOverlay: {
        flex: 0.7,
        flexDirection: 'column',
        backgroundColor: 'rgba(255,255,255,0.3)'
    },
    drawerTitleImgOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        padding: 10
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderColor: '#fff',
        borderWidth: 3
    },
    menuItemWrapper: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.4)',
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        borderTopWidth: 1,
        borderColor: '#cbcbcb'
    },
    menuItem: {
        // flex: 1,
        color: '#4e4e4e',
        fontSize: 18
    },
    itemActive: {
        backgroundColor: 'rgba(255,255,255,0.7)',
        flexDirection: 'row'
    },
    navIconWrapper: {
        flex: 0.4,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
    },
    marketText: {
        color: '#8c8c8c',
        textAlign: 'center',
        marginVertical: 5
    },
    linkHint: {
        backgroundColor: 'rgba(255,255,255, 0.3)',
        alignSelf: 'baseline',
        padding: 4,
        position: 'absolute',
        bottom: 0,
        right: 0,
        borderTopLeftRadius: 4,
        borderBottomRightRadius: 4
    },
    linkHintIcon: {
        color: '#eee'
    },
    linkHintText: {
        color: '#eee',
        backgroundColor: 'rgba(255,255,255, 0.2)',
        marginHorizontal: 5,
        marginTop: -5,
        padding: 10,
        fontSize: 16
    }
});

function mapStateToProps(state) {
    return {
        token: state.token,
        newsUrl: state.newsUrl,
        news: state.news,
        loadStatus: state.loadStatus.news,
        externalLinks: state.externalLinks
    };
}

export default connect(mapStateToProps)(Home)