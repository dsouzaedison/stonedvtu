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
    Alert,
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import Menu from './Menu';
import {connect} from 'react-redux';
import * as actionCreators from '../actionCreators';
import Loader from './Loader';
import RNFetchBlob from 'react-native-fetch-blob'
import * as constants from './constants';
import {NavigationActions} from "react-navigation";
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';
import {adIds} from "../config";
import Analytics from 'appcenter-analytics';

export class Favorites extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            favorites: []
        };
        this.closeDrawer = this.closeDrawer.bind(this);
    }

    componentDidMount() {
        Analytics.trackEvent('Favorites', {});
    }

    openDrawer = () => {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer() {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    showLoader = (flag) => {
        this.setState({
            isLoading: flag
        })
    }

    async deleteFavorite(item) {
        let localAppData = Object.assign({}, this.props.localAppData);
        localAppData.favorites.splice(localAppData.favorites.indexOf(item), 1);
        localAppData.favorites.reverse();
        localAppData.syncPending -= 1;

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
                        favoriteId: item.id
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
                        })
                        .catch(e => {
                            console.log(e);
                            ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
                        });
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    deleteFavoriteConfirm = (item) => {
        Alert.alert(
            'Are you sure?',
            '"' + item.title + '"' + ' will be removed',
            [
                {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                {text: 'Remove', onPress: () => this.deleteFavorite(item)},
            ],
            {cancelable: false}
        )
    }

    showError = () => {
        if (this.props.localAppData.favorites.length === 0)
            return '';
        else return styles.hidden;
    }

    render() {
        let favorites = Object.assign([], this.props.localAppData.favorites);
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu closeDrawer={this.closeDrawer} home_nav={this.props.navigation}/>}>
                {this.state.isLoading && <Loader/>}
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}/>
                            <AdMobBanner
                                adSize="smartBanner"
                                adUnitID={adIds.banner.favorites}
                                testDevices={[AdMobBanner.simulatorId]}
                                onAdFailedToLoad={error => console.error(error)}
                            />
                            <Image source={require('../assets/homebg.jpg')} style={styles.img}  blurRadius={8}>
                                <ScrollView style={(favorites.length === 0) ? styles.hidden : ''}>
                                    <FlatList
                                        data={favorites} keyExtractor={(item, index) => index}
                                        renderItem={({item}) => <FavoriteItem favorite={item}
                                                                              navigation={this.props.navigation}
                                                                              updateFileUrl={this.props.updateFileUrl}
                                                                              showLoader={this.showLoader}
                                                                              mime={this.props.mime}
                                                                              deleteFavoriteConfirm={this.deleteFavoriteConfirm}/>}
                                    />
                                </ScrollView>
                                <View style={[styles.errorMsg, this.showError()]}>
                                    <Icon name="heart-o"
                                          style={{color: '#fff', fontSize: 150, marginVertical: 15}}/>
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 18,
                                        textAlign: 'center',
                                        marginHorizontal: 10
                                    }}>Ah! You haven't added anything yet. Please add some content to favorites
                                        first.</Text>
                                </View>
                            </Image>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        )
    }
}

