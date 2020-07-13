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
        backgroundColor: '#f0f0f0'
    },
    itemContainer: {
        width: '95%', alignSelf: 'center', borderRadius: 8, backgroundColor: 'white', padding: 16, marginTop: 8
    },
    itemTitle: {
        fontSize: 16, color: Global.MainColor,
        fontFamily: Global.FontName, fontWeight: '500'
    },
    infoText: {
        fontSize: 13, color: '#333333', marginTop : 8, width: '100%',
        fontFamily: Global.FontName, 
    }
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import { fetchApi } from 'actions/api'

const LIMIT = 10

class OrderDetailTransaction extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            items: [],
            isFetching: false,
            orderDetail: null
        }
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefresh() {
        const { order_id } = this.props

        if (!order_id) {
            return
        }

        this.setState({ isFetching: true }, () => {
            fetchApi('get', `page/order/${order_id}/get_order_transaction_informaiton/`)
                .then((data) => {
                    // console.log(data)

                    this.setState({ isFetching: false, items: data })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ isFetching: false, })
                })
        })

        fetchApi('get', `page/order/${order_id}/get_order_informaiton/`)
        .then((data) => {
            // console.log(data)

            this.setState({orderDetail: data})
        })
        .catch((error) => {
            console.log(error)
        })
    }

    renderItem({ item, index }) {
        return (
            <View style={styles.itemContainer}>
                <Text style={{ fontSize: 16, color: 'black', fontWeight: '500', fontFamily: Global.FontName, width: '100%' }}>{item.id + ' - ' + item.type}</Text>
                <Text style={{ fontSize: 14, marginTop: 10, color: 'black', fontFamily: Global.FontName, width: '100%' }}>{item.transaction_tag}</Text>
                <Text style={{ fontSize: 13, color: '#aaaaaa', fontFamily: Global.FontName, width: '100%', textAlign: 'right' }}>{item.created_tag}</Text>
            </View>
        )
    }

    renderHeader() {
        const { orderDetail } = this.state

        if (!orderDetail) {
            return null
        }

        return (
            <View style={styles.itemContainer}>
                <Text style={styles.itemTitle}>Thông tin thanh toán</Text>
                <View style={{ width: '100%', height: 1, backgroundColor: '#CECECE', marginTop: 8, marginBottom: 8 }} />

                <Text style={styles.infoText}>{`Tổng giá trị đơn hàng: `}
                    <Text style={{ color: 'black', fontSize: 14 }}>{convertMoney(Math.round(orderDetail.total_item_cost)) + ' đ'}</Text>
                </Text>

                <Text style={styles.infoText}>{`Tổng đã trả: `}
                    <Text style={{ color: 'black', fontSize: 14 }}>{convertMoney(Math.round(orderDetail.sum_payment_transaction)) + ' đ'}</Text>
                </Text>

                <Text style={styles.infoText}>{`Số lần trả: `}
                    <Text style={{ color: 'black', fontSize: 14 }}>{orderDetail.count_payment + ' lần'}</Text>
                </Text>

                <Text style={styles.infoText}>{`Tổng còn thiếu: `}
                    <Text style={{ color: 'black', fontSize: 14 }}>{convertMoney(Math.round(orderDetail.payment_left)) + ' đ'}</Text>
                </Text>

                <Text style={styles.infoText}>{`Cần cọc thêm: `}
                    <Text style={{ color: 'red', fontSize: 14 }}>{convertMoney(Math.round(orderDetail.need_to_pay)) + ' đ'}</Text>
                </Text>

                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                    {orderDetail && orderDetail.payment_left > 0 &&
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('PayOrderView', { order_id: orderDetail.id, payment_left: orderDetail.payment_left, need_to_pay: orderDetail.need_to_pay })} style={{ width: 100, height: 35, margin: 10, backgroundColor: 'blue', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, color: 'white', fontFamily: Global.FontName }}>Thanh toán</Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletBalanceView')} style={{ width: 100, height: 35, margin: 10, backgroundColor: 'green', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 14, color: 'white', fontFamily: Global.FontName }}>Nạp tiền</Text>
                    </TouchableOpacity>

                    {orderDetail && orderDetail.need_to_pay <= 0 &&
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('RefundOrderView', { order_id: orderDetail.id, need_to_pay: orderDetail.need_to_pay })} style={{ width: 100, height: 35, margin: 10, backgroundColor: 'orange', borderRadius: 5, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ fontSize: 14, color: 'white', fontFamily: Global.FontName }}>Hoàn tiền</Text>
                        </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }


    render() {

        const { isFetching, items } = this.state

        return (
            <View style={styles.container}>
                <FlatList
                    ListHeaderComponent={this.renderHeader.bind(this)}
                    renderItem={this.renderItem.bind(this)}
                    data={items}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={() => <Text style={{ width: '100%', fontSize: 13, textAlign: 'center', padding: 16, fontFamily: Global.FontName, color: '#aaaaaa' }}>Chưa có giao dịch</Text>}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFetching: state.order.detailFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailTransaction);
