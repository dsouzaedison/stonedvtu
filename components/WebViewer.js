import React, {Component} from 'react';
import {
    WebView
} from 'react-native';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded
} from 'react-native-admob';

export default class WebViewer extends Component {
    componentDidMount() {
        if(this.props.navigation.state.params.type && this.props.navigation.state.params.type === 'results') {
            AdMobInterstitial.setAdUnitID('ca-app-pub-5210992602133618/2025314533');
            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }
    }

    render() {
        return (
            <WebView
                source={{uri: this.props.navigation.state.params.url}}
            />
        );
    }
}
