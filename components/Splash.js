import React, {Component} from 'react';
import * as actionCreators from '../actionCreators';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Alert,
    StatusBar,
    ActivityIndicator,
    AsyncStorage,
    ToastAndroid
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";
import DeviceInfo from "react-native-device-info";
import Analytics from 'appcenter-analytics';
import AppCenter from "appcenter";
import api from '../apis';
import {ENV, VERSION} from "../config";

export class Splash extends Component {
    constructor() {
        super();
        this.loadAppData = this.loadAppData.bind(this);
    }

    componentDidMount() {
        this.props.setSplashMessage('Loading App');
        this.loadLocalData()
            .then(() => {
                if (this.props.localAppData && this.props.localAppData.token) {
                    this.props.setSplashMessage('Fetching Data');
                    this.props.setToken(this.props.localAppData.token);
                    AppCenter.getInstallId()
                        .then(installId => {
                            Analytics.trackEvent('Splash', {deviceId: this.props.token, installId: installId});
                        });
                    if (this.props.localAppData.syncPending !== 0) {
                        api.syncFavorites({
                            token: this.props.token,
                            favorites: this.props.localAppData.favorites
                        })
                            .then(data => {
                                console.log('Favorites Sync Success: ' + JSON.stringify(data));
                                let localAppData = Object.assign({}, this.props.localAppData);
                                localAppData.syncPending = 0;
                                this.props.loadLocalAppData(localAppData);
                                AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                                    if (!err) {
                                        console.log('Local Storage updated after favorites sync');
                                    } else {
                                        console.log(e);
                                    }
                                });
                            })
                            .catch(e => console.log(e));
                    }
                    this.loadAppData();
                } else {
                    this.props.setSplashMessage('Authenticating');
                    this.getToken();
                }
            })
            .catch(e => console.error(e))
    }

    restoreBackup = (favorites, resolve, reject) => {
        return Alert.alert(
            'Welcome Back! Your Data is Safe.',
            'Do you wish to restore backup?',
            [
                {
                    text: 'Cancel', onPress: () => {
                        this.confirmDeleteBackup(favorites, resolve, reject);
                    }, style: 'cancel'
                },
                {
                    text: 'Restore', onPress: () => {
                        this.props.setSplashMessage('Restoring');
                        AsyncStorage.getItem('localAppData', (err, data) => {
                            if (err) {
                                console.log(err);
                                reject(err);
                            } else {
                                let localAppData = JSON.parse(data);
                                localAppData.favorites = favorites;
                                this.setDataOnLocalStorage(localAppData);
                                this.props.loadLocalAppData(localAppData);
                                resolve();
                            }
                        });
                    }
                },
            ],
            {cancelable: false}
        )
    }

    confirmDeleteBackup = (data, resolve, reject) => {
        return Alert.alert(
            'Are you sure?',
            'Data backup will be deleted permanently!',
            [
                {
                    text: 'Cancel', onPress: () => {
                        this.restoreBackup(data, resolve, reject);
                    }, style: 'cancel'
                },
                {
                    text: 'Agree', onPress: () => {
                        // Delete Backup From Server
                        api.deleteFavoritesBackup()
                            .then(() => {
                                console.log('Backup Deleted Successfully!');
                                resolve();
                            })
                            .catch(e => {
                                console.log(e);
                                reject(e);
                            });
                    }
                },
            ],
            {cancelable: false}
        )
    }

    getToken = () => {
        let authData = {
            uniqueID: DeviceInfo.getUniqueID(),
            manufacturer: DeviceInfo.getManufacturer(),
            brand: DeviceInfo.getBrand(),
            model: DeviceInfo.getModel(),
            deviceId: DeviceInfo.getDeviceId(),
            systemName: DeviceInfo.getSystemName(),
            bundleId: DeviceInfo.getBundleId(),
            deviceName: DeviceInfo.getDeviceName(),
            userAgent: DeviceInfo.getUserAgent(),
            phoneNumber: DeviceInfo.getPhoneNumber(),
            serialNumber: DeviceInfo.getSerialNumber(),
            ipAddress: '',
            macAddress: ''
        };

        let ipPromise = DeviceInfo.getIPAddress().then(data => {
            authData.ipAddress = data;
        });

        let macPromise = DeviceInfo.getMACAddress().then(data => {
            authData.macAddress = data;
        });

        Promise.all([ipPromise, macPromise])
            .then(data => {
                // this.props.setSplashMessage('Authenticating')
                api.registerDevice(authData)
                    .then((response) => {
                        let updatedLocalData = Object.assign({}, this.props.localAppData);
                        updatedLocalData.token = response;

                        console.log('Phone ID Firebase: ' + response);
                        this.props.setToken(response);
                        this.setDataOnLocalStorage(updatedLocalData);
                        //Send installId to server
                        AppCenter.getInstallId()
                            .then(installID => {
                                let mappingInfo = {
                                    token: response,
                                    installId: installID
                                };
                                api.mapDeviceToInstallId(mappingInfo)
                                    .then(mappingRes => {
                                        console.log('Mapping Success')
                                    })
                                    .catch(e => console.log('Mapping Failed'))
                            });

                        //Verify Favorites Backup
                        api.fetchFavoritesBackup(response)
                            .then(data => {
                                if (data.length) {
                                    new Promise((resolve, reject) => {
                                        this.restoreBackup(data, resolve, reject);
                                    })
                                        .then(() => this.loadAppData())
                                        .catch(e => console.log(e));
                                } else {
                                    this.loadAppData();
                                }
                            })
                            .catch(e => console.log(e));
                    })
                    .catch(e => {
                        console.log(e);
                        this.props.navigation.navigate('ErrorPage');
                    })
            })
    }

    async loadLocalData() {
        // AsyncStorage.clear();
        // let localAppData = {
        //     favorites: [
        //         {
        //             title: 'My Favorite 1',
        //             customTitle: '',
        //             fileType: 'pdf',
        //             url: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf'
        //         },
        //         {
        //             title: 'My Favorite 1',
        //             customTitle: '',
        //             fileType: 'pdf',
        //             url: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf'
        //         },
        //         {
        //             title: 'My Favorite 3',
        //             customTitle: '',
        //             fileType: 'weblink',
        //             url: 'https://www.google.co.in'
        //         }
        //     ]
        // };

        let localAppData = {
            token: null,
            hash: null,
            favorites: [],
            syncPending: 0
        };

        this.props.setSplashMessage('Synchronising');

        try {
            await AsyncStorage.getItem('localAppData', (err, data) => {
                if (err) {
                    console.log('Error loading Data');
                    throw err;
                } else {
                    data = JSON.parse(data);
                    if (data && data.appData) {
                        // console.log('Data Found \n' + data);
                        console.log('Data Hash \n' + data.hash);
                        console.log('Data appData \n' + data.appData);
                        // console.log('Data appData \n' + JSON.stringify(data.appData.appData.circulars));
                        if (!data.favorites) {
                            data.favorites = [];
                        }

                        data.contentType = 'VTU Aura';
                        data.favorites.reverse();
                        if(Object.keys(data.circulars).length > 15) {
                            let keys = Object.keys(data.circulars).splice(Object.keys(data.circulars).length - 15, Object.keys(data.circulars).length-1);
                            let requiredItems = {};
                            keys.forEach(key => {
                                requiredItems[key] = data.circulars[key];
                            });
                            data.circulars = requiredItems;
                        }
                        this.props.loadLocalAppData(data);
                    } else {
                        console.log('No Data Found');
                        AsyncStorage.setItem('localAppData', JSON.stringify(localAppData), (err) => {
                            if (err)
                                console.log('Error Saving Data! \n' + err);
                            else console.log('Save Success');
                        })
                    }
                }
            });
        } catch (error) {
            // Error saving data
        }
    };

    async setDataOnLocalStorage(data) {
        await AsyncStorage.setItem('localAppData', JSON.stringify(data), (err) => {
            if (err)
                console.log('Error Saving Data! \n' + err);
            else console.log('Save Success');
        })
    }

    mergeCirculars(old, newCirculars) {
        if (!old) {
            old = {};
        }

        if (old && Object.keys(old).length) {
            Object.keys(newCirculars).forEach(item => {
                let flag = false;
                Object.keys(old).forEach(oldItem => {
                    if (old[oldItem].id === newCirculars[item].id) {
                        flag = true;
                    }
                })
                if (!flag) {
                    newCirculars[item].readStatus = false;
                    let index = Object.keys(old).length;
                    old[index] = newCirculars[item];
                }
            })
            return old;
        } else {
            Object.keys(newCirculars).forEach(item => {
                newCirculars[item].readStatus = false;
            })
            return newCirculars;
        }

    }

    loadAppData = () => {
        let retry = false;
        let hash, studyMaterialsHash;
        this.loadLocalData()
            .then(() => {
                hash = (this.props.localAppData.hash) ? this.props.localAppData.hash : 'undefined';
                studyMaterialsHash = (this.props.localAppData.studyMaterialsHash) ? this.props.localAppData.studyMaterialsHash : 'undefined';
                let unreadNotifications = false;
                let circulars = (this.props.localAppData && this.props.localAppData.circulars) ? this.props.localAppData.circulars : [];
                Object.keys(circulars).forEach(key => {
                    if (!circulars[key].readStatus) {
                        unreadNotifications = true;
                    }
                });

                if (unreadNotifications) {
                    ToastAndroid.show('You Have Unread Notifications!', ToastAndroid.LONG);
                }

                this.props.setSplashMessage('Checking for Update');
                api.verifyCache()
                    .then(response => {
                        if (response) {
                            console.log('Hash Verified');
                            let updatedLocalData = Object.assign({}, this.props.localAppData);

                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'Home'}),
                                ]
                            });
                            this.props.navigation.dispatch(resetAction);
                        } else {
                            console.log('Hash Failed..Re-Fetching Data...');
                            this.props.setSplashMessage('Synchronising');
                            api.getAppData()
                                .then(response => {
                                    console.log('Response: Fetching Token...');
                                    if (response.status === 401) {
                                        retry = true;
                                        this.getToken();
                                        throw '401';
                                    }
                                    else return response;
                                })
                                .then((responseJson) => {
                                    let circulars = [];
                                    console.log('Fetch Successful from Firebase');
                                    let updatedLocalData = Object.assign({}, this.props.localAppData);
                                    if (this.props.localAppData.circulars) {
                                        circulars = this.mergeCirculars({...this.props.localAppData.circulars}, responseJson.appData.circulars);
                                    } else {
                                        circulars = this.mergeCirculars([], responseJson.appData.circulars);
                                    }
                                    updatedLocalData.hash = responseJson.hash;
                                    updatedLocalData.studyMaterialsHash = responseJson.appData.hash;
                                    if(!responseJson.appData.hasOwnProperty('syllabus')) {
                                        responseJson.appData = Object.assign({}, updatedLocalData.appData.appData, responseJson.appData);
                                    }
                                    updatedLocalData.appData = responseJson;
                                    updatedLocalData.circulars = circulars;

                                    this.setDataOnLocalStorage(updatedLocalData)
                                        .then(() => {
                                            this.loadLocalData();
                                            this.props.saveAppData(responseJson);

                                            const resetAction = NavigationActions.reset({
                                                index: 0,
                                                actions: [
                                                    NavigationActions.navigate({routeName: 'Home'}),
                                                ]
                                            });

                                            this.props.navigation.dispatch(resetAction);
                                        })
                                })
                                .catch((error) => {
                                    if(error !== '401') {
                                        const resetAction = NavigationActions.reset({
                                            index: 0,
                                            actions: [
                                                NavigationActions.navigate({routeName: 'ErrorPage'}),
                                            ]
                                        });

                                        console.error(error);
                                        if (!retry)
                                            this.props.navigation.dispatch(resetAction);
                                    }
                                });
                        }
                    })
                    .catch(err => {
                        console.error(err);
                        this.props.navigation.navigate('ErrorPage');
                    })
            });

    }

    render() {
        return (
            <Image source={require('../assets/splash.jpg')} style={styles.container}>
                <StatusBar
                    backgroundColor="#2f2f2f"
                    barStyle="light-content"
                />
                <View style={styles.overlayLogoContainer}>
                    <View style={styles.logoView}>
                        <Image source={require('../assets/logo.png')} style={styles.logo}/>
                        <Text style={styles.appName}>VTU Aura</Text>
                        <Text style={styles.appTagLine}>Your Academic Companion</Text>
                        {
                            (ENV === 'dev') &&
                            <View>
                                <Text style={{color: '#fff'}}>(Development Mode)</Text>
                                <Text style={{color: '#fff', textAlign: 'center'}}>{VERSION}</Text>
                            </View>
                        }
                    </View>
                    <View style={styles.overlay}>
                        <ActivityIndicator color="#fff" size={25}/>
                        <Text style={styles.text}>{this.props.splashText}</Text>
                    </View>
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    overlayLogoContainer: {
        flex: 1,
        flexDirection: 'column'
    },
    logoView: {
        flex: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderTopWidth: 1,
        borderTopColor: '#757575',
    },
    loaderIcon: {
        color: '#fff',
        fontSize: 30
    },
    text: {
        color: '#fff',
        fontSize: 20,
        paddingHorizontal: 10
    },
    logoBanner: {
        width: 200,
        height: 100,
        resizeMode: 'contain'
    },
    logo: {
        width: 100,
        height: 100,
        resizeMode: 'contain'
    },
    appName: {
        textAlign: 'center',
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold'
    },
    appTagLine: {
        textAlign: 'center',
        fontSize: 14,
        color: '#fff',
        fontWeight: 'bold'
    }
});

function mapStateToProps(state) {
    return {
        baseUrl: state.baseUrl,
        endpoints: state.endpoints,
        mappingUrl: state.mappingUrl,
        localAppData: state.localAppData,
        token: state.token,
        splashText: state.splashText
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveAppData: (appData) => {
            dispatch(actionCreators.saveAppData(appData));
        },
        loadLocalAppData: (localData) => {
            dispatch(actionCreators.loadLocalAppData(localData));
        },
        setToken: (token) => {
            dispatch(actionCreators.setToken(token));
        },
        setSplashMessage: (text) => {
            dispatch(actionCreators.setSplashMessage(text));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);