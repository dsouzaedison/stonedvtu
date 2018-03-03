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

const WEBVIEW_REF = 'WEBVIEW_REF';

AdMobInterstitial.setAdUnitID('ca-app-pub-5210992602133618/1104561635');

export class WebViewer extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            visitedLinks: [],
            showLoader: false,
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
        if (this.props.navigation.state.params.type && this.props.navigation.state.params.type === 'results') {
            AdMobInterstitial.setAdUnitID('ca-app-pub-5210992602133618/2025314533');
            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }
    }

    isFavorite = (currentItem, getIndex) => {
        let localAppData = Object.assign({}, this.props.localAppData);

        if(localAppData.favorites.length === 0) {
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

    async toggleFavorite(title, type, url, fileName='') {
        let favorite = {
            title,
            customTitle: '',
            type,
            url
        };

        if (this.isFavorite(favorite)) {
            this.deleteFavorite(favorite);
        } else {
            try {
                let localAppData = Object.assign({}, this.props.localAppData);
                localAppData.favorites.push(favorite);

                await AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                    if (!err) {
                        console.log('Favorite Added Successfully!');
                        localAppData.contentType = this.props.contentType;
                        this.props.loadLocalAppData(localAppData);
                        ToastAndroid.show('Added to Favorites !', ToastAndroid.SHORT);
                    } else {
                        ToastAndroid.show('Something went wrong !', ToastAndroid.SHORT);
                    }
                });
            }
            catch (e) {
                console.log(e);
            }
        }
    }

    async deleteFavorite(item) {
        let index = this.isFavorite(item, true);

        if (index >= 0) {
            let localAppData = Object.assign({}, this.props.localAppData);
            localAppData.favorites.splice(index, 1);

            try {
                await AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                    if (err) {
                        console.log(err);
                        ToastAndroid.show('Something went wrong !', ToastAndroid.SHORT);
                    } else {
                        localAppData.contentType = this.props.contentType;
                        this.props.loadLocalAppData(localAppData);
                        ToastAndroid.show('Favorite Removed !', ToastAndroid.SHORT);
                    }
                })
            }
            catch (e) {
                console.log(e);
            }
        }

    }

    showLoader = (flag) => {
        this.setState({
            showLoader: flag
        });
    }

    downloadFile = (url, filename, type, mime, showLoader) => {
        let _this = this;
        this.showLoader(true);
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
                            'Sorry! No Apps Found.',
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

    goBack = () => {
        this.refs[WEBVIEW_REF].goBack();
    }

    goForward = () => {
        this.refs[WEBVIEW_REF].goForward();
    }

    reload = () => {
        this.refs[WEBVIEW_REF].reload();
    }

    render() {
        let {url, adId} = this.props.navigation.state.params;
        let item = {
            title: this.state.webViewState.title,
            url: this.state.webViewState.url,
            type: 'webLink'
        };

        return (
            <View style={styles.container}>
                {this.state.showLoader && <Loader/>}
                <AdMobBanner
                    adSize="smartBanner"
                    adUnitID={adId}
                    testDevices={[AdMobBanner.simulatorId]}
                    onAdFailedToLoad={error => console.error(error)}
                />
                <WebView
                    ref={WEBVIEW_REF}
                    source={{uri: url}}
                    onLoadStart={() => this.setState({isLoading: true})}
                    onLoadEnd={() => this.setState({isLoading: false})}
                    onNavigationStateChange={webViewState => this.handleDownloadLinks(webViewState)}
                    onError={() => {
                        Alert.alert(
                            'OOPS! Looks like your internet service is down!',
                            'Please press back and try again',
                            [
                                {text: 'Okay', onPress: () => console.log('Cancel Pressed'), style: 'cancel'}
                            ],
                            {cancelable: true}
                        )
                    }}
                />
                <View style={styles.bottomBar}>
                    <TouchableOpacity onPress={() => this.goBack()}>
                        <Icon name="arrow-left" style={[styles.controls, this.state.webViewState.canGoBack? styles.active: styles.disabled]}/>
                    </TouchableOpacity>
                    {
                        !this.isFavorite(item) &&
                        <TouchableOpacity onPress={() => this.toggleFavorite(item.title, 'webLink', item.url)}>
                            <Icon name="heart-o" style={styles.controls}/>
                        </TouchableOpacity>
                    }
                    {
                        this.isFavorite(item) &&
                        <TouchableOpacity onPress={() => this.toggleFavorite(item.title, 'webLink', item.url)}>
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
                        <Icon name="arrow-right" style={[styles.controls, this.state.webViewState.canGoForward? styles.active: styles.disabled]}/>
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
        localAppData: state.localAppData,
        mime: state.mime
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