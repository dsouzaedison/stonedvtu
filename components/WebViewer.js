import React, {Component} from 'react';
import {
    View,
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

export default class WebViewer extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true
        };
    }
    componentDidMount() {
        if(this.props.navigation.state.params.type && this.props.navigation.state.params.type === 'results') {
            AdMobInterstitial.setAdUnitID('ca-app-pub-5210992602133618/2025314533');
            AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
        }
    }

    render() {
        let {url, adId} = this.props.navigation.state.params;
        return (
           <View style={styles.container}>
               <AdMobBanner
                   adSize="smartBanner"
                   adUnitID={adId}
                   testDevices={[AdMobBanner.simulatorId]}
                   onAdFailedToLoad={error => console.error(error)}
               />
               <WebView
                   source={{uri: url}}
                   onLoadStart={() => this.setState({isLoading: true})}
                   onLoadEnd={() => this.setState({isLoading: false})}
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
