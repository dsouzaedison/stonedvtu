import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView,
    StatusBar
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Navbar extends Component {
    render() {
        return (
                <View style={styles.container}>
                    <StatusBar
                        backgroundColor="#424242"
                        barStyle="light-content"
                    />
                    <View style={styles.iconWrapperLeft}>
                        <Icon name="bars" style={styles.barsIcon}/>
                        <Text style={styles.title}>STONED VTU</Text>
                    </View>
                    <View style={styles.iconWrapperRight}>
                        <Icon name="bell" style={styles.bellIcon}/>
                    </View>
                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#424242',
        height: 60,
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 10,
        elevation: 3
        // resizeMode: 'cover',
    },
    naviconWrapper: {
        flexDirection: 'row',
    },
    iconWrapperLeft: {
        flex: 2,
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center'
    },
    iconWrapperRight: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    barsIcon: {
        color: '#fff',
        fontSize: 30,
    },
    bellIcon: {
        color: '#fff',
        fontSize: 30,
    },
    title: {
        color: '#fff',
        fontSize: 30,
        marginLeft: 10
    }
});

