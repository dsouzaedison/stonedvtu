import React, {Component} from 'react';
import * as actionCreators from '../actionCreators';
import {
    StyleSheet,
    View,
    Text,
    Image,
    StatusBar,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";
import DeviceInfo from "react-native-device-info";

export class Splash extends Component {
    constructor() {
        super();
        this.loadAppData = this.loadAppData.bind(this);
    }

    componentDidMount() {
        this.props.setSplashMessage('Loading App...')
        this.loadLocalData()
            .then(res => {
                if (this.props.localAppData && this.props.localAppData.token) {
                    this.props.setSplashMessage('Fetching Data...')
                    this.props.setToken(this.props.localAppData.token);
                    this.loadAppData();
                } else {
                    this.props.setSplashMessage('Registering Device...')
                    this.getToken();
                }
            })
            .catch(e => console.error(e))
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
                // this.props.setSplashMessage('Authenticating...')
                return fetch(this.props.baseUrl, {
                    method: 'POST',
                    headers: {
                        'Cache-Control': 'no-cache'
                    },
                    body: JSON.stringify(authData)
                })
                    .then(response => response.json())
                    .then((response) => {
                        let updatedLocalData = Object.assign({}, this.props.localAppData);
                        updatedLocalData.token = response;

                        console.log('Phone ID Firebase: ' + response);
                        this.props.setToken(response);
                        this.setDataOnLocalStorage(updatedLocalData);
                        this.loadAppData();
                    })
                    .catch(e => {
                        console.log(e);
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
            favorites: []
        };

        this.props.setSplashMessage('Sync in Progress...')

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
        if(!old) {
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
        let hash;
        this.loadLocalData()
            .then(() => {
                hash = (this.props.localAppData.hash) ? this.props.localAppData.hash : 'undefined';
                this.props.setSplashMessage('Checking for Update...')
                return fetch(this.props.baseUrl + 'verifycache?hash=' + hash)
                    .then(response => response.json())
                    .then(response => {
                        if (response) {
                            console.log('Hash Verified...');
                            let updatedLocalData = Object.assign({}, this.props.localAppData);

                            const resetAction = NavigationActions.reset({
                                index: 0,
                                actions: [
                                    NavigationActions.navigate({routeName: 'Home'}),
                                ]
                            });

                            this.props.navigation.dispatch(resetAction);
                        } else {
                            console.log('Hash Failed..Re-Fetching Data...')
                            this.props.setSplashMessage('Sync in Progress...')
                            return fetch(this.props.baseUrl + 'old?token=' + this.props.token)
                                .then(response => {
                                    console.log('Response: Fetching Token...')
                                    if (response.status === 401) {
                                        retry = true;
                                        this.getToken();
                                    }
                                    else return response.json();
                                })
                                .then((responseJson) => {
                                    let circulars = [];
                                    console.log('Fetch Successful from Firebase');
                                    let updatedLocalData = Object.assign({}, this.props.localAppData);
                                    if(this.props.localAppData.circulars) {
                                        circulars = this.mergeCirculars({...this.props.localAppData.circulars}, responseJson.appData.circulars);
                                    } else {
                                        circulars = this.mergeCirculars([], responseJson.appData.circulars);
                                    }
                                    updatedLocalData.hash = responseJson.hash;
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
                                    // this.props.navigation.navigate('Home');
                                })
                                .catch((error) => {
                                    const resetAction = NavigationActions.reset({
                                        index: 0,
                                        actions: [
                                            NavigationActions.navigate({routeName: 'ErrorPage'}),
                                        ]
                                    });

                                    console.error(error);
                                    if (!retry)
                                        this.props.navigation.dispatch(resetAction);
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
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                <View style={styles.overlay}>
                    <ActivityIndicator color="#fff" size={30}/>
                    <Text style={styles.text}>{this.props.splashText}</Text>
                </View>
            </Image>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        // justifyContent: 'center',
        // alignItems: 'center',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    overlay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    loaderIcon: {
        color: '#fff',
        fontSize: 30
    },
    text: {
        color: '#fff',
        fontSize: 25,
        paddingHorizontal: 10
    }
});

function mapStateToProps(state) {
    return {
        baseUrl: state.baseUrl,
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