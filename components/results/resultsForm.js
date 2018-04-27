import React, {Component} from 'react';
import {
    Alert,
    Clipboard,
    DrawerLayoutAndroid,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Navbar from '../Navbar';
import Menu from '../Menu';
import {connect} from "react-redux";
import Analytics from 'appcenter-analytics';
import * as actionCreators from "../../actionCreators";
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';
import api from "../../apis";
import Results from "./results";
import FloatingLoader from "../FloatingLoader";

export class ResultsForm extends Component {
    constructor() {
        super();
        this.state = {
            usn: '',
            resTypeReval: false,
            messages: [],
            showLoader: false
        };
    }

    componentDidMount() {
        Analytics.trackEvent('Results USN Form', {});

        let messages = Object.assign([], this.props.results.messages);

        this.setState({
            messages: messages.reverse()
        });
    }

    openDrawer = () => {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer = () => {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    copyToClipboard = (text) => {
        Clipboard.setString(text);
        ToastAndroid.show('Copied to Clipboard!', ToastAndroid.SHORT);
    }

    showLoader = (flag) => {
        this.setState({
            showLoader: flag
        });
    }

    getResults = () => {
        this.showLoader(true);
        api.getRegularResults(this.state.usn)
            .then(res => {
                this.showLoader(false);
                if(res.results.length) {
                    this.props.setStudentResult(res);
                    console.log('\nResults: \n' + res);
                    this.props.navigation.navigate('Results');
                } else throw "No Results Avaiable";
            })
            .catch(e => {
                this.showLoader(false);
                this.handleError();
                console.log(e);
            });
    }

    handleError = () => {
        Alert.alert(
            'No Results Found!',
            'Please verify the USN entered. You can also check results from official link below.',
            [
                {text: 'Okay', onPress: () => console.log('Okay Pressed'), style: 'cancel'},
            ],
            {cancelable: true}
        )
    }

    render() {
        let combinedJSX = [];
        this.state.messages.map((item, index) => {

            if (item.type === 'webLink') {
                combinedJSX.push(
                    <TouchableOpacity key={index} onPress={() => {
                        // Analytics.trackEvent('Ad Click', {id: item.id});
                        this.props.navigation.navigate('WebViewer', {
                            url: item.meta.contentUrl,
                            adId: item.meta.adId,
                            showAd: item.meta.showAd,
                            prevRoute: this.props.contentType
                        })
                    }}>
                        <View style={[styles.noteWrapper, item.style]} key={index}>
                            <Text style={styles.note}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                );
            } else if (item.type === 'pdf') {
                combinedJSX.push(
                    <TouchableOpacity key={index} onPress={() => {
                        // Analytics.trackEvent('Ad Click', {id: item.id});
                        this.props.updateFileUrl(item.meta.contentUrl);
                        this.props.navigation.navigate('PdfViewer', {prevRoute: this.props.contentType});
                    }}>
                        <View style={[styles.noteWrapper, item.style]} key={index}>
                            <Text style={styles.note}>{item.title}</Text>
                        </View>
                    </TouchableOpacity>
                );
            } else {
                Analytics.trackEvent('Content Impression - Home Banners', {id: item.id});
                combinedJSX.push(
                    <View style={[styles.noteWrapper, item.style]} key={index}>
                        <Text style={styles.note}>{item.title}</Text>
                    </View>
                )
            }
        });

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu closeDrawer={this.closeDrawer} home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}
                                    contentType={this.props.contentType}/>
                            <Image source={require('../../assets/homebg.jpg')} style={styles.bgContainer}
                                   blurRadius={10}>
                                {
                                    this.state.showLoader &&
                                    <FloatingLoader/>
                                }
                                <ScrollView>
                                    <Image source={require('../../assets/graduate.jpg')} style={styles.titleBackground}
                                           blurRadius={3}>

                                        <View style={styles.darkOverlay}>
                                            <Image source={require('../../assets/vtuLogo.png')} style={styles.avatar}/>
                                            <Text style={styles.wishText}>Wish you good luck!</Text>
                                            <View style={styles.resultTypeWrapper}>
                                                <TouchableOpacity style={[styles.resultTypeButton, styles.firstHalf]}
                                                                  onPress={() => this.setState({resTypeReval: false})}>
                                                    <Text
                                                        style={[styles.resultTypeText, this.state.resTypeReval ? '' : styles.active]}>REG</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={[styles.resultTypeButton, styles.secondHalf]}
                                                                  onPress={() => this.setState({resTypeReval: true})}>
                                                    <Text
                                                        style={[styles.resultTypeText, !this.state.resTypeReval ? '' : styles.active]}>REVAL</Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.inputFormView}>
                                                <TextInput
                                                    style={styles.usnInput}
                                                    onChangeText={(usn) => this.setState({usn})}
                                                    value={this.state.text}
                                                    placeholder="Enter USN - 4AI15CS001"
                                                    placeholderTextColor="#D4D4D4"
                                                    maxLength={10}
                                                    underlineColorAndroid="transparent"
                                                />
                                                <TouchableOpacity style={styles.submitButton} onPress={() => {
                                                    this.getResults();
                                                }}>
                                                    <MaterialCommunityIcon name="arrow-right-bold-circle"
                                                                           style={styles.submitIcon}/>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </Image>
                                    <AdMobBanner
                                        adSize="smartBanner"
                                        adUnitID={this.props.ads.banner.resultsForm}
                                        onAdFailedToLoad={error => console.error(error)}
                                    />

                                    {combinedJSX}
                                </ScrollView>
                            </Image>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        )
    }
}


