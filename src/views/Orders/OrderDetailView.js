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
import {getDetailInfo, getDetailItems} from './redux/action'
import OrderDetailItem from './component/OrderDetailItem'
import {fetchApi} from 'actions/api'
import ScrollableTabView from 'react-native-scrollable-tab-view'
import OrderDetailItems from './OrderDetailItems'
import OrderDetailInfo from './OrderDetailInfo'

class OrderDetailView extends React.Component {

    render() {
        const order_id = this.props.navigation.getParam('order_id')

        return (
            <View style={styles.container}>
                <Header title={'Chi tiết đơn hàng - ' + order_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <ScrollableTabView>
                    <OrderDetailInfo tabLabel="Thông tin" order_id={order_id}/>
                    <OrderDetailItems tabLabel="Sản phẩm" order_id={order_id}/>
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
