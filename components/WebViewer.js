import React, {Component} from 'react';
import {
    View,
    Alert,
    WebView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded
} from 'react-native-admob';
import {connect} from 'react-redux';
import RNFetchBlob from "react-native-fetch-blob";
import Loader from './Loader';
import * as actionCreators from '../actionCreators';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {adIds} from "../config";
import Analytics from 'appcenter-analytics';

const WEBVIEW_REF = 'WEBVIEW_REF';

export class WebViewer extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            visitedLinks: [],
            showLoader: false,
            showExternalLoader: false,
            webViewState: {
                "canGoForward": false,
                "canGoBack": false,
                "loading": null,
                "title": "",
                "url": "",
                "target": 0
            }
        };
    }

    componentDidMount() {
        Analytics.trackEvent('WebViewer', {});
        if (this.props.navigation.state.params.type && this.props.navigation.state.params.type === 'results') {
            Analytics.trackEvent('Results', {});
            AdMobInterstitial.setAdUnitID(adIds.interstitial.results);
            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }
    }

    isFavorite = (currentItem, getIndex) => {
        let localAppData = Object.assign({}, this.props.localAppData);

        if (localAppData.favorites.length === 0) {
            if (getIndex) {
                return -1;
            } else return false;
        } else {
            let res = localAppData.favorites.filter((item, index) => {
                if (item.title === currentItem.title && item.type === currentItem.type && item.url === currentItem.url) {
                    item.index = index;
                    return item;
                }
            });

            if (getIndex) {
                if (res.length > 0)
                    return res[0].index;
                else return -1;
            }

            if (res.length > 0)
                return true;
            else return false;
        }
    }

    async addFavorite(title, type, url, fileName = '') {
        let favorite = {
            title,
            customTitle: '',
            type,
            url,
            timestamp: new Date()
        };

        // Add Favorite Locally
        let localAppData = Object.assign({}, this.props.localAppData);
        localAppData.favorites.reverse();
        localAppData.favorites.push(favorite);
        localAppData.syncPending += 1;
        // this.props.loadLocalAppData(localAppData);

        try {
            AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                if (!err) {
                    console.log('Favorite Added Successfully!');
                    localAppData.contentType = this.props.contentType;
                    localAppData.favorites.reverse();
                    this.props.loadLocalAppData(localAppData);
                    ToastAndroid.show('Added to Favorites !', ToastAndroid.SHORT);

                    // Add Favorite on Server - Non Blocking
                    let dataToSend = Object.assign({}, favorite);
                    dataToSend['token'] = this.props.token;

                    fetch(this.props.baseUrl + this.props.endpoints.addFavorite, {
                        method: 'POST',
                        headers: {
                            'Cache-Control': 'no-cache'
                        },
                        body: JSON.stringify(dataToSend)
                    })
                        .then(res => res.json())
                        .then(id => {
                            localAppData = Object.assign({}, this.props.localAppData);
                            localAppData.favorites.reverse();
                            localAppData.favorites.forEach(item => {
                                if (item.url === favorite.url) {
                                    item['id'] = id;
                                }
                            });
                            localAppData.syncPending -= 1;
                            // this.props.loadLocalAppData(localAppData);
                            try {
                                AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        this.props.loadLocalAppData(localAppData);
                                    }
                                });
                            } catch (e) {
                                console.log(e);
                            }
                        })
                        .catch(e => console.log(e));
                } else {
                    ToastAndroid.show('Something went wrong !', ToastAndroid.SHORT);
                }
            });
        } catch (e) {
            ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
        }
    }

    async deleteFavorite(item) {
        let index = this.isFavorite(item, true);
        let favoriteItem = this.getFavoriteWithId(item);
        //Delete Locally
        if (index >= 0) {
            let localAppData = Object.assign({}, this.props.localAppData);
            localAppData.favorites.splice(index, 1);
            localAppData.favorites.reverse();
            localAppData.syncPending += 1;
            // this.props.loadLocalAppData(localAppData);

            try {
                AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                    if (err) {
                        console.log(err);
                        ToastAndroid.show('Something went wrong !', ToastAndroid.SHORT);
                    } else {
                        localAppData.contentType = this.props.contentType;
                        localAppData.favorites.reverse();
                        this.props.loadLocalAppData(localAppData);
                        ToastAndroid.show('Favorite Removed !', ToastAndroid.SHORT);

                        //Delete on Server
                        let dataToSend = {
                            token: this.props.token,
                            favoriteId: favoriteItem.id
                        };

                        fetch(this.props.baseUrl + this.props.endpoints.deleteFavorite, {
                            method: 'POST',
                            headers: {
                                'Cache-Control': 'no-cache'
                            },
                            body: JSON.stringify(dataToSend)
                        })
                            .then(() => {
                                console.log('Favorite Deleted');
                                localAppData.syncPending -= 1;
                                // this.props.loadLocalAppData(localAppData);
                                AsyncStorage.setItem('localAppData', JSON.stringify(localAppData),(err) => console.log(err));
                            })
                            .catch(e => {
                                console.log(e);
                            });
                    }
                })
            }
            catch (e) {
                console.log(e);
                ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
            }
        }
    }

    showLoader = (flag) => {
        this.setState({
            showLoader: flag
        });
    }

    downloadFile = (url, filename, type, mime, showLoader) => {
        Analytics.trackEvent('File Download', {fileName: filename, url: url});
        let _this = this;
        this.showLoader(true);
        AdMobInterstitial.setAdUnitID(adIds.interstitial.contentDownloadWebView);
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());

        const downloadDest = `${RNFetchBlob.fs.dirs.DownloadDir}/` + 'VTUAura/' + filename;
        RNFetchBlob.config({
            fileCache: true,
            path: downloadDest,
            addAndroidDownloads: {
                notification: true,
                title: filename,
                description: 'VTU AURA - Download on PlayStore',
                mime: mime[type],
                mediaScannable: true
            }
        })
            .fetch('GET', url)
            .then(function (res) {
                const android = RNFetchBlob.android;
                _this.showLoader(false);
                android.actionViewIntent(res.path(), mime[type])
                    .catch(e => {
                        Alert.alert(
                            'No Supported Application.',
                            'Please install apps that supports ' + "'" + type + "'" + ' format and try again.',
                            [
                                {text: 'Okay', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
                            ],
                            {cancelable: true}
                        )
                    })
            })
            .catch(err => {
                console.log(err);
            })
    }

    handleDownloadLinks = (webViewState) => {
        // console.log(JSON.stringify(webViewState));
        this.setState({
            webViewState: webViewState
        });

        let chunks = webViewState.url.split('/');
        let lastChunk = chunks[chunks.length - 1];
        let temp = lastChunk.split('.');
        let extension = temp.slice(-1)[0];

        if (this.state.visitedLinks.indexOf(webViewState.url) > -1) {
            //Download
            console.log('Downloading...');
            this.setState({
                visitedLinks: []
            }, () => {
                this.downloadFile(webViewState.url, lastChunk, extension, this.props.mime, true)
            });
        } else {
            if (Object.keys(this.props.mime).indexOf(extension) > -1) {
                //Download Link Found
                let visitedLinks = Object.assign([], this.state.visitedLinks);
                visitedLinks.push(webViewState.url); //Save it since this function will be called twice for same link
                this.setState({
                    visitedLinks: visitedLinks
                }, () => {
                    this.refs[WEBVIEW_REF].stopLoading();
                    // console.log('Rejected');
                    return false;
                });
            } else {
                //Not a download link
                return true;
            }
        }
    }

    getFavoriteWithId = (currentItem) => {
        let localAppData = Object.assign({}, this.props.localAppData);
        let res = localAppData.favorites.filter((item, index) => {
            if (item.title === currentItem.title && item.type === currentItem.type && item.url === currentItem.url) {
                return item;
            }
        });
        if (res.length) {
            return res[0];
        }
    }

    goBack = () => {
        this.refs[WEBVIEW_REF].goBack();
    }

    goForward = () => {
        this.refs[WEBVIEW_REF].goForward();
    }

    reload = () => {
        this.refs[WEBVIEW_REF].reload();
    }

    handleError = () => {
        fetch('http://www.conceptevt.com/networktest.json', {
            method: 'GET'
        })
            .then(res => res.json())
            .then(data => {
                // console.log(data.data);
                Analytics.trackEvent('Broken Web Link', {url: this.props.navigation.state.params.url});
                this.setState({showExternalLoader: false});
                Alert.alert(
                    'This link appears to be broken',
                    'Possibly, this page might have been relocated.',
                    [
                        {text: 'Okay', onPress: () => this.props.navigation.goBack(), style: 'cancel'}
                    ],
                    {cancelable: true}
                );
            })
            .catch(err => {
                this.setState({showExternalLoader: false});
                this.props.navigation.navigate('ErrorPage');
            });
    };

    render() {
        let {url, adId} = this.props.navigation.state.params;
        let showAd = true;
        let item = {
            title: this.state.webViewState.title,
            url: this.state.webViewState.url,
            type: 'webLink'
        };

        if (this.props.navigation.state.params.hasOwnProperty('showAd')) {
            showAd = this.props.navigation.state.params.showAd;
        }

        return (
            <View style={styles.container}>
                {this.state.showExternalLoader && <Loader text="Please Wait..."/>}
                {
                    showAd &&
                    <AdMobBanner
                        adSize="smartBanner"
                        adUnitID={adId}
                        testDevices={[AdMobBanner.simulatorId]}
                        onAdFailedToLoad={error => console.error(error)}
                    />
                }
                <WebView
                    ref={WEBVIEW_REF}
                    source={{uri: url}}
                    onLoadStart={() => this.setState({isLoading: true})}
                    onLoadEnd={() => this.setState({isLoading: false})}
                    onNavigationStateChange={webViewState => this.handleDownloadLinks(webViewState)}
                    onError={() => {
                        this.setState({showExternalLoader: true});
                        this.handleError();
                    }}
                />
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={() => this.goBack()}>
                        <Icon name="arrow-left"
                              style={[styles.controls, this.state.webViewState.canGoBack ? styles.active : styles.disabled]}/>
                    </TouchableOpacity>
                    {
                        !this.isFavorite(item) &&
                        <TouchableOpacity onPress={() => this.addFavorite(item.title, 'webLink', item.url)}>
                            <Icon name="heart-o" style={styles.controls}/>
                        </TouchableOpacity>
                    }
                    {
                        this.isFavorite(item) &&
                        <TouchableOpacity onPress={() => this.deleteFavorite(item)}>
                            <Icon name="heart" style={styles.controls}/>
                        </TouchableOpacity>
                    }
                    <TouchableOpacity onPress={() => this.reload()}>
                        {
                            this.state.isLoading &&
                            <ActivityIndicator color="#fff" size={25}/>
                        }
                        {
                            !this.state.isLoading &&
                            <Icon name="refresh" color="#fff" size={25}/>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <MaterialIcon name="fullscreen-exit" size={30} color="#fff"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.goForward()}>
                        <Icon name="arrow-right"
                              style={[styles.controls, this.state.webViewState.canGoForward ? styles.active : styles.disabled]}/>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    container: {
        flex: 1
    },
    bottomBar: {
        height: 50,
        backgroundColor: '#555',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    controls: {
        color: '#fff',
        fontSize: 25
    },
    active: {
        color: '#fff'
    },
    disabled: {
        color: '#9e9e9e'
    }
});

function mapStateToProps(state) {
    return {
        token: state.token,
        localAppData: state.localAppData,
        mime: state.mime,
        baseUrl: state.baseUrl,
        endpoints: state.endpoints
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadLocalAppData: (localData) => {
            dispatch(actionCreators.loadLocalAppData(localData));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WebViewer)