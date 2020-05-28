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
        width: Global.ScreenWidth - 16,
        backgroundColor: 'white', padding: 16, margin: 8, borderRadius: 5
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    nameText: {
        fontSize: 14, color: Global.MainColor, fontFamily: Global.FontName, flex: 1, marginRight: 10
    },
    idText: {
        fontSize: 17, color: Global.MainColor, fontFamily: Global.FontName, fontWeight: 'bold', marginTop: 10
    },
    statusText: {
        fontSize: 15, color: 'white', fontFamily: Global.FontName, marginTop: 10, padding: 5, backgroundColor: 'gray'
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemImage: {
        width: 50, height: 50, marginRight: 10, backgroundColor: '#aaaaaa77'
    },
    descriptionText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName
    },
    separator: {
        position: 'absolute', top: 0, left: 0, right: 0, height: StyleSheet.hairlineWidth, backgroundColor: '#aaaaaa77'
    },
    descriptionContainer: {
        marginTop: 5, padding: 5
    },
    textContainer: {
        width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 3
    }
})

import Global, { imageUrl, convertMoney } from 'src/Global'
import { ActionSheet } from 'teaset'
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { connect } from 'react-redux'
import FastImage from 'react-native-fast-image'
import { Stepper } from 'teaset'

class OrderListItem extends React.PureComponent {

    constructor(props) {
        super(props);
    }

    onPress() {
        if (this.props.onPress) {
            this.props.onPress(0)
        }
    }

    render() {

        const { first_image_url, payment_left, id, status_value, username, status_processing, sum_payment_transaction, total_item_cost, need_to_pay, created_tag } = this.props

        let statusColor = '#777777'
        switch (status_value.toLowerCase()) {
            case 'prepaid':
                statusColor = '#f0ad4e'
                break;
            case 'checked':
                statusColor = '#5cb85c'
                break;
            case 'ordered':
                statusColor = '#5bc0de'
                break;
        }

        return (
            <TouchableOpacity onPress={this.onPress.bind(this)} style={styles.container} >
                <View style={styles.headerContainer}>
                    <Image source={{ uri: imageUrl(first_image_url) }} style={styles.itemImage} />
                    <Text style={styles.idText}>{id}</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={[styles.statusText, { backgroundColor: statusColor }]}>{status_processing}</Text>
                </View>
                <View style={styles.descriptionContainer}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.descriptionText,]}>{'Người đặt: '}</Text>
                        <Text style={[styles.descriptionText, { color: '#1B5795', fontWeight: '500' }]}>{`${username}`}</Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[styles.descriptionText,]}>{'Tổng số tiền: '}</Text>
                        <Text style={[styles.descriptionText, { fontWeight: '500' }]}>{`${convertMoney(Math.round(total_item_cost))} đ`}</Text>
                    </View>

                    <View style={styles.textContainer}>
                        <Text style={[styles.descriptionText,]}>{'Ngày đặt: '}</Text>
                        <Text style={[styles.descriptionText, { fontWeight: '500' }]}>{`${created_tag}`}</Text>
                    </View>

                </View>
                <View style={styles.descriptionContainer}>
                    <View style={styles.separator} />
                    <View style={styles.textContainer}>
                        <Text style={[styles.descriptionText,]}>{'Đã đặt cọc'}</Text>
                        <Text style={[styles.descriptionText, { fontWeight: '500', color: 'green' }]}>{`${convertMoney(Math.round(sum_payment_transaction))} đ`}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.descriptionText,]}>{'Còn thiếu'}</Text>
                        <Text style={[styles.descriptionText, { color: 'red', fontWeight: '500' }]}>{`${convertMoney(Math.round(payment_left))} đ`}</Text>
                    </View>

                </View>
            </TouchableOpacity>
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

export default connect(mapStateToProps, mapDispatchToProps)(OrderListItem);