import React from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    Linking,
    Image,
    TextInput
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        width: Global.ScreenWidth,
        backgroundColor: 'white', padding: 16, marginBottom: 20, marginTop: 10, 
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', height: 40,
        borderBottomWidth: 1, borderBottomColor: '#cccccc'
    },
    vendorName: {
        fontSize: 16, color: '#333333', fontFamily: Global.FontName, flex: 1, marginLeft: 8, marginRight: 8
    },
    priceContainer: {
        width: '100%', flexDirection: 'row', height: 35,
        alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#cccccc'
    },
    priceText: {
        fontSize: 16, color: 'black', fontFamily: Global.FontName,
    },
})

import Global, { imageUrl, convertMoney } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { Stepper, Checkbox } from 'teaset'
import CartItem from './CartItem'
import { FlatList } from 'react-native-gesture-handler';

export default class VendorItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            showItem: true
        }
    }

    onUpdateService(item_list, value, name) {
        if (this.props.onUpdateService) {
            this.props.onUpdateService({ item_list, value, name })
        }
    }

    onUpdateShopService(value, name){
        if (this.props.onUpdateService) {
            const { items } = this.props
            const item_list = items.map((item) => item.id)
            this.props.onUpdateService({ item_list, value, name })
        }
    }

    onSelected(item_list) {
        if (this.props.onSelected) {
            this.props.onSelected(item_list)
        }
    }

    onShopSelected() {
        if (this.props.onSelected) {
            const { items } = this.props
            const item_list = items.map((item) => item.id)
            this.props.onSelected(item_list)
        }
    }

    showHideItem() {
        this.setState({ showItem: !this.state.showItem })
    }

    onDelete(item_id){
        if(this.props.onDelete){
            this.props.onDelete([item_id])
        }
    }

    onDeleteShop(){
        if (this.props.onDelete) {
            const { items } = this.props
            const item_list = items.map((item) => item.id)
            this.props.onDelete(item_list)
        }
    }

    onUpdateItem(pk, value, name){
        if(this.props.onUpdateItem){
            this.props.onUpdateItem({pk, value, name})
        }
    }

    openItem(url){
        if(this.props.openItem){
            this.props.openItem(url)
        }
    }

    renderItem({ item, index }) {
        const is_selected = this.props.selectedItems && this.props.selectedItems.indexOf(item.id) > -1
        
        return(
            <CartItem {...item}
                onDelete={this.onDelete.bind(this, item.id)}
                onUpdateQuantity={(quantity) => this.onUpdateItem(item.id, quantity, 'quantity')}
                onUpdateNote={(text) => this.onUpdateItem(item.id, text, 'note')}
                onUpdateService={({ value, name }) => this.onUpdateService([item.id], value, name)}
                is_selected={is_selected}
                onSelected={(selected) => this.onSelected([item.id], selected)}
                openItem={this.openItem.bind(this, item.detail_url)}
            />
        )
    }

    render() {

        const { vendor, items, disable_selected, selectedItems } = this.props

        let rocket = true
        let rocket_ship = true
        let bargain = true
        let insurance = true
        let packing = true
        let is_selected = true
        let quantity = 0
        let total_vnd = 0
        let total = 0

        items.map((item) => {
            quantity += parseInt(item.quantity)
            total_vnd += parseFloat(item.total_vnd)
            total += parseFloat(item.total)
            if(!item.rocket) rocket = false
            if(!item.rocket_ship) rocket_ship = false
            if(!item.bargain) bargain = false
            if(!item.insurance) insurance = false
            if(!item.packing) packing = false
            
            if(selectedItems.indexOf(item.id) == -1){
                is_selected = false
            }
        })

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>
                    {!disable_selected &&
                            <Checkbox
                                size='lg'
                                checked={is_selected}
                                onChange={this.onShopSelected.bind(this)}
                                checkedIcon={<Icon name='check-square' size={20} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={20} color={'#333333'}/>}
                            />
                        }

                    <Icon name='store' size={18} color={Global.MainColor} style={{marginLeft: 8}}/>
                    <Text style={styles.vendorName}>{vendor}</Text>

                    <TouchableOpacity onPress={this.showHideItem.bind(this)} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={this.state.showItem ? 'angle-up' : 'angle-down'} size={20} />
                    </TouchableOpacity>
                </View>

                <View>
                    <View style={{marginTop : 8, marginBottom : 8, borderRadius: 5, backgroundColor: '#f6f6f6', padding: 5}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Checkbox
                                title='Mua hoả tốc'
                                size='md'
                                checked={rocket}
                                onChange={value => this.onUpdateShopService(value, 'rocket')}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />

                            <Checkbox
                                title='Ship hoả tốc'
                                size='md'
                                checked={rocket_ship}
                                onChange={value => this.onUpdateShopService(value, 'rocket_ship')}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, alignItems: 'center', justifyContent: 'space-between'}}>
                            <Checkbox
                                title='Mặc cả'
                                size='md'
                                checked={bargain}
                                onChange={value => this.onUpdateShopService(value, 'bargain')}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />

                            <Checkbox
                                title='Bảo hiểm'
                                size='md'
                                checked={insurance}
                                onChange={value => this.onUpdateShopService(value, 'insurance')}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, alignItems: 'center', justifyContent: 'space-between'}}>
                            <Checkbox
                                title='Đóng gỗ'
                                size='md'
                                checked={packing}
                                onChange={value => this.onUpdateShopService(value, 'packing')}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />

                            <Checkbox
                                title='Phí mua hàng*'
                                size='md'
                                checked={true}
                                checkedIcon={<Icon name='check-square' size={14} color={'#777777'}/>}
                            />
                        </View>
                    </View>

                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Tổng số lượng</Text>
                        <Text style={styles.priceText}>{quantity}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Tổng tiền</Text>
                        <Text style={[styles.priceText, ]}>
                            <Text style={{color: '#3578E5'}}>{total}</Text>
                            |
                            <Text style={{color: Global.MainColor}}>{convertMoney(total_vnd) + ' đ'}</Text>
                        </Text>
                    </View>
                </View>

                {this.state.showItem &&
                    <FlatList
                        data={items}
                        renderItem={this.renderItem.bind(this)}
                    />
                }

                <TouchableOpacity onPress={this.onDeleteShop.bind(this)} style={{marginTop: 10, flexDirection: 'row', height: 30, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name='trash' size={15} color='red'/>
                    <Text style={{fontSize: 14, color: 'red', fontFamily: Global.FontName, marginLeft: 5}}>Xoá Shop</Text>
                </TouchableOpacity>
            </View>
        )
    }
}