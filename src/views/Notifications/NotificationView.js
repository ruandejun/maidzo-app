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
import {getSettings} from 'Setting/redux/action'

class NotificationView extends React.Component {

    onRefresh(){
        this.props.getSettings()
    }

    renderItem({item, index}){
        return(
            <View style={{width: '100%', padding: 10, backgroundColor: index % 2 == 0 ? 'white' : '#f2f2f2'}}>
                <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName,}}>{item.description}</Text>
                <View style={{position: 'absolute', left: 0, right: 0, height: 0.5, bottom: 0, backgroundColor: '#CECECE'}}/>
            </View>
        )
    }

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title='Tin tức'
                />

                <FlatList 
                    refreshing={this.props.isFetching}
                    data={this.props.notifications}
                    onRefresh={this.onRefresh.bind(this)}
                    keyExtractor={(item, index) => item.key}
                    style={{flex: 1, widht: '100%'}}
                    renderItem={this.renderItem.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        notifications: state.notification.notifications,
        isFetching: state.wallet.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSettings: () => dispatch(getSettings())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);
