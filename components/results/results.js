import React, {Component} from 'react';
import {
    View,
    Text,
    Image,
    Linking,
    StyleSheet,
    Dimensions,
    DrawerLayoutAndroid,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {connect} from "react-redux";

import Navbar from '../Navbar';
import Menu from '../Menu';
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
            quotes: {
                success: [
                    '" There are no secrets to success. It is the result of preparation, hard work, and learning from failure. "',
                    '" If you are born poor its not your mistake, But if you die poor its your mistake. "'
                ],
                failure: [
                    '" Steve Jobs, Bill Gates and Mark Zuckerberg didn\'t finish college. So relax, grow your skills and enjoy learning. "',
                    '" Don’t compare yourself with anyone in this world. If you do so, you are insulting yourself. "',
                    '" I studied every thing but never topped… But today the toppers of the best universities are my employees - Bill Gates"'
                ]
            },
            response: {
                usn: "4ai16cs015",
                name: "Bindushree C",
                results: [
                    {
                        sem: 3,
                        result: [
                            {
                                code: "15MAT31",
                                name: "Engineering Mathematics - III",
                                credits: "4",
                                internal: "18",
                                external: "47",
                                total: "65",
                                gradePoints: "7",
                                gradeLetter: "B",
                                result: "P"
                            },
                            {
                                code: "15CS32",
                                name: "Analog and Digital Electronics",
                                credits: "4",
                                internal: "20",
                                external: "55",
                                total: "75",
                                gradePoints: "8",
                                gradeLetter: "A",
                                result: "F"
                            },
                            {
                                code: "15CS33",
                                name: "Data Structures and Applications",
                                credits: "4",
                                internal: "16",
                                external: "36",
                                total: "52",
                                gradePoints: "6",
                                gradeLetter: "C",
                                result: "P"
                            },
                            {
                                code: "15CS34",
                                name: "Computer Organization",
                                credits: "4",
                                internal: "19",
                                external: "48",
                                total: "67",
                                gradePoints: "7",
                                gradeLetter: "B",
                                result: "P"
                            },
                            {
                                code: "15CS35",
                                name: "Unix and Shell Programming",
                                credits: "4",
                                internal: "18",
                                external: "44",
                                total: "62",
                                gradePoints: "7",
                                gradeLetter: "B",
                                result: "P"
                            },
                            {
                                code: "15CS36",
                                name: "Discrete Mathematical Structures",
                                credits: "4",
                                internal: "19",
                                external: "35",
                                total: "54",
                                gradePoints: "6",
                                gradeLetter: "C",
                                result: "P"
                            },
                            {
                                code: "15CSL37",
                                name: "Analog and Digital Electronics Lab",
                                credits: "2",
                                internal: "20",
                                external: "75",
                                total: "95",
                                gradePoints: "10",
                                gradeLetter: "S+",
                                result: "P"
                            },
                            {
                                code: "15CSL38",
                                name: "Data Structures Laboratory",
                                credits: "2",
                                internal: "17",
                                external: "74",
                                total: "91",
                                gradePoints: "10",
                                gradeLetter: "S+",
                                result: "P"
                            }
                        ]
                    },
                    {
                        sem: 2,
                        result: [
                            {
                                code: "15MAT21",
                                name: "Engineering Maths-II",
                                credits: "4",
                                internal: "18",
                                external: "51",
                                total: "69",
                                gradePoints: "7",
                                gradeLetter: "B",
                                result: "P"
                            },
                            {
                                code: "15CHE22",
                                name: "Engineering Chemistry",
                                credits: "4",
                                internal: "16",
                                external: "47",
                                total: "63",
                                gradePoints: "7",
                                gradeLetter: "B",
                                result: "P"
                            },
                            {
                                code: "15PCD23",
                                name: "Programming in C & Data Structures",
                                credits: "4",
                                internal: "17",
                                external: "34",
                                total: "51",
                                gradePoints: "6",
                                gradeLetter: "C",
                                result: "P"
                            },
                            {
                                code: "15CED24",
                                name: "Computer Aided Engineering Drawing",
                                credits: "4",
                                internal: "20",
                                external: "76",
                                total: "96",
                                gradePoints: "10",
                                gradeLetter: "S+",
                                result: "P"
                            },
                            {
                                code: "15ELN25",
                                name: "Basic Electronics",
                                credits: "4",
                                internal: "18",
                                external: "58",
                                total: "76",
                                gradePoints: "8",
                                gradeLetter: "A",
                                result: "P"
                            },
                            {
                                code: "15CPL26",
                                name: "Computer Programming Lab.",
                                credits: "2",
                                internal: "19",
                                external: "52",
                                total: "71",
                                gradePoints: "8",
                                gradeLetter: "A",
                                result: "P"
                            },
                            {
                                code: "15CHEL27",
                                name: "Engineering Chemistry Lab.",
                                credits: "2",
                                internal: "18",
                                external: "78",
                                total: "96",
                                gradePoints: "10",
                                gradeLetter: "S+",
                                result: "P"
                            },
                            {
                                code: "15CIV28",
                                name: "Environmental Studies",
                                credits: "0",
                                internal: "7",
                                external: "34",
                                total: "41",
                                gradePoints: "4",
                                gradeLetter: "E",
                                result: "P"
                            }
                        ]
                    }
                ]
            }
        };
    }

    componentDidMount() {
        // Analytics.trackEvent('Results Table', {usn: this.state.response.usn});

    }

    openDrawer = () => {
        this.refs['DRAWER_REF'].openDrawer();
    }

    closeDrawer = () => {
        this.refs['DRAWER_REF'].closeDrawer();
    }

    isPromoted = () => {
        let resultsArr = this.state.response.results[this.state.currentIndex].result.map(item => {
            return item.result;
        });

        if(resultsArr.indexOf('F') > -1) {
            return false;
        } else {
            return true;
        }
    }

    render() {
        let sems = this.state.response.results.map(item => {
            return item.sem;
        });

        let currentIndex = this.state.currentIndex;

        let JSX = this.state.response.results[currentIndex].result.map((item, index) => {
            return (
                <View style={styles.resultView} key={index}>
                    <View style={styles.subjectNameWrapper}>
                        <Text style={styles.subjectName} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
                    </View>
                    {
                        Object.keys(item).map((key, innerIndex) => {
                            if (key === 'name') {
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
                                                            size={14}/> {this.state.response.name.toUpperCase()}</Text>
                                                    </View>
                                                    <View style={styles.usnWrapper}>
                                                        <Text style={styles.usn}><Icon name="id-card"
                                                                                       style={styles.paperPlane}
                                                                                       size={14}/> {this.state.response.usn.toUpperCase()}
                                                        </Text>
                                                    </View>
                                                </View>
                                                <View style={[styles.thumbWrapper, this.isPromoted()? styles.resultPass: styles.resultFail]}>
                                                    <Text style={styles.thumbText}>
                                                        {
                                                            this.isPromoted() ? 'P' : 'F'
                                                        }
                                                    </Text>
                                                </View>
                                                <View>
                                                    <Text
                                                        style={styles.quote}>{this.state.quotes[this.isPromoted()? 'success': 'failure'][Math.floor(Math.random() * 2)]}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.navPane}>
                                                <View style={styles.navItemWrapper}>
                                                    {
                                                        this.state.response.results[currentIndex - 1] &&
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({currentIndex: this.state.currentIndex - 1})}>
                                                            <Icon name="arrow-circle-left" color="#fff" size={22}/>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                                <View style={styles.navItemWrapper}>
                                                    <Text
                                                        style={styles.sem}>SEM {this.state.response.results[currentIndex].sem}</Text>
                                                </View>
                                                <View style={styles.navItemWrapper}>
                                                    {
                                                        this.state.response.results[currentIndex + 1] &&
                                                        <TouchableOpacity
                                                            onPress={() => this.setState({currentIndex: this.state.currentIndex + 1})}>
                                                            <Icon name="arrow-circle-right" color="#fff" size={22}/>
                                                        </TouchableOpacity>
                                                    }
                                                </View>
                                            </View>
                                        </Image>
                                        <View>
                                            {JSX}
                                        </View>
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
        // backgroundColor: '#fff',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
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
        color: '#fff'
    },
    resultView: {
        width: null,
        // height: 60,
        borderColor: '#fff',
        borderWidth: 1,
        margin: 5
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
    resultCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        textAlign: 'center'
    },
    resultPass: {
        backgroundColor: '#0f0'
    },
    resultFail: {
        backgroundColor: '#f00'
    },
    disclaimer: {
        color: '#fff',
        padding: 5,
        fontSize: 12,
        textAlign: 'center',
        marginVertical: 15
    }
});

function mapStateToProps(state) {
    return {
        token: state.token,
    };
}

export default connect(mapStateToProps, null)(Results);