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
        backgroundColor: '#f6f6f6', paddingBottom: getBottomSpace()
    },
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import { fetchApi } from 'actions/api'
import { getBottomSpace } from 'react-native-iphone-x-helper';
import FastImage from 'react-native-fast-image';
import TranslateText from '../../components/TranslateText';

const LIMIT = 20

class HomeSearchView extends React.Component {

    constructor(props) {
        super(props)

        const { keyword } = props.route.params
        this.state = {
            items: [],
            keyword: keyword,
            isFetching: false,
            page: 0,
            loadingMore: false,
            canLoadMore: true
        }
    }

    componentDidMount() {
        this.onRefresh()
    }

    onRefresh() {
        const { keyword } = this.state

        this.setState({ isFetching: true, loadingMore: false, canLoadMore: true, page: 0 }, () => {
            fetchApi('get', `page/search/`, { key: keyword, page_no: this.state.page, page_size: LIMIT, platform: 1 })
                .then((data) => {
                    // console.log(data)

                    let result = []
                    if (data && data.tbk_dg_material_optional_response && data.tbk_dg_material_optional_response.result_list && data.tbk_dg_material_optional_response.result_list.map_data) {
                        result = data.tbk_dg_material_optional_response.result_list.map_data
                    }

                    this.setState({ isFetching: false, items: result, canLoadMore: result.length == LIMIT })
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ isFetching: false, canLoadMore: false })
                })
        })
    }

    onEndReached() {
        const { keyword } = this.state

        if (this.state.isFetching || !this.state.canLoadMore || this.state.loadingMore) {
            return
        }

        this.setState({ loadingMore: true, page: this.state.page + 1 }, () => {
            fetchApi('get', `page/search/`, { key: keyword, page_no: this.state.page, page_size: LIMIT, platform: 1 })
                .then((data) => {
                    console.log(data)
                    if (data) {
                        let items = this.state.items

                        let result = []
                        if (data && data.tbk_dg_material_optional_response && data.tbk_dg_material_optional_response.result_list && data.tbk_dg_material_optional_response.result_list.map_data) {
                            result = data.tbk_dg_material_optional_response.result_list.map_data
                        }

                        result.map((item) => {
                            items.push(item)
                        })

                        this.setState({ loadingMore: false, items: items, canLoadMore: data.tbk_dg_material_optional_response ? (items.length < data.tbk_dg_material_optional_response.total_results) : false })
                    } else {
                        this.setState({ loadingMore: false })
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({ loadingMore: false })
                })
        })
    }

    renderItem({ item, index }) {
        return (
            <TouchableOpacity onPress={this.onPressItem.bind(this, item)} style={{ backgroundColor: 'white', padding: 10, marginTop: 8, flexDirection: 'row' }}>
                <FastImage source={{ uri: item.pict_url }} style={{ width: 60, height: 60 }} resizeMode='cover' />
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginLeft: 8 }}>
                    <TranslateText style={{ fontSize: 14, color: Global.MainColor, fontFamily: Global.Fontname, width: '100%' }} numberOfLines={1} text={item.short_title} />
                    <TranslateText style={{ fontSize: 13, marginTop: 5, color: '#333333', fontFamily: Global.Fontname, width: '100%' }} numberOfLines={1} text={item.title} />
                    <Text style={{ fontSize: 13, marginTop: 5, color: '#333333', fontFamily: Global.Fontname, width: '100%' }}>{'Giá: CNY' + item.reserve_price}</Text>
                    <TranslateText style={{ fontSize: 13, marginTop: 5, color: '#333333', fontFamily: Global.Fontname, width: '100%' }} text={item.coupon_info} />
                </View>
            </TouchableOpacity>
        )
    }

    onPressItem(item) {
        this.props.navigation.navigate('ProductDetailView', { product: {...item, click_url: item.url} })
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

        return (
            <View style={styles.container}>
                <Header
                    title='Tìm kiếm sản phầm'
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
                    ListEmptyComponent={() => isFetching ? null : <Text style={{ width: '100%', fontSize: 13, textAlign: 'center', padding: 16, fontFamily: Global.FontName, color: '#aaaaaa' }}>Không tìm thấy sản phẩm</Text>}
                />
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeSearchView);
