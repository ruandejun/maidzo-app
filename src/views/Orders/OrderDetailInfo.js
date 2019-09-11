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
            fetchApi('get', `page/order/${order_id}/get_order_informaiton/`)
            .then((data) => {
                console.log(data)

                this.setState({isFetching: false, orderDetail: data})
            })
            .catch((error) => {
                console.log(error)

                this.setState({isFetching: false})
            })
        })

    }

    onReport(){
        const {order_id} = this.props

        if(!order_id){
            return
        }

        this.props.navigation.navigate('SubmitReportView', {order_number: order_id})
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
                    {orderDetail &&
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle}>Thông tin đơn hàng</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>
                            <Text style={styles.infoText}>{`Trạng thái: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.status}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Giá trị sản phẩm: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.sum_item_cost) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Phí ship nội địa: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.sum_item_shipping) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Phí dịch vụ: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.sum_item_total_service_cost) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng giá trị đơn hàng: `}
                                <Text style={{color: 'red', fontSize: 14}}>{convertMoney(orderDetail.total_item_cost) + ' đ'}</Text>
                            </Text>

                            <TouchableOpacity onPress={this.onReport.bind(this)} style={{width: 100, height: 35, marginTop: 10, alignSelf: 'center', backgroundColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Khiếu nại</Text>
                            </TouchableOpacity>
                        </View>
                    }

                    {orderDetail &&
                        <View style={styles.itemContainer}>
                            <Text style={[styles.itemTitle, {color: '#1B5795'}]}>Thông tin vận chuyển về Việt Nam</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>
                            <Text style={styles.infoText}>{`Tổng số cân: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.sum_shipment_weight + ' kg'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng số kiến: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.count_shipment}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng phí cân: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.sum_shipment_cost) + ' đ'}</Text>
                            </Text>
                        </View>
                    }

                    {orderDetail &&
                        <View style={styles.itemContainer}>
                            <Text style={[styles.itemTitle, {color: '#1B5795'}]}>Thông tin nhận hàng</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>
                            <Text style={styles.infoText}>{`Tên: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.receiver_name}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Số điện thoại: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.receiver_phone}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tài khoản: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.username}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Địa chỉ: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.address_tag}</Text>
                            </Text>
                        </View>
                    }

                    {orderDetail &&
                        <View style={styles.itemContainer}>
                            <Text style={styles.itemTitle}>Thông tin thanh toán</Text>
                            <View style={{width: '100%', height: 1, backgroundColor: '#CECECE', marginTop : 8, marginBottom : 8}}/>

                            <Text style={styles.infoText}>{`Tổng giá trị đơn hàng: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.total_item_cost) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng đã trả: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.sum_payment_transaction) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Số lần trả: `}
                                <Text style={{color: 'black', fontSize: 14}}>{orderDetail.count_payment + ' lần'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Tổng còn thiếu: `}
                                <Text style={{color: 'black', fontSize: 14}}>{convertMoney(orderDetail.payment_left) + ' đ'}</Text>
                            </Text>

                            <Text style={styles.infoText}>{`Cần cọc thêm: `}
                                <Text style={{color: 'red', fontSize: 14}}>{convertMoney(orderDetail.need_to_pay) + ' đ'}</Text>
                            </Text>

                            <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                                {orderDetail && orderDetail.payment_left > 0 && 
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('PayOrderView', {order_id: orderDetail.id, payment_left: orderDetail.payment_left, need_to_pay: orderDetail.need_to_pay})} style={{width: 100, height: 35, margin: 10, backgroundColor: 'blue', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Thanh toán</Text>
                                    </TouchableOpacity>
                                }

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('WalletBalanceView')} style={{width: 100, height: 35, margin: 10, backgroundColor: 'green', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                                    <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Nạp tiền</Text>
                                </TouchableOpacity>

                                {orderDetail && orderDetail.need_to_pay <= 0 && 
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('RefundOrderView', {order_id: orderDetail.id, need_to_pay: orderDetail.need_to_pay})} style={{width: 100, height: 35, margin: 10, backgroundColor: 'orange', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Hoàn tiền</Text>
                                    </TouchableOpacity>
                                }
                            </View>
                        </View>
                    }
                </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailInfo);
