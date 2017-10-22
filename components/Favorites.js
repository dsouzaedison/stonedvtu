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
    AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Navbar from './Navbar';
import Menu from './Menu';
import {connect} from 'react-redux';
import * as actionCreators from '../actionCreators';
import * as constants from './constants';
import {NavigationActions} from "react-navigation";

export class Favorites extends Component {
    constructor() {
        super();
        this.openDrawer = this.openDrawer.bind(this);
        this.deleteFavorite = this.deleteFavorite.bind(this);
        this.deleteFavoriteConfirm = this.deleteFavoriteConfirm.bind(this);
    }

    componentDidMount() {

    }

    openDrawer() {
        this.refs['DRAWER_REF'].openDrawer();
    }

    async deleteFavorite(item) {
        let localData = Object.assign({}, this.props.localAppData);
        let index = localData.favorites.indexOf(item);
        console.log('Item Deleted : ' + index);

        localData.favorites.splice(index, 1);

        try {
            await AsyncStorage.setItem('localAppData', JSON.stringify(localData), (err) => {
                if (err) {
                    console.log(err);
                } else {
                    this.props.loadLocalAppData(localData);
                }
            })
        }
        catch (e) {
            console.log(e);
        }
    }

    deleteFavoriteConfirm(item) {
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
        let favorites = [...this.props.localAppData.favorites];
        favorites = favorites.reverse();

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
                                <ScrollView>
                                    <FlatList
                                        data={favorites} keyExtractor={(item, index) => index}
                                        renderItem={({item}) => <FavoriteItem favorite={item}
                                                                              navigation={this.props.navigation}
                                                                              updateCircularPdf={this.props.updateCircularPdf}
                                                                              deleteFavoriteConfirm={this.deleteFavoriteConfirm}/>}
                                    />
                                    <View style={[styles.errorMsg, this.showError()]}>
                                        <Icon name="heart-o"
                                              style={{color: '#fff', fontSize: 150, marginVertical: 15}}/>
                                        <Text style={{color: '#fff', fontSize: 18, textAlign: 'center'}}>Ah! You seemed
                                            to have landed on the wrong page. Add some content to favorites
                                            first.</Text>
                                    </View>
                                </ScrollView>
                            </Image>
                        </View>
                    </View>
                </View>
            </DrawerLayoutAndroid>
        )
    }
}


function FavoriteItem(props) {
    if (props.favorite.fileType === 'pdf') {
        return (
            <View style={styles.favoritesContainer}>
                <View style={styles.favoritesWrapper}>
                    <TouchableOpacity onPress={() => {
                        props.updateCircularPdf(props.favorite.url);
                        props.navigation.navigate('PdfViewer');
                    }}>
                        <View>
                            <Text style={[styles.favoritesTitle]} ellipsizeMode="tail"
                                  numberOfLines={1}>{props.favorite.title}</Text>
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
    else if (props.favorite.fileType === 'weblink') {
        return (
            <View style={styles.favoritesContainer}>
                <View style={styles.favoritesWrapper}>
                    <TouchableOpacity onPress={() => {
                        props.navigation.navigate('WebViewer', {url: props.favorite.url});
                    }}>
                        <View>
                            <Text style={[styles.favoritesTitle]} ellipsizeMode="tail"
                                  numberOfLines={1}>{props.favorite.title}</Text>
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
    else return <View></View>;

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
        width: Dimensions.get('window').width - 65
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
    }
});


function mapStateToProps(state) {
    return {
        localAppData: state.localAppData,
        favorites: state.localAppData.favorites
    };
}

function mapDispatchToProps(dispatch) {
    return {
        updateCircularPdf: (url) => {
            dispatch(actionCreators.updateCircularPdf(url));
        },
        loadLocalAppData: (data) => {
            dispatch(actionCreators.loadLocalAppData(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Favorites)
