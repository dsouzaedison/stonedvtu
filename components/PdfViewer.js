import React, {Component} from 'react';
import {
    StyleSheet,
    TouchableHighlight,
    Dimensions,
    View,
    Text
} from 'react-native';
import Pdf from 'react-native-pdf';
import {connect} from 'react-redux';
import * as actionCreators from '../actionCreators';
import * as constants from './constants';

export class PdfViewer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageCount: 1,
        };
        this.pdf = null;
    }

    prePage=()=>{
        if (this.pdf){
            let prePage = this.state.page>1?this.state.page-1:1;
            this.pdf.setNativeProps({page: prePage});
            this.setState({page:prePage});
            console.log(`prePage: ${prePage}`);
        }
    };

    nextPage=()=>{
        if (this.pdf){
            let nextPage = this.state.page+1>this.state.pageCount?this.state.pageCount:this.state.page+1;
            this.pdf.setNativeProps({page: nextPage});
            this.setState({page:nextPage});
            console.log(`nextPage: ${nextPage}`);
        }

    };

    render() {
        let source = {uri: this.props.pdfUrl, cache:true};

        return (
            <Pdf ref={(pdf) => {
                this.pdf = pdf;
            }}
                 source={source}
                 page={1}
                 horizontal={false}
                 onLoadComplete={(pageCount) => {
                     this.setState({pageCount: pageCount});
                     console.log(`total page count: ${pageCount}`);
                 }}
                 onPageChanged={(page, pageCount) => {
                     this.setState({page: page});
                     console.log(`current page: ${page}`);
                 }}
                 onError={(error) => {
                     console.log(error);
                 }}
                 style={styles.pdf}/>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 25,
    },
    btn: {
        margin: 5,
        padding:5,
        backgroundColor: "blue",
    },
    btnDisable: {
        margin: 5,
        padding:5,
        backgroundColor: "gray",
    },
    btnText: {
        color: "#FFF",
    },
    pdf: {
        flex:1,
        width:Dimensions.get('window').width,
    }
});

function mapStateToProps(state) {
    return {
        pdfUrl: state.pdfUrl
    };
}

function mapDispatchToProps(dispatch) {
    // return {
    //     updatePdf: (fileName) => {
    //         dispatch(actionCreators.updatePdf(fileName));
    //     }
    // }
}

export default connect(mapStateToProps)(PdfViewer)
