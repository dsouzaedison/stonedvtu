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

export class Splash extends Component {
    constructor() {
        super();
    }

    componentDidMount() {
        this.loadLocalData();

        return fetch(this.props.baseUrl, {
            headers: {
                'Cache-Control': 'no-cache'
            }
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.props.saveAppData(responseJson);

                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'Home'}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
                // this.props.navigation.navigate('Home');
            })
            .catch((error) => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'ErrorPage'}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
                console.log(error.message);
            });
    }

    async loadLocalData() {
        // AsyncStorage.clear();
        let localAppData = {
            favorites: [
                {
                    title: 'My Favorite 1',
                    customTitle: '',
                    fileType: 'pdf',
                    url: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf'
                },
                {
                    title: 'My Favorite 1',
                    customTitle: '',
                    fileType: 'pdf',
                    url: 'https://www.ets.org/Media/Tests/GRE/pdf/gre_research_validity_data.pdf'
                },
                {
                    title: 'My Favorite 3',
                    customTitle: '',
                    fileType: 'weblink',
                    url: 'https://www.google.co.in'
                }
            ]
        };

        try {
            await AsyncStorage.getItem('localAppData', (err, data) => {
                if (err) {
                    console.log('Error loading Data');
                    throw err;
                } else {
                    if (data !== null) {
                        console.log('Data Found \n' + data);
                        this.props.loadLocalAppData(JSON.parse(data));
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

    render() {
        return (
            <Image source={require('../assets/splash.jpg')} style={styles.container}>
                <StatusBar
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                <View style={styles.overlay}>
                    <ActivityIndicator color="#fff" size={30}/>
                    <Text style={styles.text}>Fetching Data...</Text>
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
        baseUrl: state.baseUrl
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveAppData: (appData) => {
            dispatch(actionCreators.saveAppData(appData));
        },
        loadLocalAppData: (localData) => {
            dispatch(actionCreators.loadLocalAppData(localData));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);