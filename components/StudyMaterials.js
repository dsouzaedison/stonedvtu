import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    FlatList,
    AsyncStorage,
    ToastAndroid,
    Dimensions
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import Menu from './Menu';
import {connect} from 'react-redux';
import * as actionCreators from '../actionCreators';
import * as constants from './constants';
import RNFetchBlob from 'react-native-fetch-blob'
import Loader from './Loader';
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';
import Analytics from 'appcenter-analytics';

export class StudyMaterials extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: false,
            news: [],
            pdf: null
        };

        this.openDrawer = this.openDrawer.bind(this);
        this.closeDrawer = this.closeDrawer.bind(this);
        this.isFavorite = this.isFavorite.bind(this);
        this.addFavorite = this.addFavorite.bind(this);
        this.deleteFavorite = this.deleteFavorite.bind(this);
        this.showAsFavorite = this.showAsFavorite.bind(this);
    }

    componentDidMount() {
        Analytics.trackEvent('Study Materials', {});
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer() {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    semInWord(sem) {
        if (sem === 1) {
            return 'one';
        } else if (sem === 2) {
            return 'one';
        } else if (sem === 3) {
            return 'three';
        } else if (sem === 4) {
            return 'four';
        } else if (sem === 5) {
            return 'five';
        } else if (sem === 6) {
            return 'six';
        } else if (sem === 7) {
            return 'seven';
        } else if (sem === 8) {
            return 'eight';
        }
    }

    isFavorite(currentItem, getIndex) {
        let localAppData = Object.assign({}, this.props.localAppData);

        if (!localAppData.favorites) {
            return false;
        }

        if (localAppData.favorites.length === 0) {
            if (getIndex) {
                return -1;
            } else return false;
        } else {
            let res = localAppData.favorites.filter((item, index) => {
                if (item.type === currentItem.type && item.url === currentItem.url) {
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

    showAsFavorite(title, fileName, type, url) {
        let favorite = {
            title,
            customTitle: '',
            type,
            url
        };

        if (this.isFavorite(favorite))
            return true;
        else return false;
    }

    async addFavorite(title, fileName, type, url) {
        let favorite = {
            title,
            customTitle: '',
            type,
            url,
            timestamp: new Date()
        };


        if (this.isFavorite(favorite)) {
            this.deleteFavorite(favorite);
        }
        else {
            try {
                let localAppData = Object.assign({}, this.props.localAppData);
                localAppData.favorites.reverse();
                localAppData.favorites.push(favorite);
                localAppData.syncPending += 1;
                // this.props.loadLocalAppData(localAppData);

                AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                    if (!err) {
                        console.log('Favorite Added Successfully!');
                        localAppData.contentType = this.props.contentType;
                        localAppData.favorites.reverse();
                        this.props.loadLocalAppData(localAppData);
                        ToastAndroid.show('Added to Favorites !', ToastAndroid.SHORT);

                        //Add on Server
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
                                localAppData.syncPending -= 1;
                                // this.props.loadLocalAppData(localAppData);
                                localAppData = Object.assign({}, this.props.localAppData);
                                localAppData.favorites.reverse();
                                localAppData.favorites.forEach(item => {
                                    if (item.url === favorite.url) {
                                        item['id'] = id;
                                    }
                                });
                                try {
                                    AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            localAppData.favorites.reverse();
                                            this.props.loadLocalAppData(localAppData);
                                        }
                                    });
                                } catch (e) {
                                    console.log(e);
                                }
                            })
                            .catch(e => {
                                ToastAndroid.show('Cannot connect to the Internet!', ToastAndroid.SHORT);
                            });
                    } else {
                        ToastAndroid.show('Something went wrong !', ToastAndroid.SHORT);
                    }
                });
            }
            catch (e) {
                ToastAndroid.show('Something Went Wrong!', ToastAndroid.SHORT);
                console.log(e);
            }
        }
    }

    async deleteFavorite(item) {
        let index = this.isFavorite(item, true);

        if (index >= 0) {
            let localAppData = Object.assign({}, this.props.localAppData);
            let favoriteItem = this.getFavoriteWithId(item);
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
                                AsyncStorage.setItem('localAppData', JSON.stringify(this.props.localAppData), (err) => {
                                    if (err) {
                                        console.log(err);
                                    }
                                });
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

    }

    showLoader = (flag) => {
        this.setState({
            isLoading: flag
        })
    }

    downloadFile = (url, filename, type, mime, showLoader) => {
        // console.log('url: ' + url + '\nfileName :' + filename);
        let urlSplit = url.split('/');
        urlSplit[urlSplit.indexOf('vtuaura') + 1] = 'download';
        urlSplit[urlSplit.length - 1] = 'watermark';
        let downloadUrl = urlSplit.join('/');
        downloadUrl += '/' + filename;

        AdMobInterstitial.setAdUnitID(this.props.ads.interstitial.download);
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());

        showLoader(true);
        const downloadDest = `${RNFetchBlob.fs.dirs.DownloadDir}/` + 'VTUAura/' + filename;
        RNFetchBlob.config({
            fileCache: true,
            path: downloadDest,
            // android only options, these options be a no-op on IOS
            addAndroidDownloads: {
                // Show notification when response data transmitted
                notification: true,
                // Title of download notification
                title: filename,
                // File description (not notification description)
                description: 'VTU AURA - Download on Play Store',
                mime: mime[type],
                // Make the file scannable  by media scanner
                mediaScannable: true,
            }
        })
            .fetch('GET', downloadUrl)
            .then(function (res) {
                const android = RNFetchBlob.android;
                showLoader(false);
                android.actionViewIntent(res.path(), mime[type])
                    .catch(e => {
                        Alert.alert(
                            'No Supported Application.',
                            'Please install apps that support ' + "'" + type + "'" + ' format and try again.',
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

    render() {
        const avatars = [
            require('../assets/branch/ec.png'),
            require('../assets/branch/cs.png'),
            require('../assets/branch/is.png'),
            require('../assets/branch/me.png'),
            require('../assets/branch/cv.png'),
            require('../assets/branch/ae.png')
        ];

        let avatar;

        if (this.props.branch === constants.branches.EC) {
            avatar = avatars[0];
        } else if (this.props.branch === constants.branches.CS) {
            avatar = avatars[1];
        } else if (this.props.branch === constants.branches.IS) {
            avatar = avatars[2];
        } else if (this.props.branch === constants.branches.ME) {
            avatar = avatars[3];
        } else if (this.props.branch === constants.branches.CV) {
            avatar = avatars[4];
        } else if (this.props.branch === constants.branches.AE) {
            avatar = avatars[5];
        }

        let content;
        if (this.props.contentType === 'Syllabus' && this.props.sem === 1) {
            content = this.props.syllabus.junior;
            // content = content[this.semInWord(this.props.sem)] || {};
        }
        else if (this.props.contentType === 'Syllabus') {
            content = this.props.syllabus[this.props.branch];
            content = content[this.semInWord(this.props.sem)] || {};
        } else {
            content = this.props.subject.materials || {};
        }

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
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}
                                    contentType={this.props.contentType}/>
                            <Image source={require('../assets/loginbg.jpg')} style={styles.branchesContainer}>
                                <ScrollView>
                                    <View style={{flex: 1, flexDirection: 'column'}}>
                                        <Image source={require('../assets/subjectsBanner.jpg')}
                                               style={styles.headerBackgroundImage}>
                                            <View style={styles.headerBannerOverlay}>
                                                <View style={styles.headerImageWrapper}>
                                                    <Image source={avatar}
                                                           style={styles.headerImage}/>
                                                </View>
                                                <Heading sem={this.props.sem} branch={this.props.branch}
                                                         title={this.props.subject.title}/>
                                            </View>
                                        </Image>
                                        <AdMobBanner
                                            adSize="smartBanner"
                                            adUnitID={this.props.ads.banner.studyMaterials}
                                            onAdFailedToLoad={error => console.error(error)}
                                        />
                                        <Image source={require('../assets/loginbg.jpg')}
                                               style={styles.branchesContainer}>
                                            <View style={styles.cardRow}>
                                                <DisplayItems navigation={this.props.navigation}
                                                              content={content}
                                                              contentType={this.props.contentType}
                                                              updateFileUrl={this.props.updateFileUrl}
                                                              addFavorite={this.addFavorite}
                                                              deleteFavorite={this.deleteFavorite}
                                                              downloadFile={this.downloadFile}
                                                              showLoader={this.showLoader}
                                                              mime={this.props.mime}
                                                              ads={this.props.ads}
                                                              showAsFavorite={this.showAsFavorite}/>
                                            </View>
                                        </Image>
                                    </View>
                                </ScrollView>
                            </Image>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        );
    }
}

function Heading(props) {
    if (props.title) {
        return <Text style={styles.headerText} numberOfLines={1} ellipsizeMode="tail">{props.title}</Text>;
    }
    else if (props.sem === 1) {
        return <Text style={styles.headerText}>{props.branch.toUpperCase()} / JUNIOR</Text>;
    } else {
        return <Text style={styles.headerText}>{props.branch.toUpperCase()} / SEM {props.sem}</Text>;
    }
}

function DisplayItems(props) {
    let listItems = [];
    if (!props.content || Object.keys(props.content).length === 0) {
        return <View><Text style={{color: '#fff', margin: 10, fontSize: 18, textAlign: 'center'}}>Sorry! No content is
            available yet.</Text></View>; //Prevent State Transition Error
    } else {
        Object.keys(props.content).forEach((index) => { //Firebase Object Conversion
                let item = props.content[index];
                let weblinkStyle = (item.type === 'webLink')? styles.webLinkTitleWrapper: null;

                listItems.push(
                    <View style={styles.cardWrapper} key={index}>
                        <View
                            style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => {
                                let adId = (item.adId)? item.adId: props.ads.banner.studyMaterialsWebView;
                                if (item.type === 'webLink') {
                                    props.navigation.navigate('WebViewer', {
                                        url: item.url,
                                        adId: adId,
                                        prevRoute: props.contentType
                                    })
                                }
                                else if (item.type === 'pdf') {
                                    props.updateFileUrl(item.url);
                                    props.navigation.navigate('PdfViewer', {prevRoute: props.contentType});
                                } else {
                                    props.downloadFile(item.url, item.fileName, item.type, props.mime, props.showLoader);
                                }
                            }} style={[styles.fileNameWrapper, weblinkStyle]}>
                                {
                                    item.type === 'webLink' &&
                                    <Icon name="globe" style={styles.subjectIcon}/>
                                }
                                {
                                    item.type !== 'webLink' &&
                                    <Icon name="file" style={styles.subjectIcon}/>
                                }
                                <Text style={styles.branchName} numberOfLines={1} ellipsizeMode="tail">{item.title}</Text>
                            </TouchableOpacity>
                            {
                                item.type !== 'webLink' &&
                                <TouchableOpacity onPress={() => {
                                    props.downloadFile(item.url, item.fileName, item.type, props.mime, props.showLoader);
                                }} style={[styles.optionsIconWrapper]}>
                                    <Icon name="download" style={[styles.subjectIcon]}/>
                                </TouchableOpacity>
                            }
                            <TouchableOpacity onPress={() => {
                                props.addFavorite(item.title, item.fileName, item.type, item.url);
                            }}
                                              style={[styles.optionsIconWrapper, props.showAsFavorite(item.title, item.fileName, item.type, item.url) ? styles.hidden : '']}>
                                <Icon name="heart-o" style={[styles.subjectIcon]}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                props.deleteFavorite(item);
                            }}
                                              style={[styles.optionsIconWrapper, props.showAsFavorite(item.title, item.fileName, item.type, item.url) ? '' : styles.hidden]}>
                                <Icon name="heart" style={[styles.subjectIcon]}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            }
        );

        return <View>{listItems}</View>;
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
        backgroundColor: '#555'
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
        // height: 100,
        margin: 5,
        // padding: 10,
        borderRadius: 4,
        elevation: 2,
        borderColor: '#fff',
        borderWidth: 0
    },
    imageCard: {
        margin: 5,
        borderRadius: 4,
        elevation: 2,
        borderColor: '#fff',
        borderWidth: 0
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
    headerBackgroundImage: {
        // flex: 0.3,
        flexDirection: 'column',
        height: 150,
        width: null,
        resizeMode: 'cover',
        // justifyContent: 'center',
        // alignItems: 'center',
        opacity: 0.8
    },
    headerBannerOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImageWrapper: {
        height: 70,
        width: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderColor: '#fff',
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    headerImage: {
        height: 40,
        width: 40
    },
    headerText: {
        fontSize: 22,
        color: '#fff',
        marginVertical: 5
    },
    cardRow: {
        flex: 0.3,
        flexDirection: 'column'
    },
    cardWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderColor: '#424242',
        borderWidth: 0.5,
        paddingHorizontal: 5,
    },
    branchesContainer: {
        flex: 1,
        flexDirection: 'column',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    subjectIcon: {
        color: '#fff',
        fontSize: 22,
        paddingHorizontal: 10,
        marginTop: 3,
        width: 42
    },
    branchName: {
        fontSize: 20,
        color: '#fff',
        width: Dimensions.get('window').width - 130
    },
    branchIcon: {
        height: 40,
        width: 40,
        padding: 5,
        resizeMode: 'contain'
        // borderRadius: 25,
        // borderWidth: 3,
        // borderColor: '#fff'
    },
    hidden: {
        display: 'none'
    },
    optionsIconWrapper: {
        // flex: 0.2,
        alignItems: 'center',
        paddingVertical: 10,
        justifyContent: 'center',
        height: 47,
        width: 42,
        alignSelf: 'baseline'
    },
    fileNameWrapper: {
        flexDirection: 'row',
        paddingVertical: 10,
        width: Dimensions.get('window').width - 90
    },
    webLinkTitleWrapper: {
        width: Dimensions.get('window').width - 50
    }
});

function mapStateToProps(state) {
    return {
        ads: state.ads,
        token: state.token,
        sem: state.sem,
        branch: state.branch,
        subject: state.subject,
        contentType: state.contentType,
        baseUrl: state.baseUrl,
        mediaBaseUrl: state.mediaBaseUrl,
        endpoints: state.endpoints,
        syllabus: state.syllabus,
        fileUrl: state.fileUrl,
        mime: state.mime,
        localAppData: state.localAppData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateFileUrl: (url) => {
            dispatch(actionCreators.updateFileUrl(url));
        },
        loadLocalAppData: (localData) => {
            dispatch(actionCreators.loadLocalAppData(localData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(StudyMaterials)
