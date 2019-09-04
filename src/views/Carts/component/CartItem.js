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
        backgroundColor: 'white', padding: 16, marginBottom: 20, marginTop: 10
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
        fontSize: 14, color: 'black', fontFamily: Global.FontName, width: '100%', marginTop : 5
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
        textAlignVertical: 'top', marginBottom : 8
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
import { Stepper } from 'teaset'

class CartItem extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            note: props.note ? props.note : '',
        }
    }

    onDelete(){
        CustomAlert('Chắc chắn xoá sản phẩm khỏi giỏ hàng?', null, [
            {text: 'Xoá', onPress: () => {
                if(this.props.onDelete){
                    this.props.onDelete()
                }
            }},
            {text: 'Quay lại'}
        ])
    }


    updateTimeout = null

    onUpdateQuantity(value){
        if(this.updateTimeout){
            clearTimeout(this.updateTimeout)
            this.updateTimeout = null
        }

        this.updateTimeout = setTimeout(() => {
            if(this.props.onUpdateQuantity){
                this.props.onUpdateQuantity(value)
            }
        }, 1000);
    }

    onUpdateNote(){
        if(this.props.onUpdateNote){
            this.props.onUpdateNote(this.state.note)
        }
    }

    render() {

        const { vendor, name, id, image_url, price, price_vnd, option_selected_tag,
            short_description, currency, total_vnd, total_service_cost_vnd, quantity,
            shipping_vnd } = this.props
        const { note } = this.state

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.nameText}>{name}</Text>
                    <Text onPress={this.onDelete.bind(this)} style={styles.deleteText}>Xoá</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: imageUrl(image_url) }} style={styles.itemImage} />
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.descriptionText, { color: '#1B5795' }]}>{`${vendor}`}</Text>
                        <Text style={styles.descriptionText}>{`${currency} ${price} / ${convertMoney(price_vnd)} vnđ`}</Text>
                        <Stepper
                            value={quantity}
                            min={1}
                            step={1}
                            style={{ borderWidth: 0, marginTop: 8 }}
                            onChange={this.onUpdateQuantity.bind(this)}
                            valueStyle={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}
                            subButton={
                                <View style={{ backgroundColor: '#rgba(238, 169, 91, 0.1)', borderColor: '#8a6d3b', borderWidth: 1, borderRadius: 4, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}>－</Text>
                                </View>
                            }
                            addButton={
                                <View style={{ backgroundColor: '#rgba(238, 169, 91, 0.1)', borderColor: '#8a6d3b', borderWidth: 1, borderRadius: 4, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}>＋</Text>
                                </View>
                            }
                            showSeparator={false}
                        />
                        <Text style={styles.descriptionText}>{`${option_selected_tag}`}</Text>
                    </View>
                </View>

                <TextInput
                    value={note}
                    style={styles.noteText}
                    underlineColorAndroid='#00000000'
                    placeholder='Ghi chú'
                    placeholderTextColor='#aaaaaa'
                    multiline
                    onChangeText={(text) => this.setState({note: text})}
                    onEndEditing={this.onUpdateNote.bind(this)}
                />

                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Thành tiền</Text>
                    <Text style={styles.priceText}>{convertMoney(parseInt(price_vnd) * quantity) + 'đ'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí ship nội địa</Text>
                    <Text style={styles.priceText}>{convertMoney(shipping_vnd) + 'đ'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Phí dịch vụ</Text>
                    <Text style={styles.priceText}>{convertMoney(total_service_cost_vnd) + 'đ'}</Text>
                </View>
                <View style={styles.priceContainer}>
                    <Text style={styles.priceText}>Tổng</Text>
                    <Text style={styles.priceText}>{convertMoney(total_vnd) + 'đ'}</Text>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {

    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartItem);