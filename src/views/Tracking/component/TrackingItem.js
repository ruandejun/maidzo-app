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
import { Stepper, Checkbox} from 'teaset'
import CustomAlert from 'components/CustomAlert'

class TrackingItem extends React.PureComponent {

    constructor(props) {
        super(props);

    }

    openItem(){
        if(this.props.openItem){
            this.props.openItem()
        }
    }

    openQuantityDetail(){
        const {quantity, sum_arrived_quantity, paid_quantity, } = this.props

        CustomAlert(null, `Số lượng đã nhận: ${sum_arrived_quantity}\nTổng số lượng đã đặt: ${quantity}`)
    }

    render() {

        const { vendor, name, id, image_url, price, price_vnd, option_selected_tag,
            status, currency, total_vnd, item_status, quantity,
            shipping_vnd, note, sum_arrived_quantity, order, rocket, rocket_ship, packing, bargain, insurance } = this.props

        return (
            <View style={styles.container} >
                <View style={styles.headerContainer}>
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={styles.statusText}>{item_status}</Text>
                </View>
                <Text onPress={this.openItem.bind(this)} style={styles.nameText}>{name}</Text>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: imageUrl(image_url) }} style={styles.itemImage} />
                    <View style={styles.descriptionContainer}>
                        <Text onPress={this.openItem.bind(this)} style={[styles.descriptionText]} numberOfLines={1}>{'Đơn hàng: ' + order}</Text>
                        <Text onPress={this.openQuantityDetail.bind(this)} style={styles.descriptionText}>{`Số lượng: ${sum_arrived_quantity}/${quantity} `}
                            <Text style={{color: Global.MainColor}}>?</Text>
                        </Text>
                        {/* <Text onPress={this.openItem.bind(this)} style={[styles.descriptionText]} numberOfLines={1}>{'Link: '}
                            <Text style={{color: 'blue', textDecorationLine: 'underline'}}>{'Mở sản phẩm'}</Text>
                        </Text> */}
                        <Text style={styles.descriptionText}>{`${option_selected_tag}`}</Text>
                    </View>
                </View>

                {!!note && note.length > 0 && <Text style={styles.noteText}>{`Ghi chú: ${note}`}</Text>}

                {(rocket || packing || insurance || bargain || rocket_ship) &&
                    <View style={{marginTop : 8, marginBottom : 8, borderRadius: 5, backgroundColor: '#f6f6f6', padding: 5}}>
                            {rocket && <Checkbox
                                title='Mua hoả tốc'
                                size='md'
                                checked={rocket}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />}

                            {rocket_ship && <Checkbox
                                title='Ship hoả tốc'
                                size='md'
                                checked={rocket_ship}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />}
                            {bargain && <Checkbox
                                title='Mặc cả'
                                size='md'
                                checked={bargain}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />}

                            {insurance && <Checkbox
                                title='Bảo hiểm'
                                size='md'
                                checked={insurance}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />}
                            {packing && <Checkbox
                                title='Đóng gỗ'
                                size='md'
                                checked={packing}
                                checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                            />}
                    </View>
                }
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

export default connect(mapStateToProps, mapDispatchToProps)(TrackingItem);