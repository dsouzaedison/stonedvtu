import React, {Component} from 'react';
import {
    CameraRoll,
    Dimensions,
    DrawerLayoutAndroid,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";

import Navbar from '../Navbar';
import Menu from '../Menu';
import ViewShot from "react-native-view-shot";
import AppCenter from "appcenter";
import Analytics from 'appcenter-analytics';

export class Results extends Component {
    constructor() {
        super();
        // this.state = {
        //     installID: ''
        // };

        this.state = {
            currentIndex: 0,
            fitToScreen: false,
            captureInProgress: false
        };
    }

    componentDidMount() {
        // Analytics.trackEvent('Results Table', {usn: this.props.results.studentResult.usn});
    }

    openDrawer = () => {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer = () => {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    isPromoted = () => {
        let resultsArr = this.props.results.studentResult.results[this.state.currentIndex].result.map(item => {
            return item.result;
        });

        if (resultsArr.indexOf('F') > -1) {
            return false;
        } else {
            return true;
        }
    }

    captureResults = () => {
        this.setState({
            captureInProgress: true
        }, () => {
            setTimeout(() => {
                this.refs.viewShot.capture()
                    .then(uri => {
                        this.setState({
                            captureInProgress: false
                        });
                        console.log("do something with ", uri);
                        CameraRoll.saveToCameraRoll(uri);
                    })
                    .catch(e => console.error(e));
            }, 200);
        })

    }

    render() {
        let sems = this.props.results.studentResult.results.map(item => {
            return item.sem;
        });

        let currentIndex = this.state.currentIndex;

        let JSX = this.props.results.studentResult.results[currentIndex].result.map((item, index) => {
            if (!this.state.fitToScreen) {
                return (
                    <View style={styles.resultView} key={index}>
                        <View style={styles.subjectNameWrapper}>
                            <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                            {
                                index === 0 &&
                                <TouchableOpacity style={styles.switchSizeIconWrapper}
                                                  onPress={() => this.setState({fitToScreen: true})}>
                                    <Icon name="arrow-circle-up" style={styles.switchSizeIcon}/>
                                </TouchableOpacity>
                            }
                        </View>
                        {
                            this.props.results.studentResult.displayOrder.map((key, innerIndex) => {
                                if (key === 'name' || !item[key]) {
                                    return <View key={innerIndex}></View>
                                } else {
                                    return (
                                        <View style={styles.subjectItem} key={innerIndex}>
                                            <View style={styles.resultPropWrapper}>
                                                <Text style={styles.resultProp}>{key.toUpperCase()}</Text>
                                            </View>
                                            <View style={styles.resultValWrapper}>
                                                <Text
                                                    style={[styles.resultVal, key.toLowerCase() === 'result' ? styles.resultCircle : '', ((key.toLowerCase() === 'result') && (item[key].toUpperCase() === 'P')) ? styles.resultPass : '', ((key.toLowerCase() === 'result') && (item[key].toUpperCase() === 'F')) ? styles.resultFail : '']}>{item[key]}</Text>
                                            </View>
                                        </View>
                                    );
                                }
                            })
                        }
                    </View>
                )
            } else {
                return (
                    <View style={[styles.minResultView]} key={index}>
                        <View style={styles.subjectNameWrapper}>
                            <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                            {
                                index === 0 &&
                                <TouchableOpacity style={styles.switchSizeIconWrapper}
                                                  onPress={() => this.setState({fitToScreen: false})}>
                                    <Icon name="arrow-circle-down" style={styles.switchSizeIcon}/>
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={styles.minValueWrapper}>
                            {
                                this.props.results.studentResult.displayOrder.map((key, innerIndex) => {
                                    if (key === 'name' || !item[key]) {
                                        return <View key={innerIndex}></View>
                                    } else {
                                        return (
                                            <View key={innerIndex} style={styles.resultValWrapper}>
                                                <Text
                                                    style={[styles.minResultVal, key.toLowerCase() === 'result' ? styles.resultCircle : '', ((key.toLowerCase() === 'result') && (item[key].toUpperCase() === 'P')) ? styles.resultPass : '', ((key.toLowerCase() === 'result') && (item[key].toUpperCase() === 'F')) ? styles.resultFail : '']}>{item[key]}</Text>
                                            </View>
                                        );
                                    }
                                })
                            }
                        </View>
                    </View>
                )
            }

        });

        return (
            <DrawerLayoutAndroid
                drawerWidth={300}
                drawerPosition={DrawerLayoutAndroid.positions.Left}
                ref={'DRAWER_REF'}
                renderNavigationView={() => <Menu closeDrawer={this.closeDrawer} home_nav={this.props.navigation}/>}>
                <View style={{flex: 1}}>
                    <View style={styles.backgroundImage}>
                        <View style={styles.container}>
                            <Navbar openDrawer={this.openDrawer} home_nav={this.props.navigation}
                                    contentType={this.props.contentType}/>
                            <View style={styles.errorContainer}>
                                <Image source={require('../../assets/homebg.jpg')} style={styles.img} blurRadius={8}>
                                    <ScrollView>
                                        <Image source={require('../../assets/graduate.jpg')}
                                               style={styles.titleBackground}
                                               blurRadius={3}>
                                            <View style={styles.darkOverlay}>
                                                <View style={styles.userInfo}>
                                                    <View style={styles.nameWrapper}>
                                                        <Text numberOfLines={1}
                                                              ellipsizeMode="tail" style={styles.name}><Icon
                                                            name="user-circle" style={styles.paperPlane}
                                                            size={14}/> {this.props.results.studentResult.name.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.usnWrapper}>
                                                        <Text style={styles.usn}><Icon name="id-card"
                                                                                       style={styles.paperPlane}
                                                                                       size={14}/> {this.props.results.studentResult.usn.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View
                                                    style={[styles.thumbWrapper, this.isPromoted() ? styles.resultPass : styles.resultFail]}>
                                                    <Text style={styles.thumbText}>
                                                        {
                                                            this.isPromoted() ? 'P' : 'F'
                                                        }
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text
                                                        style={styles.quote}>{this.props.quotes[this.isPromoted() ? 'success' : 'failure'][Math.floor(Math.random() * this.props.quotes[this.isPromoted() ? 'success' : 'failure'].length)]}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.navPane}>
                                                <View style={styles.navItemWrapper}>
                                                    {
                                                        this.props.results.studentResult.results[currentIndex - 1] &&
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({currentIndex: this.state.currentIndex - 1})}>
                                                            <Icon name="arrow-circle-left" color="#fff" size={25}/>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                                <View style={styles.navItemWrapper}>
                                                    <Text
                                                        style={styles.sem}>SEM {this.props.results.studentResult.results[currentIndex].sem}</Text>
                                                </View>
                                                <View style={styles.navItemWrapper}>
                                                    {
                                                        this.props.results.studentResult.results[currentIndex + 1] &&
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({currentIndex: this.state.currentIndex + 1})}>
                                                            <Icon name="arrow-circle-right" color="#fff" size={25}/>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                        </Image>
                                        <TouchableOpacity onPress={() => this.captureResults()}>
                                            <Text style={styles.captureButtonText}><Icon name="camera" color="#fff"
                                                                                         size={16}/> Take
                                                Snapshot</Text>
                                        </TouchableOpacity>
                                        <ViewShot ref="viewShot" options={{format: "jpg", quality: 1}}>
                                            {
                                                this.state.captureInProgress &&
                                                <View>
                                                    <View style={styles.userInfoStatic}>
                                                        <View style={styles.nameWrapper}>
                                                            <Text numberOfLines={1}
                                                                  ellipsizeMode="tail" style={styles.name}><Icon
                                                                name="user-circle" style={styles.paperPlane}
                                                                size={14}/> {this.props.results.studentResult.name.toUpperCase()}
                                                            </Text>
                                                        </View>
                                                        <View style={styles.usnWrapper}>
                                                            <Text style={styles.usn}><Icon name="id-card"
                                                                                           style={styles.paperPlane}
                                                                                           size={14}/> {this.props.results.studentResult.usn.toUpperCase()}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                    <View style={styles.captureViewSemWrapper}>
                                                        <Text style={styles.captureViewSem}>SEMESTER 1</Text>
                                                    </View>
                                                    <View>
                                                        <Text style={styles.watermark}>Powered By VTU Aura</Text>
                                                    </View>
                                                </View>
                                            }
                                            {JSX}
                                            {
                                                this.state.captureInProgress &&
                                                <Text style={styles.captureWarning}>
                                                    <Icon name="warning" color="#fff" size={10}/> CAUTION - Authencity
                                                    is not guaranteed!
                                                </Text>
                                            }
                                        </ViewShot>
                                        <Text style={styles.disclaimer}>
                                            <Icon name="warning" color="#fff" size={11}/> Results displayed here are for
                                            representational purpose only.
                                            We do not guarantee the authenticity of the results. For clarification,
                                            visit official website.
                                        </Text>
                                    </ScrollView>
                                </Image>
                            </View>
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
        backgroundColor: '#eee'
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
        // resizeMode: 'cover',
        flex: 1,
        flexDirection: 'column',
        height: null,
        // justifyContent: 'center',
        // alignItems: 'center'
    },
    titleBackground: {
        alignSelf: 'stretch',
        width: null,
        height: 250,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    darkOverlay: {
        flex: 1,
        alignSelf: 'stretch',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    thumbWrapper: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center'
    },
    thumbText: {
        color: '#fff',
        fontSize: 20
    },
    userInfo: {
        height: 30,
        alignSelf: 'stretch',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    userInfoStatic: {
        height: 30,
        alignSelf: 'stretch',
        margin: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    nameWrapper: {
        flex: 1,
        alignSelf: 'stretch',
    },
    usnWrapper: {
        flex: 1,
        alignSelf: 'stretch',
    },
    name: {
        backgroundColor: '#fff',
        alignSelf: 'stretch',
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontWeight: 'bold'
    },
    usn: {
        backgroundColor: '#f60',
        color: '#fff',
        alignSelf: 'stretch',
        paddingHorizontal: 15,
        paddingVertical: 5,
        // textAlign: 'center',
        fontWeight: 'bold'
    },
    quote: {
        color: '#fff',
        textAlign: 'center',
        marginTop: 15,
        fontSize: 15,
        margin: 5,
        fontWeight: 'bold'
    },
    navPane: {
        height: 40,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        flexDirection: 'row'
    },
    navItemWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sem: {
        color: '#fff',
        fontSize: 18
    },
    resultView: {
        width: null,
        borderColor: '#fff',
        borderWidth: 1,
        margin: 5
    },
    minResultView: {
        width: null,
        borderColor: '#fff',
        borderWidth: 1,
        marginHorizontal: 5
    },
    subjectNameWrapper: {
        alignSelf: 'stretch',
        // height: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5
    },
    subjectName: {
        color: '#555'
    },
    subjectItem: {
        flexDirection: 'row'
    },
    minValueWrapper: {
        flexDirection: 'row'
    },
    resultPropWrapper: {
        flex: 1,
        borderColor: '#fff',
        borderWidth: 1,
        padding: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.2)'
    },
    resultValWrapper: {
        flex: 1,
        borderColor: '#fff',
        borderWidth: 1,
        padding: 5
    },
    resultProp: {
        color: '#fff',
        fontWeight: 'bold'
    },
    resultVal: {
        color: '#fff',
        alignSelf: 'flex-end'
    },
    minResultVal: {
        color: '#fff',
        alignSelf: 'center',
        fontSize: 12,
        lineHeight: 18
    },
    resultCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        textAlign: 'center'
    },
    resultPass: {
        backgroundColor: '#4CAF50'
    },
    resultFail: {
        backgroundColor: '#f44336'
    },
    disclaimer: {
        color: '#fff',
        padding: 5,
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 15
    },
    switchSizeIconWrapper: {
        position: 'absolute',
        right: 5,
        zIndex: 10
    },
    switchSizeIcon: {
        fontSize: 20
    },
    marginTop: {
        marginTop: 5
    },
    captureViewSemWrapper: {
        margin: 5,
        padding: 5,
        backgroundColor: '#fff'
    },
    captureViewSem: {
        fontSize: 14,
        textAlign: 'center'
    },
    watermark: {
        color: '#fff',
        textAlign: 'center',
        marginBottom: 5
    },
    captureWarning: {
        color: '#fff',
        textAlign: 'center',
        margin: 5,
        fontSize: 10
    },
    captureButtonText: {
        color: '#fff',
        margin: 6,
        padding: 3,
        textAlign: 'center',
        backgroundColor: '#f60',
        fontSize: 17,
        borderRadius: 4
    }
});

function mapStateToProps(state) {
    return {
        token: state.token,
        results: state.results,
        quotes: state.results.quotes
    };
}

export default connect(mapStateToProps, null)(Results);