const styles = new StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#eee'
    },
    bgContainer: {
        flex: 1,
        flexDirection: 'column',
        width: null,
        height: null,
        resizeMode: 'cover',
        alignItems: 'center'
    },
    titleBackground: {
        alignSelf: 'stretch',
        width: null,
        height: 250,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        height: 80,
        width: 80,
        borderRadius: 40,
        borderColor: '#fff',
        borderWidth: 3,
        marginTop: 10
    },
    wishText: {
        color: '#fff',
        marginTop: 5
    },
    darkOverlay: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputFormView: {
        alignSelf: 'stretch',
        width: null,
        flexDirection: 'row'
    },
    usnInput: {
        color: '#fff',
        borderColor: '#fff',
        borderBottomWidth: 2,
        marginHorizontal: 10,
        flex: 0.8,
        marginTop: 0,
        fontSize: 18,
        height: 50
    },
    submitButton: {
        flex: 0.2,
        marginVertical: 10,
        alignItems: 'center'
    },
    submitIcon: {
        color: '#f60',
        fontSize: 35,
        backgroundColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        height: 35,
        width: 35,
        borderRadius: 25,
        lineHeight: 35
    },
    resultTypeWrapper: {
        marginTop: 15,
        flexDirection: 'row'
    },
    resultTypeText: {
        color: '#fff',
        paddingHorizontal: 5,
        fontSize: 16
    },
    noteWrapper: {
        padding: 8,
        margin: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignSelf: 'stretch',
        borderRadius: 2
    },
    note: {
        color: '#fff',
        fontSize: 16
    },
    resultTypeButton: {
        borderWidth: 1,
        borderColor: '#fff'
    },
    firstHalf: {
        borderTopLeftRadius: 2,
        borderBottomLeftRadius: 2
    },
    secondHalf: {
        borderTopRightRadius: 2,
        borderBottomRightRadius: 2
    },
    active: {
        backgroundColor: '#fff',
        color: '#555'
    },
    loaderWrapper: {
        flexDirection: 'row',
        height: 3,
        alignSelf: 'stretch'
    },
    whiteStrip: {
        flex: 1,
        backgroundColor: '#fff'
    },
    orangeStrip: {
        flex: 1,
        backgroundColor: '#f60'
    }
})


function mapStateToProps(state) {
    return {
        ads: state.ads,
        token: state.token,
        contentType: state.contentType,
        results: state.results
    };
}

function mapDispatchToProps(dispatch) {
    return {
        setStudentResult: (result) => {
            dispatch(actionCreators.setStudentResult(result));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ResultsForm);

// TODO: Show Loader on submit