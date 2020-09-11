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
import {getAppNotifications, updateNotificationRead, updateNotificationAllRead} from './redux/action'
import moment from 'moment';
import CustomAlert from '../../components/CustomAlert';

class NotificationView extends React.Component {

    componentDidMount(){
        this.props.getAppNotifications(1)
    }

    onRefresh(){
        this.props.getAppNotifications(1)
    }

    onClick(item){
        this.props.updateNotificationRead(item)
        if(item.target_content_type == 'order' && item.target_object_id){
            this.props.navigation.navigate('OrderDetailView', {order_id : item.target_object_id})
        }
        if(item.target_content_type == 'balanceaccount'){
            this.props.navigation.navigate('WalletBalanceView')
        }
        if(item.target_content_type == 'shipmentpackage' && item.target_object_id){
            this.props.navigation.navigate('TrackingDetailView', {tracking_id : item.target_object_id})
        }
    }

    renderItem({item, index}){
        return(
            <TouchableOpacity onPress={this.onClick.bind(this, item)} style={{width: '100%', padding: 16, backgroundColor: item.unread ? '#eeeeee' : 'white'}}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={{flex:1, fontSize: 16, color: 'black', fontFamily: Global.FontName}}>{item.verb}</Text>
                    <Text style={{marginLeft: 8, fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>{moment(item.timestamp).fromNow()}</Text>
                </View>
                <Text style={{fontSize: 13, marginTop: 3, color: '#333333', fontFamily: Global.FontName,}}>{item.description}</Text>
                <View style={{position: 'absolute', left: 0, right: 0, height: 0.5, bottom: 0, backgroundColor: '#CECECE'}}/>
                {item.unread && <View style={{position: 'absolute', right: 2, top: 8, bottom: 8, width: 3, backgroundColor: Global.MainColor}}/>}
            </TouchableOpacity>
        )
    }

    onEndReached(){
        if(!this.props.canLoadMore || this.props.isLoadingMore || this.props.isFetching){
            return
        }

        this.props.getAppNotifications(this.props.currentPage + 1)
    }

    onReadAll(){
        CustomAlert('Đã đọc', 'Bạn có muốn đánh dấu tất cả là đã đọc?', [
            {text: 'Huỷ'},
            {text: 'Đã đọc', onPress: () => {
                this.props.updateNotificationAllRead()
            }}
        ])
    }

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title='Thông báo'
                    rightIcon='low-vision'
                    rightAction={this.onReadAll.bind(this)}
                />

                <FlatList 
                    refreshing={this.props.isFetching}
                    data={this.props.notifications}
                    onRefresh={this.onRefresh.bind(this)}
                    keyExtractor={(item, index) => item.id}
                    style={{flex: 1, widht: '100%'}}
                    renderItem={this.renderItem.bind(this)}
                    onEndReached={this.onEndReached.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        notifications: state.notification.notifications,
        isFetching: state.notification.isFetching,
        canLoadMore: state.notification.canLoadMore,
        currentPage: state.notification.currentPage,
        isLoadingMore: state.notification.isLoadingMore
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAppNotifications: (page) => dispatch(getAppNotifications(page)),
        updateNotificationRead: (notification) => dispatch(updateNotificationRead(notification)),
        updateNotificationAllRead: () => dispatch(updateNotificationAllRead()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);
