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
    RefreshControl,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6', alignItems: 'center'
    },
    itemContainer: {
        width: '95%',
        borderRadius: 8,
        padding: 10, backgroundColor: 'white', alignSelf: 'center', marginTop : 10
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
import Global, { Media, calculateDistance, decode, convertMoney } from 'src/Global';
import Header from 'components/Header'
import {getDetailInfo, getDetailItems} from './redux/action'
import {fetchApi} from 'actions/api'
import { ScrollView } from 'react-native-gesture-handler';

class OrderDetailInfo extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            orderDetail: null,
            isFetching: false
        }
    }

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        const {order_id} = this.props

        if(!order_id){
            return
        }

        this.setState({isFetching: true}, () => {
            fetchApi('get', `page/order/${order_id}/items/`)
            .then((data) => {
                // console.log(data)

                this.setState({isFetching: false, orderDetail: data})
            })
            .catch((error) => {
                console.log(error)

                this.setState({isFetching: false})
            })
        })

    }

    render() {

        const {orderDetail} = this.state

        return (
            <View style={styles.container}>
                <ScrollView style={{flex: 1, width: Global.ScreenWidth}} 
                    refreshControl={<RefreshControl 
                        onRefresh={this.onRefresh.bind(this)}
                        refreshing={this.state.isFetching}
                    />}
                >
                    {orderDetail && orderDetail.order_information &&
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle}>Thông tin đơn hàng</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>
                            <Text style={styles.infoText}>{`Trạng thái: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.order_information.status}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Giá trị sản phẩm: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.order_information.sum_item_cost) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`70% giá trị hàng: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(parseFloat(orderDetail.order_information.total_item_cost) * 0.7) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Phí dịch vụ: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.order_information.sum_item_total_service_cost) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng giá trị đơn hàng: `}
                                <Text style={{color: 'red', fontSize: 14}}>{convertMoney(orderDetail.order_information.total_item_cost) + ' đ'}</Text>
                            </Text>
                        </View>
                    }

                    {orderDetail && orderDetail.order_information &&
                        <View style={styles.itemContainer}>
                            <Text style={[styles.itemTitle, {color: '#1B5795'}]}>Thông tin khách hàng</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>
                            <Text style={styles.infoText}>{`Người nhận: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.order_information.receiver_name}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Số điện thoại người nhận: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.order_information.receiver_phone}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tài khoảng người nhận: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.order_information.receiver_username}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Địa chỉ người nhận: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.order_information.address_tag}</Text>
                            </Text>
                        </View>
                    }

                    {orderDetail && orderDetail.order_information &&
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle}>Thông tin thanh toán</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>

                            <Text style={styles.infoText}>{`Tổng giá trị đơn hàng: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.order_information.total_item_cost) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng đã trả: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.order_information.sum_payment_transaction) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Số lần trả: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.order_information.count_payment + ' lần'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng còn thiếu: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.order_information.payment_left) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Cần cọc thêm: `}
                                <Text style={{color: 'red', fontSize: 14}}>{convertMoney(orderDetail.order_information.need_to_pay) + ' đ'}</Text>
                            </Text>
                        </View>
                    }
                </ScrollView>
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
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailInfo);
