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
})

import Global, { Media, convertMoney, imageUrl } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { Stepper } from 'teaset'

class OrderDetailItem extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    render() {

        const { vendor, name, id, image_url, price, price_vnd, option_selected_tag,
            short_description, currency, total_vnd, total_service_cost_vnd, quantity,
            shipping_vnd, note } = this.props

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.nameText}>{name}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: imageUrl(image_url) }} style={styles.itemImage} />
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.descriptionText, { color: '#1B5795' }]}>{`${vendor}`}</Text>
                        <Text style={styles.descriptionText}>{`${currency} ${price} / ${convertMoney(price_vnd)} vnđ`}</Text>
                        <Text style={styles.descriptionText}>{`Số lượng: ${quantity}`}</Text>
                        <Text style={styles.descriptionText}>{`${option_selected_tag}`}</Text>
                    </View>
                </View>

                {!!note && note.length > 0 && <Text style={styles.noteText}>{`Ghi chú: ${note}`}</Text>}

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

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailItem);