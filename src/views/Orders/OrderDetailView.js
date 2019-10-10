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
        backgroundColor: '#f0f0f0',
        paddingBottom: getBottomSpace()
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import {getDetailInfo, getDetailItems} from './redux/action'
import OrderDetailItem from './component/OrderDetailItem'
import {fetchApi} from 'actions/api'
import ScrollableTabView, {ScrollableTabBar} from 'react-native-scrollable-tab-view'
import OrderDetailItems from './OrderDetailItems'
import OrderDetailInfo from './OrderDetailInfo'
import OrderDetailNotification from './OrderDetailNotification'
import OrderDetailTracking from './OrderDetailTracking'
import OrderDetailTransaction from './OrderDetailTransaction'
import { getBottomSpace } from 'react-native-iphone-x-helper';

class OrderDetailView extends React.Component {

    render() {
        const order_id = this.props.navigation.getParam('order_id')

        return (
            <View style={styles.container}>
                <Header title={'Chi tiết đơn hàng - ' + order_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <ScrollableTabView tabBarUnderlineStyle={{backgroundColor: Global.MainColor}} tabBarActiveTextColor={Global.MainColor} 
                    renderTabBar={() => <ScrollableTabBar />}
                >
                    <OrderDetailInfo tabLabel="Thông tin" order_id={order_id} navigation={this.props.navigation}/>
                    <OrderDetailItems tabLabel="Sản phẩm" order_id={order_id} navigation={this.props.navigation}/>
                    <OrderDetailTransaction tabLabel="Thanh toán" order_id={order_id} navigation={this.props.navigation}/>
                    <OrderDetailTracking tabLabel="Vận chuyển" order_id={order_id} navigation={this.props.navigation}/>
                    <OrderDetailNotification tabLabel="Thông báo" order_id={order_id}/>
                </ScrollableTabView>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFetching: state.order.detailFetching,
        orderDetail: state.order.detail,
        detailItems: state.order.detailItems,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getDetailInfo: (id) => dispatch(getDetailInfo(id)),
        getDetailItems: (id, offset, limit) => dispatch(getDetailItems(id, offset, limit))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailView);
