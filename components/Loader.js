import React, {Component} from 'react';
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    StatusBar,
    Dimensions
} from 'react-native';

export class Loader extends Component {
    render() {
        let text = 'Download In Progress';
        if(this.props.text) {
            text = this.props.text;
        }

        return (
            <View style={styles.popupOverlay}>
                <StatusBar
                    backgroundColor="#000"
                    barStyle="light-content"
                />
                <View style={styles.popupWrapper}>
                    <ActivityIndicator color="#fff" size={35}/>
                    <Text style={styles.popupContent}>{text}</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    popupOverlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        flex: 1,
        alignSelf: 'center',
        width: Dimensions.get('window').width,
        flexDirection: 'column',
        justifyContent: 'center'
    },
    popupWrapper: {
        width: Dimensions.get('window').width - 20,
        marginHorizontal: 10,
        alignItems: 'center',
        padding: 25
    },
    popupContent: {
        color: '#e9e9e9',
        fontSize: 18,
        marginTop: 15
    }
});

export default Loader;