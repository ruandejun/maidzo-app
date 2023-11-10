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
        fontSize: 14, color: Global.MainColor, fontFamily: Global.FontName, flex: 1, marginRight: 10
    },
    idText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, marginRight: 8
    },
    deleteText: {
        fontSize: 14, color: 'red', fontFamily: Global.FontName, textDecorationLine: 'underline'
    },
    contentContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
    },
    descriptionText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, width: '100%', marginTop: 5
    },
    itemImage: {
        width: 80, height: 80, margin: 10
    },
    descriptionContainer: {
        flex: 1,
    },
    noteText: {
        padding: 8, width: '100%', height: 60,
        textAlign: 'left', fontSize: 14, color: '#333333', fontFamily: Global.FontName,
        borderWidth: 1, borderRadius: 5, borderColor: '#CCCCCC',
        textAlignVertical: 'top', marginBottom: 8
    },
    priceContainer: {
        width: '100%', flexDirection: 'row', height: 30,
        alignItems: 'center', justifyContent: 'space-between', borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#cccccc'
    },
    priceText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName
    },
})

import Global, { imageUrl, convertMoney } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { Stepper, Checkbox } from 'teaset'
import TranslateText from '../../../components/TranslateText';

export default class CartItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            note: props.note ? props.note : '',
            quantity: props.quantity,
            isFull: false
        }
    }

    onDelete() {
        CustomAlert('Chắc chắn xoá sản phẩm khỏi giỏ hàng?', null, [
            {
                text: 'Xoá', onPress: () => {
                    if (this.props.onDelete) {
                        this.props.onDelete()
                    }
                }
            },
            { text: 'Quay lại' }
        ])
    }

    updateTimeout = null

    onUpdateQuantity(value) {
        this.setState({ quantity: value })

        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout)
            this.updateTimeout = null
        }

        this.updateTimeout = setTimeout(() => {
            if (this.props.onUpdateQuantity) {
                this.props.onUpdateQuantity(value)
            }
        }, 3000);
    }

    onUpdateNote() {
        if (this.props.onUpdateNote) {
            this.props.onUpdateNote(this.state.note)
        }
    }

    onUpdateService(value, name) {
        if (this.props.onUpdateService) {
            this.props.onUpdateService({ value, name })
        }
    }

    onSelected(value) {
        if (this.props.onSelected) {
            this.props.onSelected(value)
        }
    }

    openItem() {
        if (this.props.openItem) {
            this.props.openItem()
        }
    }

    render() {

        const { vendor, name, id, image_url, price, price_vnd, option_selected_tag,
            rocket, currency, total_vnd, total_service_cost_vnd, quantity, shipping, total_service_cost, total,
            shipping_vnd, rocket_ship, insurance, bargain, packing, is_selected, disable_selected } = this.props
        const { note, isFull } = this.state

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>

                    {!disable_selected &&
                        <Checkbox
                            size='lg'
                            checked={is_selected}
                            onChange={this.onSelected.bind(this)}
                            checkedIcon={<Icon name='check-square' size={20} color={Global.MainColor} />}
                            uncheckedIcon={<Icon name='square' size={20} color={'#333333'} />}
                        />
                    }
                    <Text style={[styles.idText, { marginLeft: 8, flex: 1, }]}>{id}</Text>

                    <TouchableOpacity onPress={this.onDelete.bind(this)} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name='trash' size={15} color='red' />
                    </TouchableOpacity>

                    <Stepper
                        value={this.state.quantity}
                        min={1}
                        step={1}
                        style={{ borderWidth: 0, marginLeft: 8, marginRight: 16 }}
                        onChange={this.onUpdateQuantity.bind(this)}
                        valueStyle={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}
                        subButton={
                            <View style={{ borderRadius: 4, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: '#8a6d3b', fontFamily: Global.FontName }}>－</Text>
                            </View>
                        }
                        addButton={
                            <View style={{ borderRadius: 4, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 18, color: '#8a6d3b', fontFamily: Global.FontName }}>＋</Text>
                            </View>
                        }
                        showSeparator={false}
                    />
                </View>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: imageUrl(image_url) }} style={styles.itemImage} />
                    <View style={styles.descriptionContainer}>
                        <TranslateText onPress={this.openItem.bind(this)} style={styles.nameText} text={name} />
                        <Text style={styles.descriptionText}>{`${currency} ${price} / ${convertMoney(price_vnd)} vnđ`}</Text>
                        {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <Text onPress={this.openItem.bind(this)} style={[styles.descriptionText]} numberOfLines={1}>{'Link: '}
                                <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{'Mở sản phẩm'}</Text>
                            </Text>
                        </View> */}
                        <TranslateText style={styles.descriptionText} text={`${option_selected_tag}`}/>
                    </View>
                </View>

                <TextInput
                    value={note}
                    style={styles.noteText}
                    underlineColorAndroid='#00000000'
                    placeholder='Ghi chú'
                    placeholderTextColor='#aaaaaa'
                    multiline
                    onChangeText={(text) => this.setState({ note: text })}
                    onEndEditing={this.onUpdateNote.bind(this)}
                />

                {isFull && <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Thành tiền</Text>
                    <Text style={styles.priceText}>
                        <Text style={{ color: '#3578E5' }}>{convertMoney(parseInt(price) * quantity)}</Text>
                        |
                        <Text style={{ color: Global.MainColor }}>{convertMoney(parseInt(price_vnd) * quantity) + 'đ'}</Text>
                    </Text>
                </View>
                }
                {isFull && <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí ship nội địa</Text>
                    <Text style={styles.priceText}>
                        <Text style={{ color: '#3578E5' }}>{convertMoney(shipping)}</Text>
                        |
                        <Text style={{ color: Global.MainColor }}>{convertMoney(shipping_vnd) + 'đ'}</Text>
                    </Text>
                </View>}
                {isFull && <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí dịch vụ</Text>
                    <Text style={styles.priceText}>
                        <Text style={{ color: '#3578E5' }}>{convertMoney(total_service_cost)}</Text>
                        |
                        <Text style={{ color: Global.MainColor }}>{convertMoney(total_service_cost_vnd) + 'đ'}</Text>
                    </Text>
                </View>}
                <View style={styles.priceContainer}>
                    <Text style={[styles.priceText, {flex: 1,}]}>Tổng</Text>

                    <TouchableOpacity onPress={() => this.setState({ isFull: !isFull })} style={{ paddingHorizontal: 5, height: 30, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{fontSize: 11, color: 'blue', textDecorationLine: 'underline'}}>{isFull ? 'Rút gọn' : 'Chi tiết'}</Text>
                    </TouchableOpacity>
                    <Text style={[styles.priceText, { textAlign: 'right', paddingHorizontal: 8}]}>
                        <Text style={{ color: '#3578E5' }}>{convertMoney(total)}</Text>
                        |
                        <Text style={{ color: Global.MainColor }}>{convertMoney(Math.round(total_vnd)) + 'đ'}</Text>
                    </Text>
                </View>
            </View>
        )
    }
}