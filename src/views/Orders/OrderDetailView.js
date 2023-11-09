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
    ScrollView,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingBottom: getBottomSpace()
    },
})

import { connect } from 'react-redux';
import Global from 'src/Global';
import Header from 'components/Header'
import { getDetailInfo, getDetailItems } from './redux/action'
import OrderDetailItems from './OrderDetailItems'
import OrderDetailInfo from './OrderDetailInfo'
import OrderDetailNotification from './OrderDetailNotification'
import OrderDetailTracking from './OrderDetailTracking'
import OrderDetailTransaction from './OrderDetailTransaction'
import { getBottomSpace } from 'react-native-iphone-x-helper';

const viewModes = [
    'Thông tin',
    'Sản phẩm',
    'Thanh toán',
    'Vận chuyển',
    'Thông báo'
]

class OrderDetailView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            viewMode: viewModes[0]
        }
    }

    render() {
        const { order_id } = this.props.route.params
        const { viewMode } = this.state

        return (
            <View style={styles.container}>
                <Header title={'Chi tiết đơn hàng - ' + order_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <View>
                    <ScrollView horizontal>
                        {
                            viewModes.map((mode, index) => (
                                <TouchableOpacity
                                    style={{
                                        height: 44,
                                        alignItems: 'center',
                                        paddingHorizontal: 16,
                                        paddingTop: 8,
                                        backgroundColor: 'white',
                                        borderBottomWidth: 5,
                                        borderBottomColor: viewMode === mode ? Global.MainColor : 'white'
                                    }}
                                    onPress={() => this.setState({viewMode: mode})}
                                >
                                    <Text style={{ fontSize: 16, fontWeight: '500', color: viewMode === mode ? Global.MainColor : 'black' }}>{mode}</Text>
                                </TouchableOpacity>
                            ))
                        }
                    </ScrollView>
                </View>

                {viewMode === viewModes[0] && <OrderDetailInfo tabLabel="Thông tin" order_id={order_id} navigation={this.props.navigation} />}
                {viewMode === viewModes[1] && <OrderDetailItems tabLabel="Sản phẩm" order_id={order_id} navigation={this.props.navigation} />}
                {viewMode === viewModes[2] && <OrderDetailTransaction tabLabel="Thanh toán" order_id={order_id} navigation={this.props.navigation} />}
                {viewMode === viewModes[3] && <OrderDetailTracking tabLabel="Vận chuyển" order_id={order_id} navigation={this.props.navigation} />}
                {viewMode === viewModes[4] && <OrderDetailNotification tabLabel="Thông báo" order_id={order_id} />}
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
