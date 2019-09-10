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
        fontSize: 14, color: 'white', fontFamily: Global.FontName, marginRight: 8, padding: 5, borderRadius: 5, backgroundColor: '#1B5795'
    },
    statusText: {
        fontSize: 14, color: 'white', fontFamily: Global.FontName, marginRight: 8, padding: 5, borderRadius: 5, backgroundColor: 'gray'
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    itemImage: {
        width: 80, height: 80, margin: 10
    },
    descriptionText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, width: '100%', marginTop: 5
    },
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

        const { first_image_url, id, status_value, username, status_processing, sum_payment_transaction, total_item_cost, need_to_pay, created_tag } = this.props

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
                    <Text style={styles.idText}>{id}</Text>
                    <Text style={[styles.statusText, { backgroundColor: statusColor }]}>{status_processing}</Text>
                </View>
                <View style={styles.contentContainer}>
                    <Image source={{ uri: imageUrl(first_image_url) }} style={styles.itemImage} />
                    <View style={styles.descriptionContainer}>
                        <Text style={[styles.descriptionText,]}>{'Người đặt: '}
                            <Text style={{ color: '#1B5795', fontWeight: '500' }}>{`${username}`}</Text>
                        </Text>
                        <Text style={[styles.descriptionText,]}>{'Tổng số tiền: '}
                            <Text style={{ fontWeight: '500' }}>{`${convertMoney(total_item_cost)} đ`}</Text>
                        </Text>
                        <Text style={[styles.descriptionText,]}>{'Đã đặt cọc: '}
                            <Text style={{ fontWeight: '500' }}>{`${convertMoney(sum_payment_transaction)} đ`}</Text>
                        </Text>
                        <Text style={[styles.descriptionText,]}>{'Cọc thêm: '}
                            <Text style={{ color: Global.MainColor, fontWeight: '500' }}>{`${convertMoney(need_to_pay)} đ`}</Text>
                        </Text>
                        <Text style={[styles.descriptionText,]}>{'Ngày tạo: '}
                            <Text style={{ fontWeight: '500' }}>{`${created_tag}`}</Text>
                        </Text>
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