import React, {Component} from 'react';
import {
    View,
    Alert,
    WebView,
    StyleSheet,
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

const WEBVIEW_REF = 'WEBVIEW_REF';

export class WebViewer extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            visitedLinks: [],
            showLoader: false
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
                {
                    this.state.isLoading &&
                    <View style={styles.loader}>
                        <ActivityIndicator color="#f60" size={25}/>
                    </View>
                }
            </View>
        );
    }
}

const styles = new StyleSheet.create({
    container: {
        flex: 1
    },
    loader: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 10
    }
});

function mapStateToProps(state) {
    return {
        mime: state.mime
    };
}

export default connect(mapStateToProps, null)(WebViewer)