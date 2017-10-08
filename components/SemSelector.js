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

export default class SemSelector extends Component {
    constructor() {
        super();
        this.state = {
            isLoading: true,
            news: [],
            pdf: null
        };

        this.openDrawer = this.openDrawer.bind(this);
    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    paramsGenerator(data) {
        let {params} = this.props.navigation.state;
        return Object.assign(params, data);
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
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}/>
                            <View style={{flex: 1, flexDirection: 'column'}}>
                                <Image source={require('../assets/evolution.png')}
                                       style={styles.headerBackgroundImage}>
                                </Image>
                                <Image source={require('../assets/loginbg.jpg')} style={styles.branchesContainer}>
                                    <View style={styles.cardRow}>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 1}))}>
                                        <Image source={require('../assets/avatar/sem/1.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>JUNIOR</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.cardRow}>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 3}))}>
                                            <Image source={require('../assets/avatar/sem/3.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>SEM 3</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 4}))}>
                                            <Image source={require('../assets/avatar/sem/4.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>SEM 4</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.cardRow}>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 5}))}>
                                            <Image source={require('../assets/avatar/sem/5.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>SEM 5</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 6}))}>
                                            <Image source={require('../assets/avatar/sem/6.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>SEM 6</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <View style={styles.cardRow}>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 7}))}>
                                            <Image source={require('../assets/avatar/sem/7.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>SEM 7</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={styles.cardWrapper}
                                                          onPress={() => this.props.navigation.navigate('BranchSelector', this.paramsGenerator({sem: 8}))}>
                                            <Image source={require('../assets/avatar/sem/8.png')}
                                                   style={styles.branchIcon}/>
                                            <Text style={styles.branchName}>LEGENDS</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Image>
                            </View>
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
    },
    headerBackgroundImage: {
        // flex: 0.3,
        flexDirection: 'column',
        height: 150,
        width: null,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.8
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
        flexDirection: 'row'
    },
    cardWrapper: {
        flex: 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.4)',
        borderColor: '#424242',
        borderWidth: 1
    },
    branchesContainer: {
        flex: 1,
        flexDirection: 'column',
        width: null,
        height: null,
        resizeMode: 'cover'
    },
    branchName: {
        fontSize: 20,
        color: '#fff'
    },
    branchIcon: {
        height: 40,
        width: 40,
        padding: 5,
        resizeMode: 'contain'
        // borderRadius: 25,
        // borderWidth: 3,
        // borderColor: '#fff'
    }
});

