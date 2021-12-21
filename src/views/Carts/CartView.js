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
    Linking,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0', paddingBottom: getBottomSpace()
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
        flex: 1, flexDirection: 'row', padding: 8,
        alignItems: 'center', justifyContent: 'space-between'
    },
    priceText: {
        fontSize: 14, color: 'white', fontFamily: Global.FontName
    },
    orderContainer: {
        height: 30, borderRadius: 5, paddingLeft: 8, paddingRight: 8, marginBottom : 0, marginLeft: 10, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center'
    },
    orderText: {
        fontSize: 14, color: 'white', fontWeight: '500', fontFamily: Global.FontName
    },
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, } from 'src/Global';
import Header from 'components/Header'
import CartItem from './component/CartItem'
import VendorItem from './component/VendorItem'
import {getCart, deleteCartItem, updateCartItem, updateCartItemService, deleteSelected} from './redux/action'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import {Checkbox} from 'teaset';
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomAlert from 'components/CustomAlert'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

class CartView extends React.Component {

    state = {
        selectedItems: []
    }

    onRefresh(){
        this.props.getCart()
    }

    componentDidMount(){
        this.onRefresh()
        if((this.props.cartItems)){
            let selectedItems = []
            this.props.cartItems.map((item) => {
                selectedItems.push(item.id)
            })
            this.setState({selectedItems: selectedItems})
        }
    }

    componentDidUpdate(prevProps){
        if((!prevProps.cartItems && this.props.cartItems) || (prevProps.cartItems && this.props.cartItems && prevProps.cartItems.length != this.props.cartItems.length)){
            let selectedItems = []
            this.props.cartItems.map((item) => {
                selectedItems.push(item.id)
            })
            this.setState({selectedItems: selectedItems})
        }
    }

    renderItem({item, index}){
        const {selectedItems} = this.state

        const data = this.props.cartVendors[item]
        // console.log(data)
        return(
            <VendorItem vendor={item} items={data} selectedItems={selectedItems}
                onDelete={this.onDelete.bind(this)}
                onUpdateItem={this.onUpdateItem.bind(this)}
                onUpdateService={this.onUpdateService.bind(this)}
                onSelected={this.onSelected.bind(this)}
                openItem={this.openItem.bind(this)}
            />
        )
    }

    openItem(link) {
        this.props.navigation.navigate('TaobaoWebView', { url: link.replace('#modal=sku', '') })
    }

    onSelected(item_list){
        let selectedItems = this.state.selectedItems

        item_list.map((item) => {
            const index = selectedItems.indexOf(item)
        

            if(index > -1){
                selectedItems.splice(index, 1)
            } else {
                selectedItems.push(item)
            }
        })

        this.setState({selectedItems: selectedItems})
    }

    onDelete(ids){
        console.log(ids)
        CustomAlert(null, `Bạn có chắc chắn muốn xoá ${ids.length} sản phẩm?`, [
            {text: 'Xoá', onPress: () => {
                this.props.deleteSelected(JSON.stringify(ids))
            }},
            {text: 'Huỷ'}
        ])
    }

    deleteSelected(){
        const {selectedItems} = this.state
        if(selectedItems.length == 0){
            CustomAlert(null, 'Chưa chọn sản phẩm nào')
            return
        }

        CustomAlert(null, `Bạn có chắc chắn muốn xoá ${selectedItems.length} sản phẩm?`, [
            {text: 'Xoá', onPress: () => {
                this.props.deleteSelected(JSON.stringify(selectedItems))
            }},
            {text: 'Huỷ'}
        ])
    }

    onUpdateItem({pk, value, name}){
        this.props.updateCartItem(pk, value, name)
    }

    onUpdateService({item_list, value, name}){
        this.props.updateCartItemService(JSON.stringify(item_list), value, name)
    }

    onNext(){
        this.props.navigation.navigate('CartInfoView', {selectedItems: this.state.selectedItems})
    }

    listEmpty(){
        return(
            <Text style={{padding: 20, width: '100%', textAlign: 'center', fontSize: 13, color: '#777777', fontFamily: Global.FontName}}>Bạn chưa có sản phẩm nào trong giỏ hàng</Text>
        )
    }

    onCheckAll(value){
        if(value){
            let selectedItems = []
            this.props.cartItems.map((item) => {
                selectedItems.push(item.id)
            })
            this.setState({selectedItems: selectedItems})
        } else {
            this.setState({selectedItems: []})
        }
    }

    render() {

        const {cartItems, cartVendors, isFetching} = this.props
        const {selectedItems} = this.state

        let total = 0

        cartItems.map((item) => {
            if(selectedItems.indexOf(item.id) > -1){
                total += Math.round(parseInt(item.total_vnd))
            }
        })

        console.log(cartItems)

        return (
            <View style={styles.container}>
                <Header title='Giỏ hàng'
                    rightIcon='times'
                    rightAction={() => this.props.navigation.goBack()}
                    leftText={selectedItems.length == cartItems.length ? 'Xoá tất cả' : 'Xoá đã chọn'}
                    leftAction={this.deleteSelected.bind(this)}
                />
                <KeyboardAwareFlatList 
                    renderItem={this.renderItem.bind(this)}
                    data={cartVendors ? Object.keys(cartVendors) : []}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{flex : 1}}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={this.listEmpty.bind(this)}
                />

                <View style={{width: '100%', flexDirection: 'row', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: '#CECECE', backgroundColor: 'white'}}>
                    <Checkbox
                            title='Chọn tất cả'
                            size='lg'
                            checked={selectedItems.length == cartItems.length}
                            onChange={this.onCheckAll.bind(this)}
                            checkedIcon={<Icon name='check-square' size={20} color={Global.MainColor}/>}
                            uncheckedIcon={<Icon name='square' size={20} color={'#333333'}/>}
                    />
                    <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>
                        {'Tổng tiền:\n'}
                        <Text style={{color: Global.MainColor, fontWeight: '500'}}>{convertMoney(total) + 'đ'}</Text>
                    </Text>

                    <TouchableOpacity disabled={selectedItems.length == 0} onPress={this.onNext.bind(this)} style={[styles.orderContainer, {backgroundColor: selectedItems.length == 0 ? '#777777' : Global.MainColor}]}>
                        <Text style={styles.orderText}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cartItems: state.cart.items,
        cartVendors: state.cart.vendors,
        isFetching: state.cart.isFetching,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCart: () => {dispatch(getCart())},
        deleteCartItem: (id) => {dispatch(deleteCartItem(id))},
        deleteSelected: (ids) => {dispatch(deleteSelected(ids))},
        updateCartItem: (pk, value, name) => {dispatch(updateCartItem(pk, value, name))},
        updateCartItemService: (item_list, value, name) => {dispatch(updateCartItemService(item_list, value, name))},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartView);
