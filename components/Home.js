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
            installID: null,
            tags: [],
            articles: [],
            techNewsEnabled: false
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
        let tagNames = this.props.techNews.tags;
        let tags = tagNames.map(tag => {
            return {name: tag, selected: false};
        });
        this.setState({
            tags: tags,
            techNewsEnabled: this.props.techNews.isEnabled,
            articles: this.props.techNews.articles
        });
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer() {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    getSelectedTagStyle = (flag) => {
        if (flag) {
            return styles.selectedTag;
        }
    }

    getSelectedTagTextStyle = (flag) => {
        if (flag) {
            return styles.selectedTagName;
        }
    }

    checkActiveTags = () => {
        let activeTags = this.state.tags.filter(tag => tag.selected);
        if (activeTags.length > 0)
            return true;
    }

    matchActiveTags = (tags) => {
        let matched = false;
        this.state.tags.forEach(stateTag => {
            tags.forEach(currentTag => {
                if (stateTag.selected && stateTag.name === currentTag) {
                    matched = true;
                    return matched;
                }
            })
        });

        return matched;
    }

    render() {
        let banners = Object.assign([], this.props.externalLinks.bannerImages);
        let articles = Object.assign([], this.state.articles);

        let tagsJSX = this.state.tags.map((tag, index) => {
            return (
                <TouchableOpacity style={[styles.tagWrapper, this.getSelectedTagStyle(this.state.tags[index].selected)]}
                                  onPress={() => {
                                      let tags = this.state.tags;
                                      tags[index].selected = !tags[index].selected;
                                      this.setState({
                                          tags: tags
                                      });
                                  }} key={index}>
                    <Text
                        style={[styles.tagName, this.getSelectedTagTextStyle(this.state.tags[index].selected)]}>{tag.name}</Text>
                </TouchableOpacity>
            )
        });

        let articleJSX = articles.reverse().map((item, index) => {
            if (item.isEnabled) {
                if (item.type === 'webLink' && this.matchActiveTags(item.tags)) {
                    Analytics.trackEvent('Article Impression', {id: item.id});
                    return (
                        <TouchableOpacity key={index} onPress={() => {
                            Analytics.trackEvent('Article Click', {id: item.id});
                            this.props.navigation.navigate('WebViewer', {
                                url: item.meta.contentUrl,
                                adId: adIds.banner.clientAdWebView,
                                showAd: item.meta.showAd
                            })
                        }}>
                            <View style={[styles.imageCard]}>
                                <Image source={{uri: item.meta.imageUrl}}
                                       style={[styles.storyImage, item.meta.imageStyle]}/>
                                <View style={styles.linkHint}>
                                    <Icon name="globe" style={styles.linkHintIcon}/>
                                </View>
                            </View>
                            {
                                item.meta.text &&
                                <Text
                                    style={[styles.linkHintText, item.meta.textStyle]}>{item.meta.text}</Text>
                            }
                        </TouchableOpacity>
                    )
                }
            }
        });

        let serverBanners = banners.reverse().map((item, index) => {
            if (item.isEnabled) {
                if (item.type === 'webLink') {
                    Analytics.trackEvent('Ad Impression', {id: item.id});
                    return (
                        <TouchableOpacity key={index} onPress={() => {
                            Analytics.trackEvent('Ad Click', {id: item.id});
                            this.props.navigation.navigate('WebViewer', {
                                url: item.meta.contentUrl,
                                adId: adIds.banner.clientAdWebView,
                                showAd: item.meta.showAd
                            })
                        }}>
                            <View style={[styles.imageCard]}>
                                <Image source={{uri: item.meta.imageUrl}}
                                       style={[styles.storyImage, item.meta.imageStyle]}/>
                                <View style={styles.linkHint}>
                                    <Icon name="globe" style={styles.linkHintIcon}/>
                                </View>
                            </View>
                            {
                                item.meta.text &&
                                <Text
                                    style={[styles.linkHintText, item.meta.textStyle]}>{item.meta.text}</Text>
                            }
                        </TouchableOpacity>
                    )
                } else {
                    Analytics.trackEvent('Content Impression - Home Banners', {id: item.id});
                    return (
                        <View style={[styles.imageCard]} key={index}>
                            <Image source={{uri: item.meta.imageUrl}}
                                   style={[styles.storyImage, item.meta.imageStyle]}/>
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
                            <View style={{flexDirection: 'row', flex: 1}}>
                                <Image source={require('../assets/homebg.jpg')} style={styles.diamonds}>
                                    <View>
                                        <ScrollView>
                                            {
                                                this.state.techNewsEnabled &&
                                                <View>
                                                    <ScrollView horizontal={true}>
                                                        {tagsJSX}
                                                    </ScrollView>
                                                </View>
                                            }
                                            {articleJSX}
                                            {serverBanners}
                                            {
                                                !this.checkActiveTags() &&
                                                <View>
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
                                                            Analytics.trackEvent('Place Ad Request', {
                                                                deviceId: this.props.token,
                                                                installId: this.state.installID
                                                            });
                                                            Linking.openURL("mailto:?to=vtuaura@gmail.com&subject=Advertisement%20Placement%20Request");
                                                        }}>
                                                        <Text style={styles.marketText}>Contact us to place your
                                                            Ad.</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            }
                                        </ScrollView>
                                    </View>
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
        backgroundColor: '#888'
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
        resizeMode: 'cover',
        width: null,
        height: null
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
    },
    tagWrapper: {
        borderColor: '#fff',
        borderWidth: 2,
        paddingVertical: 5,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginHorizontal: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4
    },
    tagName: {
        color: '#fff',
        fontSize: 16
    },
    selectedTag: {
        backgroundColor: '#fff'
    },
    selectedTagName: {
        color: '#555'
    }
});

function mapStateToProps(state) {
    return {
        token: state.token,
        newsUrl: state.newsUrl,
        news: state.news,
        loadStatus: state.loadStatus.news,
        externalLinks: state.externalLinks,
        techNews: state.techNews
    };
}

export default connect(mapStateToProps)(Home)