import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    AppState,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import Webview from 'react-native-webview'

class HomeWebview extends React.Component {

    loadingTimer = null

    componentDidMount(){
        console.log('test')
    }

    onstartRequest(event){
        try {
            console.log(event)
            if(this.loadingTimer){
                clearTimeout(this.loadingTimer)
                this.loadingTimer = null
            }

            this.loadingTimer = setTimeout(() => {
                fetch(event.url)
                .then((res) => res.text())
                .then((data) => {
                    console.log(data)
                })
                .catch((error) => {
                    console.log(error)
                })
            }, 100)
        } catch (error) {
            console.log(error)
        }

        return true
    }

    handleWebViewNavigationStateChange(newState){
        console.log(newState)
    }

    render() {

        const url = this.props.navigation.getParam('url')

        return (
            <View style={styles.container}>
                <Header
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={{flex: 1}}>
                    <Webview 
                        // onNavigationStateChange={this.handleWebViewNavigationStateChange.bind(this)}
                        style={{flex: 1}} source={{uri: url}}
                        onShouldStartLoadWithRequest={this.onstartRequest.bind(this)}
                    />
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeWebview);
