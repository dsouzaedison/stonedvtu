import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class Login extends Component {
    render() {
        return (
            <Image source={require('../assets/loginbg.jpg')} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <View style={styles.topView}>
                        <Image source={require('../assets/vtuLogo.png')} style={styles.stonedLogo}>
                            <Image source={require('../assets/vtuLogo.png')} style={styles.vtuLogo}></Image>
                        </Image>
                        <Text style={styles.title}>
                            {/*<Icon name="mortar-board" color="#fff" size={30}/>*/}
                            Stoned VTU
                        </Text>
                    </View>
                    <View style={styles.bottomView}>
                        <View style={styles.inputWrapper}>
                            <Icon name="envelope" color="#fff" size={20} style={styles.inputIcon}/>
                            <TextInput style={[styles.input]} placeholder="Email" placeholderTextColor="white"
                                       underlineColorAndroid="#eee"/>
                        </View>
                        <View style={styles.inputWrapper}>
                            <Icon name="lock" color="#fff" size={25} style={styles.inputIcon}/>
                            <TextInput style={[styles.input]} secureTextEntry={true} placeholder="Password"
                                       placeholderTextColor="white" underlineColorAndroid="#eee"/>
                        </View>

                        <TouchableOpacity onPress={() => {}} style={styles.login}>
                            <Text style={styles.btnLoginText}>Log In</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {this.props.navigation.navigate('Home')}} style={styles.btnSkip}>
                            <Text style={styles.btnSkipText}>
                                Skip This
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Image>
        );
    }
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        flexDirection: 'column'
    },
    topView: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomView: {
        flex: 0.4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        padding: 10,
        flexDirection: 'column'
    },
    title: {
        fontSize: 25,
        color: '#fff',
        marginTop: 20
    },
    input: {
        flex: 1,
        alignSelf: 'stretch',
        color: '#fff',
        borderBottomColor: '#fff',
        fontSize: 18
    },
    login: {
        alignSelf: 'stretch',
        backgroundColor: '#4caf50',
        padding: 8,
        borderRadius: 5,
        marginTop: 10
    },
    btnLoginText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center'
    },
    btnSkip: {
        flex: 1
    },
    btnSkipText: {
        fontSize: 15,
        color: '#fff',
        textAlign: 'center',
        marginTop: 15
    },
    vtuLogo: {
        width: 100,
        height: 110,
        opacity: 0.4
    },
    stonedLogo: {
        width: 100,
        height: 110,
        opacity: 1,
    },
    inputWrapper: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputIcon: {
        width: 35,
        paddingHorizontal: 5,
        alignSelf: 'center',
        marginTop: 5
    }
});

