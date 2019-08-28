/**
 * @flow
 * @providesModule HomeMainView
 */

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

class HomeView extends React.Component {

    onpenWeb(){
        this.props.navigation.navigate('HomeWebview', {url: 'https://taobao.com'})
    }

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title='Trang chủ'
                    leftIcon='user-circle'
                />

                <TouchableOpacity onPress={this.onpenWeb.bind(this)}>
                    <Text>Taobao</Text>
                </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
