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
        width: '100%',
        backgroundColor: '#f2f2f2', padding: 10, marginTop: 10, borderRadius: 5
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', height: 40,
        borderBottomWidth: 1, borderBottomColor: '#cccccc'
    },
    nameText: {
        fontSize: 14, color: Global.MainColor, fontFamily: Global.FontName, marginTop : 8, width: '100%', textDecorationLine: 'underline'
    },
    idText: {
        fontSize: 14, color: 'blue', fontFamily: Global.FontName, fontWeight: '500'
    },
    deleteText: {
        fontSize: 14, color: 'red', fontFamily: Global.FontName, textDecorationLine: 'underline'
    },
    contentContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start'
    },
    descriptionText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, width: '100%', marginTop : 5
    },
    itemImage: {
        width: 80, height: 80, margin: 10
    },
    descriptionContainer: {
        flex: 1,
    },
    noteText: {
        padding: 8, width: '100%',
        textAlign: 'left', fontSize: 14, color: 'black', fontFamily: Global.FontName, marginBottom : 8
    },
    priceContainer: {
        width: '100%', flexDirection: 'row', height: 30,
        alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#cccccc'
    },
    priceText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName
    },
    statusContainer: {
        padding: 5, borderRadius: 5, backgroundColor: Global.MainColor
    },
    statusText: {
        fontSize: 14, color: Global.MainColor, fontFamily: Global.FontName
    }
})

import Global, { Media, convertMoney, imageUrl } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { Stepper, Checkbox } from 'teaset'
import CustomAlert from 'components/CustomAlert'
import { FlatList } from 'react-native-gesture-handler';
import Share from 'react-native-share'

export default class OrderDetailItem extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    openItem(){
        if(this.props.openItem){
            this.props.openItem()
        }
    }

    openQuantityDetail(){
        const {quantity, sum_arrived_quantity, paid_quantity } = this.props

        CustomAlert(null, `Số lượng đã nhận: ${sum_arrived_quantity}\nTổng số lượng đã đặt: ${quantity}`)
    }

    onReport(){
        if(this.props.onReport){
            this.props.onReport()
        }
    }

    onTracking(){
        if(this.props.onTracking){
            this.props.onTracking()
        }
    }

    onShare(){
        const {item_url} = this.props
        Share.open({url: item_url.replace('#modal=sku', '')})
        .then((res) => { })
        .catch((err) => { err && console.log(err); });
    }

    render() {

        const { name, id, image_url, price, price_vnd, option_selected_tag,
            status, currency, total_vnd, total_service_cost_vnd, quantity, shipping, total_service_cost, total,
            shipping_vnd, note, sum_arrived_quantity, rocket, packing, insurance, bargain, rocket_ship, count_shipmentpackage } = this.props

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.statusText}>{status}</Text>
                </View>
                <Text onPress={this.openItem.bind(this)} style={styles.nameText}>{name}</Text>
                <View style={styles.contentContainer}>
                    <View style={{alignItems: 'center'}}>
                        <Image source={{ uri: imageUrl(image_url) }} style={styles.itemImage} />
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>{`${currency} ${price}|${convertMoney(price_vnd)} vnđ`}</Text>
                        <Text onPress={this.openQuantityDetail.bind(this)} style={styles.descriptionText}>{`Số lượng: ${sum_arrived_quantity}|${quantity} `}
                            <Text style={{color: Global.MainColor}}>?</Text>
                        </Text>
                        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text onPress={this.openItem.bind(this)} style={[styles.descriptionText]} numberOfLines={1}>{'Link: '}
                                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{'Mở sản phẩm'}</Text>
                            </Text>
                        </View> */}
                        <Text style={styles.descriptionText}>{`${option_selected_tag}`}</Text>
                    </View>
                </View>

                {!!note && note.length > 0 && <Text style={styles.noteText}>{`Ghi chú: ${note}`}</Text>}

                {(rocket || packing || insurance || bargain || rocket_ship) && false &&
                    <View style={{marginTop : 8, marginBottom : 8, borderRadius: 5, backgroundColor: '#f6f6f6', padding: 5}}>
                        <FlatList 
                            data={[
                                {id: '1', value: rocket, title: 'Mua hoả tốc'},
                                {id: '2', value: rocket_ship, title: 'Ship hoả tốc'},
                                {id: '3', value: bargain, title: 'Mặc cả'},
                                {id: '4', value: insurance, title: 'Bảo hiểm'},
                                {id: '5', value: packing, title: 'Đóng gỗ'}
                            ]}
                            numColumns={2}
                            style={{flex: 1}}
                            renderItem={({item, index}) => {
                                return (
                                    <Checkbox
                                        title={item.title}
                                        size='md'
                                        checked={item.value}
                                        checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                        uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                                        style={{width: Global.ScreenWidth * 0.5 - 20}}
                                    />
                                )
                            }}
                        />
                    </View>
                }

                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Thành tiền</Text>
                    <Text style={styles.priceText}>
                        <Text style={{color: '#3578E5'}}>{convertMoney(parseInt(price) * quantity)}</Text>
                        |
                        <Text style={{color: Global.MainColor}}>{convertMoney(parseInt(price_vnd) * quantity) + 'đ'}</Text>
                    </Text>
                
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí ship nội địa</Text>
                    <Text style={styles.priceText}>
                        <Text style={{color: '#3578E5'}}>{convertMoney(shipping)}</Text>
                        |
                        <Text style={{color: Global.MainColor}}>{convertMoney(shipping_vnd) + 'đ'}</Text>
                    </Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí dịch vụ</Text>
                    <Text style={styles.priceText}>
                        <Text style={{color: '#3578E5'}}>{convertMoney(total_service_cost)}</Text>
                        |
                        <Text style={{color: Global.MainColor}}>{convertMoney(total_service_cost_vnd) + 'đ'}</Text>
                    </Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Tổng</Text>
                    <Text style={styles.priceText}>
                        <Text style={{color: '#3578E5'}}>{convertMoney(total)}</Text>
                        |
                        <Text style={{color: Global.MainColor}}>{convertMoney(Math.round(total_vnd)) + 'đ'}</Text>
                    </Text>
                </View>
                
                <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
                    {count_shipmentpackage > 0 &&
                        <TouchableOpacity onPress={this.onTracking.bind(this)} style={{width: 100, height: 35, margin: 10, backgroundColor: 'blue', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Kiện hàng</Text>
                        </TouchableOpacity>
                    }

                    <TouchableOpacity onPress={this.onReport.bind(this)} style={{width: 100, height: 35, margin: 10, backgroundColor: 'red', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName}}>Khiếu nại</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onShare.bind(this)} style={{width: 80, flexDirection: 'row', height: 35, margin: 10, borderWidth: 1, borderColor: '#aaaaaa', borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{fontSize: 14, color: '#aaaaaa', fontFamily: Global.FontName, marginRight: 5}}>Share</Text>
                        <Icon name='share' size={16} color='#aaaaaa'/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}