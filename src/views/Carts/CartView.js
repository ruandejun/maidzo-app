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
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6', paddingBottom: getBottomSpace()
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
        height: 50, marginBottom : 0, marginTop : 10, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center'
    },
    orderText: {
        fontSize: 14, color: 'white', fontWeight: '500', fontFamily: Global.FontName
    },
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, } from 'src/Global';
import Header from 'components/Header'
import CartItem from './component/CartItem'
import {getCart, deleteCartItem, updateCartItem} from './redux/action'
import { getBottomSpace } from 'react-native-iphone-x-helper';

class CartView extends React.Component {

    onRefresh(){
        this.props.getCart()
    }

    componentDidMount(){
        this.onRefresh()
    }

    renderItem({item, index}){
        return(
            <CartItem {...item} 
                onDelete={this.onDelete.bind(this, item)}
                onUpdateQuantity={(quantity) => this.onUpdateItem(item.id, quantity, 'quantity')}
                onUpdateNote={(text) => this.onUpdateItem(item.id, text, 'note')}
            />
        )
    }

    onDelete(item){
        this.props.deleteCartItem(item.id)
    }

    onUpdateItem(pk, value, name){
        this.props.updateCartItem(pk, value, name)
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
        this.props.navigation.navigate('CartInfoView')
    }

    listEmpty(){
        return(
            <Text style={{padding: 20, width: '100%', textAlign: 'center', fontSize: 13, color: '#777777', fontFamily: Global.FontName}}>Bạn chưa có sản phẩm nào trong giỏ hàng</Text>
        )
    }

    render() {

        const {cartItems, isFetching} = this.props

        let total = 0

        cartItems.map((item) => {
            total += Math.round(parseInt(item.total_vnd))
        })

        return (
            <View style={styles.container}>
                <Header title='Giỏ hàng'
                    rightIcon='times'
                    rightAction={() => this.props.navigation.goBack()}
                />
                <FlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={cartItems}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{flex : 1}}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this.listEmpty.bind(this)}
                />

                <View style={styles.footerContainer}>
                    <View style={styles.finalContainer}>
                        <Text style={[styles.priceText, {color: '#aaaaaa'}]}>Thành tiền (đã gồm VAT)</Text>
                        <Text style={[styles.priceText, {color: Global.MainColor, fontSize: 18}]}>{convertMoney(total) + 'đ'}</Text>
                    </View>

                    {cartItems.length > 0 &&
                        <TouchableOpacity onPress={this.onNext.bind(this)} style={styles.orderContainer}>
                            <Text style={styles.orderText}>Tiến hành đặt hàng</Text>
                        </TouchableOpacity>
                    }
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
        getCart: () => {dispatch(getCart())},
        deleteCartItem: (id) => {dispatch(deleteCartItem(id))},
        updateCartItem: (pk, value, name) => {dispatch(updateCartItem(pk, value, name))},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartView);
