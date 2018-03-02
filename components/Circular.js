import  React, {Component} from 'react';
import {
    View, Text, Image, StyleSheet, FlatList, Dimensions, DrawerLayoutAndroid, TouchableOpacity, ScrollView,
    ActivityIndicator, AsyncStorage
} from 'react-native';
import Navbar from './Navbar';
import Menu from './Menu';
import Icon from 'react-native-vector-icons/FontAwesome';

import * as actionCreators from '../actionCreators';
import {connect} from 'react-redux';
import {NavigationActions} from "react-navigation";
import {
    AdMobBanner,
    AdMobInterstitial,
    PublisherBanner,
    AdMobRewarded,
} from 'react-native-admob';

function NewsElement(props) {
    return <View></View>;
}

export class Circular extends Component {
    constructor() {
        super();
        this.openDrawer = this.openDrawer.bind(this);
    }

    componentDidMount() {

    }

    setCircularReadStatus = (circular) => {
        let circulars = Object.assign({}, this.props.circulars);
        let localDataClone = Object.assign({}, this.props.localAppData);
        Object.keys(circulars).forEach(key => {
            if(circulars[key].title === circular.title) {
                circulars[key].readStatus = true;
            }
        })
        localDataClone.circulars = circulars;
        AsyncStorage.setItem('localAppData', JSON.stringify(localDataClone), (err) => {
            if (err)
                console.log('Circular.js: Error Saving Data! \n' + err);
            else {
                console.log('Circular.js: ReadStatus Changed AsyncStorage')
                this.props.loadLocalAppData(localDataClone);
            }
        });
    }


    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    render() {
        let circularsArr = [];
        let circularsClone = Object.assign({}, this.props.circulars);

        Object.keys(circularsClone).forEach((index) => {
            circularsArr.push(circularsClone[index])
        });

        circularsArr = circularsArr.reverse();

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}/>
                            <Image source={require('../assets/homebg.jpg')} style={styles.img}>
                                <AdMobBanner
                                    adSize="smartBanner"
                                    adUnitID="ca-app-pub-5210992602133618/7233942018"
                                    testDevices={[AdMobBanner.simulatorId]}
                                    onAdFailedToLoad={error => console.error(error)}
                                />
                                <ScrollView>
                                    <FlatList
                                        data={circularsArr} keyExtractor={(item, index) => index}
                                        renderItem={({item}) => <CircularItem circular={item}
                                                                              navigation={this.props.navigation}
                                                                              setCircularReadStatus={this.setCircularReadStatus}
                                                                              updateFileUrl={this.props.updateFileUrl}/>}
                                    />
                                </ScrollView>
                            </Image>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        )
    }
}

function CircularItem(props) {
    return (
        <View style={styles.circularContainer}>
            <TouchableOpacity style={styles.circularWrapper} onPress={() => {
                props.setCircularReadStatus(props.circular);
                props.updateFileUrl(props.circular.url);
                props.navigation.navigate('PdfViewer');
            }}>
                <Text style={[styles.circularTitle, (props.circular.readStatus)? '': styles.bold]}>
                    { !props.circular.readStatus && <Icon name="circle" style={styles.bullet}/>}
                    { (props.circular.readStatus ? '': ' ') + props.circular.title}
                    </Text>
                <View style={styles.readMoreView}>
                    <View style={styles.dateWrapper}>
                       <Text style={styles.readMore}>{props.circular.date}</Text>
                    </View>
                    <View style={styles.readMoreWrapper}>
                        <Icon name="plus-circle" style={styles.readMoreIcon}/>
                        <Text style={styles.readMore}>Read More</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
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
    circularContainer: {
        flex: 1,
        flexDirection: 'column',
        width: Dimensions.get('window').width
    },
    circularWrapper: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(39, 39, 39, 0.8)',
        margin: 5,
        borderRadius: 3,
        borderColor: '#9c9c9c',
        borderWidth: 1
    },
    circularTitle: {
        color: '#fff',
        fontSize: 18,
        padding: 10
    },
    readMoreView: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#4b4b4b',
        padding: 8
    },
    readMore: {
        fontSize: 17,
        color: '#fff'
    },
    readMoreIcon: {
        fontSize: 18,
        marginRight: 10,
        color: '#fff',
        marginTop: 2,
    },
    dateWrapper: {
        flex: 1
    },
    readMoreWrapper: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    bold: {
        fontWeight: 'bold'
    },
    bullet: {
        fontSize: 20,
    }
});

function mapStateToProps(state) {
    return {
        circulars: state.circulars,
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
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Circular)