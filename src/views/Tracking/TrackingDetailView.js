import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    Linking,
    AppState,
    TouchableOpacity,
    Clipboard,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    infoText: {
        fontSize: 13, color: '#333333', marginTop: 5, width: '100%',
        fontFamily: Global.FontName,
    }
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import TrackingItem from './component/TrackingItem'
import { fetchApi } from 'actions/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {Toast} from 'teaset'

class TrackingDetailView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            items: [],
            package_info: null,
            arrived_info: null,
            isFetching: false
        }
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefresh() {
        const tracking_id = this.props.navigation.getParam('tracking_id')

        // console.log(tracking_id)

        if (!tracking_id) {
            return
        }

        this.setState({ isFetching: true }, () => {
            fetchApi('get', `page/get_tracking_details/${tracking_id}`)
                .then((data) => {
                    // console.log(data)

                    this.setState({ isFetching: false, items: data.list_item, package_info: data.shipmentpackage, arrived_info: data.total_arrived_item })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ isFetching: false })
                })
        })
    }

    renderItem({ item, index }) {
        return (
            <TrackingItem {...item} openItem={this.openItem.bind(this, item.item_url)} />
        )
    }

    openItem(link) {
        this.props.navigation.navigate('TaobaoWebView', { url: link.replace('#modal=sku', '') })
    }

    renderHeader() {
        const { package_info, arrived_info } = this.state

        if (!!package_info && !!arrived_info) {
            return (
                <View style={{ width: '100%', backgroundColor: 'white', marginTop: 10, marginBottom: 10, padding: 16 }}>
                    <Text style={styles.infoText}>{`Tổng số lượng: `}
                        <Text style={{ color: 'black', fontSize: 14 }}>{arrived_info.count}</Text>
                    </Text>
                    <Text style={styles.infoText}>{`Đã nhận: `}
                        <Text style={{ color: 'black', fontSize: 14 }}>{arrived_info.sum_arrived_quantity}</Text>
                    </Text>
                    <Text style={styles.infoText}>{`Phí nhận: `}
                        <Text style={{ color: 'black', fontSize: 14 }}>{convertMoney(arrived_info.sum_shipping_cost_vnd) + ' đ'}</Text>
                    </Text>

                    <View style={{width: '100%', height: StyleSheet.hairlineWidth, backgroundColor: '#aaaaaa', marginTop: 10, marginBottom: 5}}/>

                    <TouchableOpacity onPress={() => {Clipboard.setString(`${package_info.tracking_number}`); Toast.message('Đã copy')}} style={{flexDirection: 'row', marginTop: 5, width: '100%'}}>
                        <Text style={{fontSize: 13, color: '#333333', flex: 1, fontFamily: Global.FontName}}>{`Mã vận chuyển: `}
                            <Text style={{ color: 'black', fontSize: 14 }}>{package_info.tracking_number}</Text>
                        </Text>
                        <Icon name='copy' style={{width: 30}} size={20} color='#CECECE'/>
                    </TouchableOpacity>
                    <Text style={styles.infoText}>{`Trạng thái: `}
                        <Text style={{ color: 'black', fontSize: 14 }}>{package_info.status}</Text>
                    </Text>
                </View>
            )
        } else {
            return null
        }
    }

    render() {

        const { isFetching, items } = this.state
        const tracking_id = this.props.navigation.getParam('tracking_id')

        return (
            <View style={styles.container}>
                <Header
                    title={'Chi tiết vận đơn - ' + tracking_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <FlatList
                    renderItem={this.renderItem.bind(this)}
                    data={items}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={this.renderHeader.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFetching: state.order.detailFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TrackingDetailView);
