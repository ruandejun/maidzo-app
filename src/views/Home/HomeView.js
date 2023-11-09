/**
 * @flow
 * @providesModule HomeMainView
 */

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
    StatusBar,
    Linking,
    Keyboard,
    RefreshControl,
    Dimensions,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#eeeeee', alignItems: 'center'
    },
    itemContainer: {
        flexDirection: 'row', height: 50, alignItems: 'center'
    },
    itemText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, flex: 1, marginLeft: 8, marginRight: 8
    },
    separator: {
        position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: '#CECECE'
    }
})

import { connect } from 'react-redux';
import Global, { Media, contacts, decode, convertMoney } from 'src/Global';
import { getWalletBalance } from 'Wallets/redux/action'
import { getSettings } from 'Setting/redux/action'
import { getCart } from 'Carts/redux/action'
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ScrollView, TextInput, FlatList } from 'react-native-gesture-handler';
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet';
import ImagePicker from 'react-native-image-crop-picker'
import { Overlay } from 'teaset'
import ActionButton from 'react-native-action-button'
import { fetchApi } from 'actions/api'
import PopupView from 'components/PopupView'
import ProductItem from './components/ProductItem';
import remoteConfig from '@react-native-firebase/remote-config'


// const templateKeywords = ['quần áo', 'giầy dép', 'điện thoại', 'công nghệ', 'mỹ phẩm', 'túi xách', 'giầy nữ', 'trang sức', 'gia dụng', 'nhà bếp']

class HomeView extends React.Component {

    state = {
        keyword: '',
        pastedLink: '',
        currencies: [],
        cnyConvert: 3470,
        ifashionItems: [],
        flashSaleItems: [],
        quantitySaleItems: [],
        loading: false,
        templateKeywords: ['quần áo', 'giầy dép', 'điện thoại', 'công nghệ', 'mỹ phẩm', 'túi xách', 'giầy nữ', 'trang sức', 'gia dụng', 'nhà bếp']
    }

    componentDidMount() {
        this.props.getSettings()
        this.props.getCart()

        StatusBar.setBarStyle('dark-content')

        this.getNotify()
        this.onRefresh()
    }

