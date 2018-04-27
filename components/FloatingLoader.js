import React, {Component} from "react";
import {
    StyleSheet,
    View,
    Text
} from "react-native";

export default class FloatingLoader extends Component {
    constructor() {
        super();
        this.state = {
            flag: true,
            loaderBlock1: styles.whiteStrip,
            loaderBlock2: styles.orangeStrip
        }
    }

    componentDidMount() {
        this.interval = setInterval(() => {
            if(this.state.flag) {
                this.setState({
                    flag: false,
                    loaderBlock2: styles.whiteStrip,
                    loaderBlock1: styles.orangeStrip
                });
            } else {
                this.setState({
                    flag: true,
                    loaderBlock1: styles.whiteStrip,
                    loaderBlock2: styles.orangeStrip
                });
            }
        }, 500);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <View style={styles.loaderWrapper}>
                <View style={this.state.loaderBlock1}></View>
                <View style={this.state.loaderBlock2}></View>
            </View>
        )
    }
}

const styles = new StyleSheet.create({
    loaderWrapper: {
        flexDirection: 'row',
        height: 3,
        alignSelf: 'stretch',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100
    },
    whiteStrip: {
        flex: 1,
        backgroundColor: '#fff'
    },
    orangeStrip: {
        flex: 1,
        backgroundColor: '#f60'
    }
});