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
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    footerContainer: {
        width: '100%', backgroundColor: 'white'
    },
    priceContainer: {
        width: '100%', flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#aaaaaa', backgroundColor: '#3578E5', padding: 8
    },
    finalContainer: {
        width: '100%', flexDirection: 'row', padding: 8,
        alignItems: 'center', justifyContent: 'space-between'
    },
    priceText: {
        fontSize: 14, color: 'white', fontFamily: Global.FontName
    },
    orderContainer: {
        height: 50, marginBottom : 20, marginTop : 10, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center'
    },
    orderText: {
        fontSize: 14, color: 'white', fontWeight: '500', fontFamily: Global.FontName
    },
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, } from 'src/Global';
import Header from 'components/Header'
import CartItem from './component/CartItem'
import {createOrderFromCart} from 'Orders/redux/action'
import {StackActions} from 'react-navigation'

class CartConfirmView extends React.Component {

    renderItem({item, index}){
        return(
            <CartItem {...item} disable_selected={true}/>
        )
    }

    footerView(){

        const {cartItems} = this.props

        if(cartItems.length == 0){
            return null
        }

        let item_fee = 0
        let shipping_vnd = 0
        let service_fee = 0
        let total = 0

        cartItems.map((item) => {
            shipping_vnd += parseInt(item.shipping_vnd)
            item_fee += (parseInt(item.price_vnd) * item.quantity)
            service_fee += parseInt(item.total_service_cost_vnd)
            total += parseInt(item.total_vnd)
        })

        return(
            <View style={styles.footerContainer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Thành tiền</Text>
                    <Text style={styles.priceText}>{convertMoney(item_fee) + 'đ'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí ship nội địa</Text>
                    <Text style={styles.priceText}>{convertMoney(shipping_vnd) + 'đ'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí dịch vụ</Text>
                    <Text style={styles.priceText}>{convertMoney(service_fee) + 'đ'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Tổng</Text>
                    <Text style={styles.priceText}>{convertMoney(total) + 'đ'}</Text>
                </View>

                <TouchableOpacity style={styles.orderContainer}>
                    <Text style={styles.orderText}>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        )
    }

    onNext(){
        const cart_info = this.props.navigation.getParam('cart_info')
        const selectedItems = this.props.navigation.getParam('selectedItems')

        if(!cart_info){
            return null
        }

        const {full_name, street, district, city, phone_number, ship_method, order_note, facebook} = cart_info
        let item_submit = []

        selectedItems.map((item) => {
            item_submit.push(item)
        })

        this.props.createOrderFromCart(full_name, street, district, city, phone_number, ship_method, order_note, facebook, JSON.stringify(item_submit))
    }

    renderHeader(){
        const cart_info = this.props.navigation.getParam('cart_info')

        if(!cart_info){
            return null
        }

        const {full_name, phone_number, street, district, city} = cart_info

        return(
            <View style={{padding: 16}}>
                <Text style={{fontSize: 11, color: '#777777', fontFamily: Global.FontName}}>Thông tin người nhận hàng</Text>
                <Text  style={{fontSize: 16, color: 'black', marginTop: 8, fontFamily: Global.FontName}}>{`${full_name}`}</Text>
                <Text  style={{fontSize: 14, color: '#333333', marginTop: 5, fontFamily: Global.FontName}}>{`${phone_number}`}</Text>
                <Text  style={{fontSize: 13, color: '#333333', marginTop: 5, fontFamily: Global.FontName}}>{`${street}, ${district}, ${city}`}</Text>
            </View>
        )
    }

    render() {

        const {cartItems, isFetching} = this.props
        const selectedItems = this.props.navigation.getParam('selectedItems')

        let total = 0
        let finalItems = []

        cartItems.map((item) => {
            if(selectedItems.indexOf(item.id) > -1){
                total += Math.round(parseInt(item.total_vnd))
                finalItems.push(item)
            }
        })

        return (
            <View style={styles.container}>
                <Header title='Xác nhận đơn hàng'
                        leftIcon='chevron-left'
                        leftAction={() => this.props.navigation.goBack()}
                        rightIcon='times'
                        rightAction={() => this.props.navigation.dispatch(StackActions.popToTop())}
                />
                <FlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={finalItems}
                    style={{flex : 1}}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                />

                <View style={styles.footerContainer}>
                    <View style={styles.finalContainer}>
                        <Text style={[styles.priceText, {color: '#aaaaaa'}]}>Thành tiền (đã gồm VAT)</Text>
                        <Text style={[styles.priceText, {color: Global.MainColor, fontSize: 18}]}>{convertMoney(total) + 'đ'}</Text>
                    </View>

                    <TouchableOpacity onPress={this.onNext.bind(this)} style={styles.orderContainer}>
                        <Text style={styles.orderText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cartItems: state.cart.items,
        isFetching: state.cart.isFetching,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        createOrderFromCart: (full_name, street, district, city, phone_number, ship_method, order_note, facebook, item_submit) => dispatch(createOrderFromCart(full_name, street, district, city, phone_number, ship_method, order_note, facebook, item_submit))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartConfirmView);
