import React, {Component} from 'react';
import {
    View,
    Alert,
    WebView,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator
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
import Icon from 'react-native-vector-icons/FontAwesome';

const WEBVIEW_REF = 'WEBVIEW_REF';

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

    showLoader = (flag) => {
        this.setState({
            showLoader: flag
        });
    }

    downloadFile = (url, filename, type, mime, showLoader) => {
        let _this = this;
        this.showLoader(true);
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
                    <TouchableOpacity>
                        <Icon name="heart" style={styles.controls}/>
                    </TouchableOpacity>
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
                        <Icon name="times" style={styles.controls}/>
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
        mime: state.mime
    };
}

export default connect(mapStateToProps, null)(WebViewer)