function downloadFile(url, filename, type, mime, showLoader) {
    showLoader(true);
    const downloadDest = `${RNFetchBlob.fs.dirs.DownloadDir}/` + 'VTUAura/' + filename;
    RNFetchBlob.config({
        fileCache: true,
        path: downloadDest,
        addAndroidDownloads: {
            notification: true,
            title: filename,
            description: 'VTU AURA - Download on PlayStore',
            mime: mime[type],
            mediaScannable: true,
        }
    })
        .fetch('GET', url)
        .then(function (res) {
            const android = RNFetchBlob.android;
            showLoader(false);
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

function FavoriteItem(props) {
    if (props.favorite.type === 'pdf') {
        return (
            <View style={styles.favoritesContainer}>
                <View style={styles.favoritesWrapper}>
                    <TouchableOpacity onPress={() => {
                        props.updateFileUrl(props.favorite.url);
                        props.navigation.navigate('PdfViewer');
                    }}>
                        <View style={styles.typeIconTitleWrapper}>
                            <View style={styles.typeIconWrapper}>
                                <Icon name="file-pdf-o" color="#fff" size={16}/>
                            </View>
                            <Text style={[styles.favoritesTitle]} ellipsizeMode="tail"
                                  numberOfLines={1}>
                                {props.favorite.title}
                            </Text>
                            {/*<Text style={[styles.favoritesTitle]} ellipsizeMode="tail" numberOfLines={1}>This is a very very very*/}
                            {/*very very very big title</Text>*/}
                        </View>
                    </TouchableOpacity>
                    <View style={styles.settingsContainer}>
                        <TouchableOpacity style={styles.settingWrapper}
                                          onPress={() => props.deleteFavoriteConfirm(props.favorite)}>
                            <Icon name="trash" style={styles.setting}/>
                        </TouchableOpacity>
                        {/*<View style={styles.settingWrapper}>*/}
                        {/*<Icon name="pencil" style={{color: '#fff', fontSize: 20, paddingHorizontal: 12, zIndex: 1}}/>*/}
                        {/*</View>*/}
                    </View>
                </View>
            </View>
        );
    }
    else if (props.favorite.type === 'webLink') {
        return (
            <View style={styles.favoritesContainer}>
                <View style={styles.favoritesWrapper}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('WebViewer', {
                            url: props.favorite.url,
                            adId: 'ca-app-pub-5210992602133618/3205807912'
                        });
                    }}>
                        <View style={styles.typeIconTitleWrapper}>
                            <View style={styles.typeIconWrapper}>
                                <Icon name="globe" color="#eee" size={20}/>
                            </View>
                            <Text style={[styles.favoritesTitle]} ellipsizeMode="tail"
                                  numberOfLines={1}>
                                {props.favorite.title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.settingsContainer}>
                        <TouchableOpacity style={styles.settingWrapper}
                                          onPress={() => props.deleteFavoriteConfirm(props.favorite)}>
                            <Icon name="trash" style={styles.setting}/>
                        </TouchableOpacity>
                        {/*<View style={styles.settingWrapper}>*/}
                        {/*<Icon name="pencil" style={{color: '#fff', fontSize: 20, paddingHorizontal: 12, zIndex: 1}}/>*/}
                        {/*</View>*/}
                    </View>
                </View>
            </View>
        );
    }
    else {
        return (
            <View style={styles.favoritesContainer}>
                <View style={styles.favoritesWrapper}>
                    <TouchableOpacity onPress={() => {
                        downloadFile(props.favorite.url, props.favorite.title, props.favorite.type, props.mime, props.showLoader);
                    }}>
                        <View>
                            <Text style={[styles.favoritesTitle]} ellipsizeMode="tail"
                                  numberOfLines={1}>{props.favorite.title}</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.settingsContainer}>
                        <TouchableOpacity style={styles.settingWrapper}
                                          onPress={() => props.deleteFavoriteConfirm(props.favorite)}>
                            <Icon name="trash" style={styles.setting}/>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#eee'
    },
    img: {
        width: Dimensions.get('window').width,
        flex: 1,
        flexDirection: 'column',
        height: null,
        justifyContent: 'center',
        alignItems: 'center'
    },
    favoritesContainer: {
        flex: 1,
        flexDirection: 'column',
        width: Dimensions.get('window').width
    },
    favoritesWrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(39, 39, 39, 0.8)',
        margin: 5,
        borderRadius: 3,
        borderColor: '#9c9c9c',
        borderWidth: 1,
        zIndex: 0,
    },
    favoritesTitle: {
        color: '#fff',
        fontSize: 18,
        padding: 10,
        width: Dimensions.get('window').width - 105
    },
    settingsContainer: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        flexDirection: 'row',
        width: 45
    },
    settingWrapper: {
        backgroundColor: 'rgba(80, 80, 80, 0.5)',
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#7e7e7e',
        flex: 1
    },
    setting: {
        color: '#cfcfcf',
        fontSize: 20,
        paddingHorizontal: 12,
        zIndex: 1
    },
    errorMsg: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    hidden: {
        display: 'none'
    },
    typeIconTitleWrapper: {
        flexDirection: 'row'
    },
    typeIconWrapper: {
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#555'
    }
});


function mapStateToProps(state) {
    return {
        token: state.token,
        localAppData: state.localAppData,
        baseUrl: state.baseUrl,
        endpoints: state.endpoints,
        favorites: state.localAppData.favorites,
        mime: state.mime
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFileUrl: (url) => {
            dispatch(actionCreators.updateFileUrl(url));
        },
        loadLocalAppData: (data) => {
            dispatch(actionCreators.loadLocalAppData(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)
