import  React, {Component} from 'react';
import {
    View, Text, Image, StyleSheet, FlatList, Dimensions, DrawerLayoutAndroid, TouchableOpacity, ScrollView,
    ActivityIndicator
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

AdMobInterstitial.setAdUnitID('ca-app-pub-5210992602133618/6321203646');

function getDate(date) {
    let dateArr = date.split('-');
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let res = months[parseInt(dateArr[1] - 1)] + ' ' + dateArr[2][0] + dateArr[2][1];
    return res;
}

function Loader(props) {
    if (props.isLoading) {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255,102,0,1)',
                paddingVertical: 5
            }}>
                <ActivityIndicator color="#fff" size={14}/>
                <Text style={{color: '#fff', textAlign: 'center'}}> Updating...</Text>
            </View>
        );
    } else {
        return <View></View>;
    }
}

function NewsElement(props) {
    const news = props.news;
    const colors = [
        styles.grey,
        styles.blue,
        styles.purple,
        styles.white,
        styles.pink,
        styles.cyan,
        styles.orange,
    ];
    return (
        <View style={[styles.card, colors[news.color]]}>
            <Image source={{uri: news.urlToImage}} style={styles.newsImage}>
                <View style={styles.newsImageOverlay}>
                    <Text style={styles.newsTitle} numberOfLines={2} ellipsizeMode="tail">{news.title}</Text>
                </View>
            </Image>
            <Text style={styles.newsDescription} numberOfLines={4} ellipsizeMode="tail">
                {news.description}
            </Text>
            <TouchableOpacity style={styles.readMoreWrapper}
                              onPress={() => {
                                  props.navigation.navigate('WebViewer', {url: news.url, adId: 'ca-app-pub-5210992602133618/6189598861'})
                              }}>
                <View style={{flexDirection: 'row', flex: 1}}>
                    <View style={styles.dateWrapper}>
                        <Text style={styles.date}>{getDate(news.publishedAt)}</Text>
                    </View>
                    <Text style={styles.readMore}>
                        <Icon name="plus-circle" color="#fff" size={18}/> Read More
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

export class TechnologyNews extends Component {
    constructor() {
        super();
        this.openDrawer = this.openDrawer.bind(this);
    }

    componentDidMount() {
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());

        return fetch(this.props.newsUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                let i = 0;
                responseJson.articles.forEach(item => {
                    item.color = i++ % 7
                });

                console.log('Technology News Loaded');
                // console.log('News: \n ' + JSON.stringify(responseJson.articles))
                this.props.saveNewsData(responseJson.articles);
            })
            .catch((error) => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'ErrorPage'}),
                    ]
                });

                this.props.navigation.dispatch(resetAction);
                console.log(error);
            });
    }


    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    render() {
        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}
                                    contentType={this.props.contentType}/>
                            <Loader isLoading={this.props.loadStatus}/>
                            <Image source={require('../assets/homebg.jpg')} style={styles.diamonds}>
                                <ScrollView>
                                    <FlatList
                                        data={this.props.news} keyExtractor={(item, index) => index}
                                        renderItem={({item}) => <NewsElement news={item}
                                                                             navigation={this.props.navigation}/>}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'rgba(0,0,0,0.4)'
    },
    backgroundImage: {
        flex: 1,
        backgroundColor: '#fff'
        // resizeMode: 'cover',
    },
    errorContainer: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center'
    },
    img: {
        width: Dimensions.get('window').width,
        resizeMode: 'contain'
    },
    diamonds: {
        flex: 1,
        width: null,
        height: null,
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
    white: {
        backgroundColor: 'rgba(255,255,255, 0.4)'
    },
    pink: {
        backgroundColor: 'rgba(233, 30, 99, 0.6)'
    },
    blue: {
        backgroundColor: 'rgba(33,150,243, 0.6)'
    },
    purple: {
        backgroundColor: 'rgba(156,39,176,0.6)'
    },
    cyan: {
        backgroundColor: 'rgba(0, 188, 212, 0.6)'
    },
    orange: {
        backgroundColor: 'rgba(255, 152, 0, 0.6)'
    },
    grey: {
        backgroundColor: 'rgba(96, 125, 139, 0.6))'
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
        color: '#e0e0e0',
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
    }
});

function mapStateToProps(state) {
    return {
        newsUrl: state.newsUrl,
        news: state.news,
        loadStatus: state.loadStatus.news
    };
}

function mapDispatchToProps(dispatch) {
    return {
        saveNewsData: (news) => {
            dispatch(actionCreators.saveNewsData(news));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TechnologyNews)