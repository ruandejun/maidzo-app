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
        width: Global.ScreenWidth - 32, marginLeft: 16,
        backgroundColor: 'white', padding: 16, marginBottom: 20, marginTop: 10, borderRadius: 8, 
        shadowColor: '#333333',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0,
        },
        elevation: 1,
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
import OrderDetailItem from './OrderDetailItem'
import { FlatList } from 'react-native-gesture-handler';

export default class OrderDetailVendor extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            showItem: true
        }
    }

    openItem(url){
        if(this.props.openItem){
            this.props.openItem(url)
        }
    }

    onReport(id){
        if(this.props.onReport){
            this.props.onReport(id)
        }
    }

    onTracking(id){
        if(this.props.onTracking){
            this.props.onTracking(id)
        }
    }

    showHideItem() {
        this.setState({ showItem: !this.state.showItem })
    }

    renderItem({ item, index }) {
        return(
            <OrderDetailItem {...item} openItem={this.openItem.bind(this, item.item_url)}
                onReport={this.onReport.bind(this, item.id)}
                onTracking={this.onTracking.bind(this, item.id)} />
        )
    }

    render() {

        const { vendor, items } = this.props

        let rocket = true
        let rocket_ship = true
        let bargain = true
        let insurance = true
        let packing = true

        items.map((item) => {
            if(!item.rocket) rocket = false
            if(!item.rocket_ship) rocket_ship = false
            if(!item.bargain) bargain = false
            if(!item.insurance) insurance = false
            if(!item.packing) packing = false
        })

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>
                    <Icon name='store' size={18} color={Global.MainColor} style={{marginLeft: 8}}/>
                    <Text style={styles.vendorName}>{vendor ? vendor.vendor : ''}</Text>

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
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />

                            <Checkbox
                                title='Ship hoả tốc'
                                size='md'
                                checked={rocket_ship}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, alignItems: 'center', justifyContent: 'space-between'}}>
                            <Checkbox
                                title='Mặc cả'
                                size='md'
                                checked={bargain}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />

                            <Checkbox
                                title='Bảo hiểm'
                                size='md'
                                checked={insurance}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 8, alignItems: 'center', justifyContent: 'space-between'}}>
                            <Checkbox
                                title='Đóng gỗ'
                                size='md'
                                checked={packing}
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
                        <Text style={styles.priceText}>{vendor ? vendor.sum_quantity : ''}</Text>
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Tổng giá sản phẩm</Text>
                        {vendor && <Text style={[styles.priceText]}>
                                <Text style={{color: '#3578E5'}}>{`${vendor.sum_price}`}</Text>
                                /
                                <Text style={{color: Global.MainColor}}>{`${convertMoney(vendor.sum_price_vnd)} đ`}</Text>
                            </Text>}
                        {!vendor && 
                            <Text style={[styles.priceText, {color: Global.MainColor}]}>{''}</Text>
                        }
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Tổng phí ship nội địa</Text>
                        {vendor && <Text style={[styles.priceText]}>
                                <Text style={{color: '#3578E5'}}>{`${vendor.sum_shipping}`}</Text>
                                /
                                <Text style={{color: Global.MainColor}}>{`${convertMoney(vendor.sum_shipping_vnd)} đ`}</Text>
                            </Text>}
                        {!vendor && 
                            <Text style={[styles.priceText, {color: Global.MainColor}]}>{''}</Text>
                        }
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Tổng phí dịch vụ</Text>
                        {vendor && <Text style={[styles.priceText]}>
                                <Text style={{color: '#3578E5'}}>{`${vendor.sum_service}`}</Text>
                                /
                                <Text style={{color: Global.MainColor}}>{`${convertMoney(vendor.sum_service_vnd)} đ`}</Text>
                            </Text>}
                        {!vendor && 
                            <Text style={[styles.priceText, {color: Global.MainColor}]}>{''}</Text>
                        }
                    </View>
                    <View style={styles.priceContainer}>
                        <Text style={styles.priceText}>Tổng tiền</Text>
                        {vendor && <Text style={[styles.priceText]}>
                                <Text style={{color: '#3578E5'}}>{`${vendor.total}`}</Text>
                                /
                                <Text style={{color: Global.MainColor}}>{`${convertMoney(vendor.total_vnd)} đ`}</Text>
                            </Text>}
                        {!vendor && 
                            <Text style={[styles.priceText, {color: Global.MainColor}]}>{''}</Text>
                        }
                    </View>
                </View>

                {this.state.showItem &&
                    <FlatList
                        data={items}
                        renderItem={this.renderItem.bind(this)}
                    />
                }
            </View>
        )
    }
}