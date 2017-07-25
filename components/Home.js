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
    FlatList
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import Menu from './Menu';

function Loader(props) {
    if (props.isLoading) {
        return (
            <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicator color="#a8a8a8" size={14}/>
                <Text style={{color: '#a8a8a8', textAlign: 'center'}}> Updating...</Text>
            </View>
        );
    } else {
        return <View></View>;
    }
}

function getDate(date) {
    let dateArr = date.split('-');
    let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let res = months[parseInt(dateArr[1] - 1)] + ' ' + dateArr[2][0] + dateArr[2][1];
    return res;
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
                              onPress={() => {props.navigation.navigate('WebViewer', {url: news.url})}}>
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

export default class Home extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            news: []
        };

        this.openDrawer = this.openDrawer.bind(this);
    }

    componentDidMount() {
        return;
        return fetch('https://newsapi.org/v1/articles?source=techcrunch&sortBy=latest&apiKey=9b40df3156d14a9baeaa73eade696563')
            .then((response) => response.json())
            .then((responseJson) => {
                let i = 0;
                responseJson.articles.forEach(item => {
                    item.color = i++ % 7
                });
                this.setState({
                    isLoading: false,
                    news: responseJson.articles,
                });
            })
            .catch((error) => {
                this.setState({
                    isLoading: false,
                    news: [],
                });
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
                renderNavigationView={() => <Menu home_nav={this.props.navigation} activeTab={0}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation} contentType={false}/>
                            <View style={{flexDirection: 'row'}}>
                                <Image source={require('../assets/homebg.jpg')} style={styles.diamonds}>
                                    <ScrollView>
                                        <Loader isLoading={this.state.isLoading}/>
                                        <FlatList
                                            data={this.state.news} keyExtractor={(item, index) => index}
                                            renderItem={({item}) => <NewsElement news={item} navigation={this.props.navigation}/>}
                                        />

                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/abdulKalam.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/motivation1.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/steveJobs.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/einstein.jpg')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/plan.png')}
                                                   style={[styles.storyImage]}/>
                                        </View>
                                        <View style={[styles.imageCard]}>
                                            <Image source={require('../assets/louholtz.jpg')}
                                                   style={[styles.storyImage, {height: 400}]}/>
                                        </View>
                                    </ScrollView>
                                </Image>
                            </View>

                            {/*<View style={styles.storyCard}>*/}
                            {/*<Image source={require('../assets/homeBanner.jpg')} style={styles.storyBanner}>*/}
                            {/*<Text style={{padding: 10, color: '#fff', flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', alignItems: 'flex-end'}}>*/}
                            {/*"Lorem Ipsum is simply dummy text of the printing and typesetting industry."*/}
                            {/*</Text>*/}
                            {/*</Image>*/}
                            {/*</View>*/}

                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        );
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
        backgroundColor: 'rgba(0,0,0,0.4)'
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
    }
});