    onLoadCurrency() {
        fetchApi('get', 'page/get_data_currency/', { order: 'asc', offset: 0, limit: 50 })
            .then((data) => {
                console.log(data)
                if (data && data.rows) {

                    this.setState({ currencies: data.rows })
                    const cnyFilter = data.rows.filter((item) => item.currency === 'CNY')
                    if (cnyFilter && cnyFilter.length > 0) {
                        this.setState({ cnyConvert: parseInt(cnyFilter[0].exchange_rate.toString()) })
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getNotify() {
        fetchApi('get', 'api/system_configure/template/thong-bao/')
            .then((data) => {
                if (data && data.body && data.body.length > 0) {
                    let overlayView = (
                        <Overlay.PopView
                            modal={true}
                            ref={v => this.alertOverlayView = v}
                        >
                            <View style={{ width: Global.ScreenWidth, height: Global.ScreenHeight, backgroundColor: '#00000044', alignItems: 'center', justifyContent: 'center' }}>
                                <PopupView title={data.title} html={data.body} onClose={() => this.alertOverlayView && this.alertOverlayView.close()} />
                            </View>
                        </Overlay.PopView>
                    );
                    Overlay.show(overlayView)
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    loadIFashion() {
        this.setState({ loading: true })
        fetchApi('get', 'page/get_item_ifashions/')
            .then((data) => {
                console.log(data)
                if (data) {
                    this.setState({ ifashionItems: data })
                }

                this.setState({ loading: false })
            })
            .catch((error) => {
                console.log(error)
                this.setState({ loading: false })
            })
    }

    loadFlashSale() {
        fetchApi('get', 'page/get_item_flash_sale/')
            .then((data) => {
                console.log(data)
                if (data) {
                    this.setState({ flashSaleItems: data })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    loadQuanlitySale() {
        fetchApi('get', 'page/get_item_quantity_sale/')
            .then((data) => {
                console.log(data)
                if (data) {
                    this.setState({ quantitySaleItems: data })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    onRefresh() {
        this.loadIFashion()
        this.loadFlashSale()
        this.loadQuanlitySale()
        this.onLoadCurrency()

        try {
            const keywords = remoteConfig().getValue('template_keywords').asString()
            console.log({keywords})

            if(keywords.length > 0)
                this.setState({ templateKeywords: keywords.split(';') })
        } catch (error) {
            console.log({error})
        }
    }

    isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch (error) {
            return false;
        }
    }

    onSearch() {
        if (this.state.keyword.length == 0) {
            return
        }


        var urlRegex = /(https?:\/\/[^\s]+)/

        if (urlRegex.test(this.state.keyword)) {
            this.props.navigation.navigate('ProductDetailView', { product: { click_url: this.state.keyword.trim() } })
        } else {
            this.props.navigation.navigate('HomeSearchView', { keyword: this.state.keyword })
        }

    }

    onScanCode() {
        this.props.navigation.navigate('HomeScanView')
    }

    openDetail(item) {
        this.props.navigation.navigate('ProductDetailView', { product: item })
    }

    renderItem({ item, index }) {
        const { cnyConvert } = this.state
        return (
            <ProductItem {...item} convert={cnyConvert} onPress={() => this.openDetail(item)} />
        )
    }

    searchWord(word) {
        this.props.navigation.navigate('HomeSearchView', { keyword: word })
    }

    

    render() {
        
        const { user } = this.props
        const { loading, ifashionItems, flashSaleItems, quantitySaleItems, templateKeywords } = this.state

        return (
            <View style={styles.container}>
                <Header
                    searchBar
                    searchText={this.state.keyword}
                    searchContainer={{ left: 16, width: Global.ScreenWidth - 32 }}
                    headerChangeText={(text) => this.setState({ keyword: text })}
                    searchPlaceholder='Nhập từ khoá hoặc link sản phẩm'
                    onEndSubmit={this.onSearch.bind(this)}
                />
                {!!templateKeywords && templateKeywords.length > 0 &&
                    <View style={{ width: '100%', flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'white', padding: 16, paddingVertical: 8, paddingTop: 3 }}>
                        {templateKeywords.map((keyword) => {
                            return (
                                <TouchableOpacity key={keyword} onPress={() => this.searchWord(keyword)} style={{ marginTop: 5, paddingHorizontal: 5, paddingVertical: 3, borderRadius: 10, height: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#dddddd', marginRight: 8 }}>
                                    <Text style={{ fontSize: 12, color: 'black' }}>{keyword}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                }

                <ScrollView style={{ flex: 1, width: '100%' }} refreshControl={<RefreshControl refreshing={loading} onRefresh={this.onRefresh.bind(this)} />}>
                    <View style={{ width: '100%', marginTop: 10, marginBottom: 10 }}>

                        <View style={{ flexDirection: 'row', padding: 16, width: '100%', backgroundColor: Global.MainColor }}>
                            <Text style={{ marginLeft: 8, fontSize: 20, color: 'white', fontWeight: '800', fontFamily: Global.FontName, }}>Ifashions</Text>
                        </View>
                        <FlatList
                            data={ifashionItems}
                            renderItem={this.renderItem.bind(this)}
                            numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                            showsHorizontalScrollIndicator={false}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            style={{ width: '100%', backgroundColor: '#eeeeee', marginTop: 8, paddingHorizontal: 8 }}
                            ItemSeparatorComponent={
                                () => <View style={{ width: 8, height: 8 }} />
                            }
                        />


                        <View style={{ flexDirection: 'row', padding: 16, width: '100%', marginTop: 16, backgroundColor: Global.MainColor }}>
                            <Text style={{ marginLeft: 8, fontSize: 20, color: 'white', fontWeight: '800', fontFamily: Global.FontName, }}>Flash sale</Text>
                        </View>

                        <FlatList
                            data={flashSaleItems}
                            renderItem={this.renderItem.bind(this)}
                            numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                            showsHorizontalScrollIndicator={false}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            style={{ width: '100%', backgroundColor: '#eeeeee', marginTop: 8, paddingHorizontal: 8 }}
                            ItemSeparatorComponent={
                                () => <View style={{ width: 8, height: 8 }} />
                            }
                        />

                        <View style={{ flexDirection: 'row', padding: 16, width: '100%', marginTop: 16, backgroundColor: Global.MainColor }}>
                            <Text style={{ marginLeft: 8, fontSize: 20, color: 'white', fontWeight: '800', fontFamily: Global.FontName, }}>Sale giới hạn</Text>
                        </View>

                        <FlatList
                            data={quantitySaleItems}
                            renderItem={this.renderItem.bind(this)}
                            numColumns={Dimensions.get('screen').width > 700 ? 4 : 2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            showsHorizontalScrollIndicator={false}
                            style={{ width: '100%', backgroundColor: '#eeeeee', marginTop: 8, paddingHorizontal: 8 }}
                            ItemSeparatorComponent={
                                () => <View style={{ width: 8, height: 8 }} />
                            }
                        />
                    </View>
                </ScrollView>

            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getWalletBalance: (username) => dispatch(getWalletBalance(username)),
        getSettings: () => dispatch(getSettings()),
        getCart: () => dispatch(getCart())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
