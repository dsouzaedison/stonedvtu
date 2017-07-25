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
import {NavigationActions} from 'react-navigation'

export default class Menu extends Component {
    getActiveTab(thisTab, activeTab) {
        if (thisTab === activeTab) {
            return styles.itemActive;
        }
    }

    paramsGenerator(data) {
        let {params} = this.props.home_nav.state;
        if (data)
            return Object.assign(params, data);
        else return params;
    }

    navigateTo = (route, params) => {
        // const {setParams} = this.props.home_nav;
        // if(params) {
        //     setParams(params);
        // }

        if (route == 'Home') {
            const resetAction = NavigationActions.reset({
                index: 0,
                actions: [
                    NavigationActions.navigate({routeName: 'Home', params: this.paramsGenerator(params)}),
                ]
            });

            this.props.home_nav.dispatch(resetAction);

            // this.props.home_nav.goBack(); //Prevent Home Component from being destroyed.
            // resetAction = NavigationActions.reset({
            //     index: 0,
            //     actions: [
            //         NavigationActions.navigate({routeName: route}),
            //     ]
            // });
        } else {
            const resetAction = NavigationActions.reset({
                index: 1,
                actions: [
                    NavigationActions.navigate({routeName: 'Home', params: this.paramsGenerator(params)}),
                    NavigationActions.navigate({routeName: route, params: this.paramsGenerator(params)}),
                ]
            });

            this.props.home_nav.dispatch(resetAction);
        }
    };

    render() {
        return (
            <View style={styles.drawerContainer}>
                <Image source={require('../assets/loginbg.jpg')} style={styles.drawerBackgroundImage}>
                    <Image source={require('../assets/graduate.jpg')} style={styles.drawerTitleImg}>
                        <View style={styles.drawerTitleImgOverlay}>
                            <Image source={require('../assets/avatar/4.jpg')} style={styles.avatar}/>
                        </View>
                    </Image>
                    <View style={styles.drawerOverlay}>
                        <ScrollView>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(0, this.props.activeTab)]}
                                onPress={() => this.navigateTo('Home')}>
                                <Text style={styles.menuItem}>Home</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="home" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(1, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 1})}>
                                <Text style={styles.menuItem}>Syllabus</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="star" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(2, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 2})}>
                                <Text style={styles.menuItem}>Notes</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="book" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(3, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 3})}>
                                <Text style={styles.menuItem}>Question Papers</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="question-circle" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(4, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 4})}>
                                <Text style={styles.menuItem}>Technology News</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="newspaper-o" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(5, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 5})}>
                                <Text style={styles.menuItem}>Events</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="calendar" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(6, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 6})}>
                                <Text style={styles.menuItem}>Help</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="info-circle" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.menuItemWrapper, this.getActiveTab(7, this.props.activeTab)]}
                                onPress={() => this.navigateTo('SemSelector', {contentType: 7})}>
                                <Text style={styles.menuItem}>Contact Us</Text>
                                <View style={styles.navIconWrapper}>
                                    <Icon name="commenting" style={styles.navIcon}/>
                                </View>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
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
        // flex: 1,
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        // height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderTopWidth: 0.5,
        borderColor: '#444'
    },
    menuItem: {
        // flex: 1,
        // color: '#4e4e4e',
        color: '#fff',
        fontSize: 20
    },
    itemActive: {
        backgroundColor: 'rgba(0,0,0,0.2)',
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
    navIcon: {
        fontSize: 24,
        color: '#fff',
        // color: '#555',
    }
});