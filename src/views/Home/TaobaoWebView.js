import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ProgressBarAndroid,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    FlatList,
    StatusBar
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
})

import { connect } from 'react-redux';
import Global, { Media, getBottomSpace, decode, getStatusBarHeight } from 'src/Global';
import Header, { headerStyles } from 'components/Header'
import Webview from 'react-native-webview'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { addItemToCart } from 'Carts/redux/action'
import { fetchUnlengthApi } from 'actions/api'
import CustomAlert from '../../components/CustomAlert';
import { jsCheckReadyToAddCart, jsGetProductDetailForCart, jsHideTaobaoThing, jsShowOptionsPopup } from './script/taobao'
import { jsCheckJDReadyToAddCart, jsGetJDProductDetailForCart, jsHideJDThing, jsShowJDOptionsPopup } from './script/jd'
import { jsHide1688Thing, js1688ShowOptionsPopup, jsCheck1688ReadyToAddCart, jsGet1688ProductDetailForCart } from './script/alibaba'
import { jsGetChemistDetailForCart } from './script/chemist'
import ProgressBar from 'react-native-progress/Bar'
import Share from 'react-native-share'
import { KeyboardAwareFlatList } from 'react-native-keyboard-aware-scroll-view';

class TaobaoWebView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            searchKeyword: '',
            url: props.navigation.getParam('url'),
            suggestions: [],
            searchSource: 0 //0 = 1688, 1 = taobao, 2 = tmall, 3 = chemistwarehouse, 4 = JD
        }
    }

    loadingTimer = null
    currentUrl = null

    componentDidMount() {
        let url = this.props.navigation.getParam('url')
        if(url && url.indexOf('https://www.chemistwarehouse.com.au') != -1 || url.indexOf('https://dis.as.criteo.com') != -1){
            this.setState({searchSource: 3})
        } else if(url && url.indexOf('m.1688.com') != -1 || url.indexOf('1688.com') != -1){
            this.setState({searchSource: 0})
        } if(url && url.indexOf('m.jd.com') != -1 || url.indexOf('jd.com') != -1){
            this.setState({searchSource: 4})
        } else if(url && url.indexOf('https://m.intl.taobao.com') != -1 || url.indexOf('intl.taobao.com') != -1){
            this.setState({searchSource: 1})
        } else {
            this.setState({searchSource: 2})
        }
    }

    onstartRequest(event) {
        try {
            // console.log(event)

            this.currentUrl = event.mainDocumentURL ? event.mainDocumentURL : event.url

            if (this.currentUrl && this.currentUrl.indexOf('http') != 0) {
                return false
            }

            // if(this.loadingTimer){
            //     clearTimeout(this.loadingTimer)
            //     this.loadingTimer = null
            // }

            // this.loadingTimer = setTimeout(() => {
            //     fetch(event.url)
            //     .then((res) => res.text())
            //     .then((data) => {
            //         console.log(event.url)
            //         console.log(data)
            //     })
            //     .catch((error) => {
            //         console.log(error)
            //     })
            // }, 100)
        } catch (error) {
            console.log(error)
        }

        return true
    }

    handleWebViewNavigationStateChange(newState) {
        this.setState({ loading: newState && newState.loading })
        // console.log(newState)
        if (newState && !newState.loading) {
            this.webview.injectJavaScript(jsHideTaobaoThing)
            this.webview.injectJavaScript(jsHide1688Thing)
            this.webview.injectJavaScript(jsHideJDThing)
        }
    }

    async addToCart() {
        // console.log(this.currentUrl)
        if(!this.currentUrl){
            return
        }

        if (this.currentUrl.indexOf('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id=') == 0) {
            this.setState({ url: this.currentUrl.replace('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id=', 'https://detail.m.tmall.com/item.htm?id=') })
            return
        }
        if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') == -1 && this.currentUrl.indexOf('m.1688.com/offer') == -1 && this.currentUrl.indexOf('item.m.jd.com') == -1 &&
            this.currentUrl.indexOf('item.m.paipai.com') == -1 && this.currentUrl.indexOf('https://www.chemistwarehouse.com.au/buy/') == -1 && this.currentUrl.indexOf('https://dis.as.criteo.com/dis/dis.aspx' == -1)
        ) {
            CustomAlert(null, 'Đây không phải trang chi tiết sản phẩm')
            return
        }

        if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1) {
            this.webview.injectJavaScript(jsCheckReadyToAddCart)
        } else if (this.currentUrl.indexOf('m.1688.com/offer') != -1) {
            this.webview.injectJavaScript(jsCheck1688ReadyToAddCart)
        } else if (this.currentUrl.indexOf('item.m.jd.com') != -1 || this.currentUrl.indexOf('item.m.paipai.com') != -1) {
            this.webview.injectJavaScript(jsCheckJDReadyToAddCart)
        } else if (this.currentUrl.indexOf('https://www.chemistwarehouse.com.au/buy/') != -1 || this.currentUrl.indexOf('https://dis.as.criteo.com/dis/dis.aspx') != -1) {
            this.webview.injectJavaScript(jsGetChemistDetailForCart)
        }
    }

    onBack() {
        this.props.navigation.goBack()
    }

    async onMessage(event) {
        try {
            if (event.nativeEvent.data && this.currentUrl) {
                let response = JSON.parse(event.nativeEvent.data)
                // console.log(response)
                if (response) {
                    if (response.type == 'checkReadyToAddCart') {
                        if (response.value == 1) {
                            if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1) {
                                this.webview.injectJavaScript(jsGetProductDetailForCart)
                            } else if (this.currentUrl.indexOf('m.1688.com/offer') != -1) {
                                this.webview.injectJavaScript(jsGet1688ProductDetailForCart)
                            } else if (this.currentUrl.indexOf('item.m.jd.com') != -1 || this.currentUrl.indexOf('item.m.paipai.com') != -1) {
                                this.webview.injectJavaScript(jsGetJDProductDetailForCart)
                            }
                        } else if (response.value == 2) {
                            CustomAlert('Có lỗi', 'Vui lòng chọn thuộc tính sản phẩm')
                        } else if (response.value == 3) {
                            CustomAlert('Có lỗi', 'Sản phẩm đã hết hàng hoặc phải đăng nhập để đặt hàng.', [
                                {text: 'Cancel'},
                                {text: 'Đăng nhập', onPress: () => this.setState({url: `https://login.m.taobao.com/login_oversea.htm?spm=a2141.8294655.toolbar.3&redirectURL=${this.currentUrl}`})}
                            ])
                        } else {
                            if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1) {
                                this.webview.injectJavaScript(jsShowOptionsPopup)
                            } else if (this.currentUrl.indexOf('m.1688.com/offer') != -1) {
                                this.webview.injectJavaScript(js1688ShowOptionsPopup)
                            } else if (this.currentUrl.indexOf('item.m.jd.com') != -1 || this.currentUrl.indexOf('item.m.paipai.com') != -1) {
                                this.webview.injectJavaScript(jsShowJDOptionsPopup)
                            }
                        }
                    }
                    if (response.type == 'getProductDetailForCart') {
                        const carts = response.value
                        carts.map((cart) => {
                            let options = {}
                            cart.options.map((item) => {
                                options[item.propertyTitle] = item.propertyValue
                            })
    
                            // console.log(cart)
                            this.props.addItemToCart(cart.title, cart.title, cart.shop_name, cart.quantity,
                                cart.price, JSON.stringify(options), cart.detailUrl, cart.detailUrl, cart.currency,
                                cart.image, cart.price)
                        })
                        
                        this.webview.reload()
                    }
                }
            }
        } catch (error) {

        }
    }

    openCart() {
        this.props.navigation.navigate('CartView')
    }

    onEndSubmit() {
        if (this.state.searchKeyword.indexOf('https://') != 0) {
            return
        }

        this.setState({ url: this.state.searchKeyword })
    }

    goBack() {
        if (this.webview) {
            this.webview.goBack()
        }
    }

    reloadWeb() {
        if (this.webview) {
            this.webview.reload()
        }
    }

    searchTimer = null

    onChangeText(text) {

        let searchKeyword = text

        try {
            const results = text.match(/(https?:\/\/[^\s]+)/g)
            // console.log(results)
            if (results && results.length > 0) {
                searchKeyword = results[0]
            } else {
                if (this.searchTimer) {
                    clearTimeout(this.searchTimer)
                    this.searchTimer = null
                }

                this.searchTimer = setTimeout(async () => {
                    const suggestions = await fetchUnlengthApi('get', 'page/key_translate/', { key: searchKeyword })
                    if (suggestions) {
                        this.setState({ suggestions: suggestions })
                    } else {
                        this.setState({ suggestions: [] })
                    }
                }, 1000);
            }
        } catch (error) {
            console.log(error)
        }

        this.setState({ searchKeyword: searchKeyword, suggestions: [] })
    }

    onPressSuggestion(suggestion) {

        const { searchSource } = this.state
        let currentUrl = this.state.url

        if (searchSource == 1) {
            currentUrl = `https://m.intl.taobao.com/search/search.html?q=${suggestion.zh_value}`
        } else if (searchSource == 0) {
            currentUrl = `https://m.1688.com/offer_search/-6D7033.html?keywords=${suggestion.zh_value}`
        } else if (searchSource == 3) {
            currentUrl = `https://www.chemistwarehouse.com.au/search/go?w=${suggestion.key}`
        } else if (searchSource == 2) {
            currentUrl = `https://list.tmall.com/search_product.htm?q=${suggestion.zh_value}&type=p&tmhkh5=&spm=a220m.8599659.a2227oh.d100&from=mallfp..m_1_searchbutton&searchType=default&closedKey=`
        } else if (searchSource == 4){
            currentUrl = `https://so.m.jd.com/ware/search.action?keyword=${suggestion.zh_value}&searchFrom=home&sf=11&as=1`
        }

        // console.log(currentUrl)

        this.setState({ searchKeyword: '', suggestions: [], url: currentUrl })
    }

    renderSuggestion({ item, index }) {
        return (
            <TouchableOpacity onPress={this.onPressSuggestion.bind(this, item)} style={{ padding: 8, width: '100%' }}>
                <Text style={{ fontSize: 14, color: 'black', fontFamily: Global.FontName }}>{item.key}
                    <Text style={{ fontSize: 12, color: '#777777' }}>{'\n' + item.zh_value}</Text>
                </Text>
            </TouchableOpacity>
        )
    }

    onShare() {
        Share.open({ url: this.currentUrl.replace('#modal=sku', '') })
            .then((res) => { console.log(res) })
            .catch((err) => { err && console.log(err); });
    }

    renderHeader() {
        const {searchSource} = this.state
        
        return (
            <View style={{ flexDirection: 'row', height: 60, backgroundColor: '#CECECE' }}>
                <TouchableOpacity onPress={() => this.setState({searchSource: 0})} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 0 ? Global.MainColor : 'white'  }}>
                    <Image source={Media.AlibabaIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName}}>1688</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({searchSource: 1})} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 1 ? Global.MainColor : 'white' }}>
                    <Image source={Media.TaobaoIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>taobao</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({searchSource: 2})} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 2 ? Global.MainColor : 'white' }}>
                    <Image source={Media.TmallIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>tmall</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.setState({searchSource: 4})} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white', borderBottomColor: searchSource == 3 ? Global.MainColor : 'white' }}>
                    <Image source={Media.JDIcon} style={{ width: 20, height: 20 }} resizeMode='contain' />
                    <Text numberOfLines={1} style={{ width: '100%', textAlign: 'center', fontSize: 14, marginTop: 5, color: 'black', fontFamily: Global.FontName }}>jd</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        const { url, suggestions } = this.state
        const { cartCount } = this.props

        return (
            <View style={styles.container}>
                <SafeAreaView style={headerStyles.container}>
                    <StatusBar translucent barStyle='dark-content' backgroundColor='#00000000' networkActivityIndicatorVisible={this.state.loading} />
                    <TouchableOpacity style={headerStyles.iconLeft} onPress={this.onBack.bind(this)}>
                        <Icon name={'times'} size={22} color={Global.MainColor} />
                    </TouchableOpacity>

                    <View style={[headerStyles.searchContainer]}>
                        <Icon name='search' size={15} color='#7f7f7f' />
                        <TextInput
                            style={[headerStyles.searchInput,]}
                            underlineColorAndroid='#00000000'
                            placeholder={'Nhập link sản phẩm cần tìm kiếm'}
                            placeholderTextColor='#7f7f7f'
                            value={this.state.searchKeyword}
                            clearButtonMode='always'
                            clearTextOnFocus={true}
                            onChangeText={this.onChangeText.bind(this)}
                            onSubmitEditing={this.onEndSubmit.bind(this)}
                            onEndEditing={this.onEndSubmit.bind(this)}
                        />
                    </View>

                    <TouchableOpacity style={headerStyles.iconRight} onPress={this.openCart.bind(this)}>
                        <Icon name={'shopping-cart'} size={23} color={Global.MainColor} />

                        {cartCount > 0 &&
                            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'green', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ fontSize: 9, fontFamily: Global.FontName, color: 'white' }}>{cartCount}</Text>
                            </View>
                        }
                    </TouchableOpacity>
                    <View style={headerStyles.headerSeparator} />
                </SafeAreaView>
                {(!suggestions || suggestions.length == 0) && this.state.loading && <ProgressBar height={1} borderRadius={0} width={Global.ScreenWidth} color="#2196F3" indeterminate={true} />}
                {(!suggestions || suggestions.length == 0) &&
                    <View style={{ flex: 1 }}>
                        <Webview
                            ref={ref => (this.webview = ref)}
                            onNavigationStateChange={this.handleWebViewNavigationStateChange.bind(this)}
                            style={{ flex: 1 }} source={{ uri: url }}
                            onShouldStartLoadWithRequest={this.onstartRequest.bind(this)}
                            onMessage={this.onMessage.bind(this)}
                            javaScriptEnabled={true}
                            originWhitelist={['*']}
                        />
                    </View>
                }
                {(!suggestions || suggestions.length == 0) &&
                    <View style={{ width: Global.ScreenWidth, backgroundColor: Global.MainColor, flexDirection: 'row' }}>
                        <TouchableOpacity onPress={this.goBack.bind(this)} style={{ width: 50, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='chevron-left' color='white' size={20} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.reloadWeb.bind(this)} style={{ width: 50, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='redo' color='white' size={20} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.onShare.bind(this)} style={{ width: 50, backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='share' color='white' size={20} style={{ marginRight: 10 }} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.addToCart.bind(this)} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='cart-plus' color='white' size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16, marginTop: 5, color: 'white', fontFamily: Global.FontName, fontWeight: '500' }}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>
                }
                {suggestions && suggestions.length > 0 &&
                    <KeyboardAwareFlatList
                        ListHeaderComponent={this.renderHeader.bind(this)}
                        data={suggestions}
                        style={{ flex: 1 }}
                        renderItem={this.renderSuggestion.bind(this)}
                        keyExtractor={(item, index) => index.toString()}
                    />
                }
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cartCount: state.cart.count,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        addItemToCart: (name, short_description, vendor, quantity, price, options_selected, detail_url, link_origin, currency, image_url, price_origin) => dispatch(addItemToCart(name, short_description, vendor, quantity, price, options_selected, detail_url, link_origin, currency, image_url, price_origin)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(TaobaoWebView);
