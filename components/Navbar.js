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
                    backgroundColor="#393939"
                    barStyle="light-content"
                />
                <View style={styles.iconWrapperLeft}>
                    <TouchableOpacity onPress={() => this.props.openDrawer()}>
                        <Icon name="bars" style={styles.barsIcon}/>
                    </TouchableOpacity>
                    <Title contentType={this.props.contentType}/>
                </View>
                <View style={styles.iconWrapperRight}>
                    <Icon name="star" style={styles.bellIcon}/>
                </View>
            </View>
        );
    }
}

function getTitle(type) {
    // const type = this.props.navigation.state.params.contentType;

    if(type === 1) {
        return "SYLLABUS";
    }
    else if(type === 2) {
        return "NOTES";
    }
    else if(type === 3) {
        return "QUESTION PAPER";
    }
    else if(type === 4) {
        return "TEXT BOOK";
    }
    else return "STONED VTU";
}


function Title(props) {
    if (props.contentType)
        return <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{getTitle(props.contentType)}</Text>;
    else return <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">STONED VTU</Text>;
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#393939',
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

