import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    AppState,
    TouchableOpacity,
    Linking,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0'
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import { fetchApi } from 'actions/api'
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet';
import Icon from 'react-native-vector-icons/FontAwesome5'
import OrderDetailVendor from './component/OrderDetailVendor';

const groupBy = (array, key) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

const LIMIT = 10

class OrderDetailItems extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            items: [],
            isFetching: false,
            loadingMore: false,
            canLoadMore: true,
            options: [],
            vendors: null,
            filter: {title: 'Tất cả sản phẩm', value: ''}
        }
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefresh() {
        const { order_id } = this.props

        if (!order_id) {
            return
        }

        let body = { offset: 0, limit: LIMIT }
        if(this.state.filter){
            body.status_value = this.state.filter.value
        }

        

        this.setState({ isFetching: true, loadingMore: false, canLoadMore: true }, () => {
            fetchApi('get', `page/order/${order_id}/get_items_by_offer/`, body)
                .then((data) => {
                    // console.log(data)

                    this.setState({ isFetching: false, items: data, canLoadMore: data.length == LIMIT })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ isFetching: false, canLoadMore: false })
                })
        })

        fetchApi('get', `page/order/${order_id}/get_vendor_information/`)
            .then((data) => {
                // console.log(data)
                this.setState({ vendors: data })
            })
            .catch((error) => {
                console.log(error)
            })

        fetchApi('get', `page/order/${order_id}/get_group_status/`)
            .then((data) => {
                // console.log(data)
                let options = []
                Object.keys(data).map((item) => {
                    options.push({value: item, title: data[item]})
                })
                this.setState({ options: options })
            })
            .catch((error) => {
                console.log(error)
            })
    }

    onEndReached() {
        const { order_id } = this.props

        if (!order_id) {
            return
        }

        if (this.state.isFetching || !this.state.canLoadMore || this.state.loadingMore) {
            return
        }

        let body = { offset: this.state.items.length, limit: this.state.items.length + LIMIT }
        if(this.state.filter){
            body.status_value = this.state.filter.value
        }

        this.setState({ loadingMore: true }, () => {
            fetchApi('get', `page/order/${order_id}/get_items_by_offer/`, body)
                .then((data) => {
                    // console.log(data)
                    let items = this.state.items
                    data.map((item) => {
                        items.push(item)
                    })

                    this.setState({ loadingMore: false, items: items, canLoadMore: data.length == LIMIT })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ loadingMore: false })
                })
        })
    }

    renderItem({ item, index }) {
        return (
            <OrderDetailVendor {...item} openItem={this.openItem.bind(this)}
                onReport={this.onReport.bind(this)}
                onTracking={this.onTracking.bind(this)} />
        )
    }

    onReport(item_id) {
        const { order_id } = this.props
        this.props.navigation.navigate('SubmitReportView', { item_id: item_id, order_number: order_id })
    }

    onTracking(item_id) {
        this.props.navigation.navigate('ItemTrackingView', { item_id: item_id })
    }

    openItem(link) {
        this.props.navigation.push('ProductDetailView', { product: {click_url: link.replace('#modal=sku', '')} })
        // this.props.navigation.navigate('TaobaoWebView', { url: link.replace('#modal=sku', '') })
    }

    renderFooter() {
        if (!this.state.loadingMore) {
            return null
        }

        return (
            <View style={{ width: '100%', height: 30, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={Media.LoadingIcon} style={{ width: 30, height: 30 }} resizeMode='contain' />
            </View>
        )
    }

    onSelectFilter(){
        let items = [{title: 'Tất cả sản phẩm', onPress: () => this.setState({filter: {title: 'Tất cả sản phẩm', value: ''}}, this.onRefresh.bind(this))}]
        
        this.state.options.map((item) => {
            items.push({title: item.title, onPress: () => this.setState({filter: item}, this.onRefresh.bind(this))})
        })

        ActionSheet.show(items, {title: 'Bỏ'})
    }

    render() {

        const { isFetching, vendors, filter, items } = this.state

        let results = []
        try {
            const groupVendor = groupBy(items, 'vendor')
            Object.keys(groupVendor).map((item) => {
                results.push({vendor: vendors[item], items: groupVendor[item]})
            })
        } catch (error) {
            console.log(error)
        }
        return (
            <View style={styles.container}>
                {this.state.options.length > 1 &&
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center', paddingBottom: 10, paddingTop: 10, borderBottomWidth: 1, borderBottomColor: '#CECECE', backgroundColor: '#e1e1e1' }}>
                        <TouchableOpacity onPress={this.onSelectFilter.bind(this)} style={{ marginRight: 8, borderWidth: 1, borderColor: '#CECECE', backgroundColor: 'white', padding: 8, width: '90%', flexDirection: 'row' }}>
                            <Text style={{ fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginRight: 8, flex: 1 }}>{filter.title}</Text>
                            <Icon name='chevron-down' color='#aaaaaa' size={14} />
                        </TouchableOpacity>
                    </View>
                }

                <FlatList
                    renderItem={this.renderItem.bind(this)}
                    data={results}
                    refreshing={isFetching}
                    onRefresh={this.onRefresh.bind(this)}
                    style={{ flex: 1 }}
                    showsVerticalScrollIndicator={false}
                    onEndReached={this.onEndReached.bind(this)}
                    ListFooterComponent={this.renderFooter.bind(this)}
                />
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        isFetching: state.order.detailFetching,
        orderDetail: state.order.detail,
        detailItems: state.order.detailItems,
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(OrderDetailItems);
