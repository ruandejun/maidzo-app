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
    TouchableWithoutFeedback,
    FlatList,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import OrderTrackingItem from 'Orders/component/OrderTrackingItem'
import { fetchApi } from 'actions/api'

const LIMIT = 10

class ItemTrackingView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            items: [],
            isFetching: false,
            loadingMore: false,
            canLoadMore: true
        }
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefresh() {
        const { item_id } = this.props.route.params

        if (!item_id) {
            return
        }

        this.setState({ isFetching: true, loadingMore: false, canLoadMore: true }, () => {
            fetchApi('get', `page/get_data_tracking_number_by_item/${item_id}/data.json/`, { order: 'asc', offset: 0, limit: LIMIT })
                .then((data) => {
                    // console.log(data)

                    this.setState({ isFetching: false, items: data.rows, canLoadMore: data.rows.length < data.total })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ isFetching: false, canLoadMore: false })
                })
        })
    }

    onEndReached() {
        const { item_id } = this.props.route.params

        if (!item_id) {
            return
        }

        if (this.state.isFetching || !this.state.canLoadMore || this.state.loadingMore) {
            return
        }

        this.setState({ loadingMore: true }, () => {
            fetchApi('get', `page/get_data_tracking_number_by_order/${item_id}/data.json/`, { order: 'asc', offset: this.state.items.length, limit: this.state.items.length + LIMIT })
                .then((data) => {
                    // console.log(data)
                    let items = this.state.items
                    data.rows.map((item) => {
                        items.push(item)
                    })

                    this.setState({ loadingMore: false, items: items, canLoadMore: items.length < data.total })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ loadingMore: false })
                })
        })
    }

    renderItem({ item, index }) {
        return (
            <OrderTrackingItem {...item} onDetail={this.openItem.bind(this, item.id)} onReport={this.onReport.bind(this, item.id)} />
        )
    }

    onReport(shipment_package) {
        this.props.navigation.navigate('SubmitReportView', { shipment_package: shipment_package })
    }

    openItem(item_id) {
        this.props.navigation.navigate('TrackingDetailView', { tracking_id: item_id })
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

    render() {

        const { isFetching, items } = this.state
        const { item_id } = this.props.route.params

        return (
            <View style={styles.container}>
                <Header
                    title={'Kiện hàng sp - ' + item_id}
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
                    onEndReached={this.onEndReached.bind(this)}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    ListEmptyComponent={() => <Text style={{ width: '100%', fontSize: 13, textAlign: 'center', padding: 16, fontFamily: Global.FontName, color: '#aaaaaa' }}>Chưa có thông tin vận chuyển</Text>}
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

export default connect(mapStateToProps, mapDispatchToProps)(ItemTrackingView);
