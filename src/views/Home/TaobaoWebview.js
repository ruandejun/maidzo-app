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
import Header, {headerStyles} from 'components/Header'
import Webview from 'react-native-webview'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { addItemToCart } from 'Carts/redux/action'
import CustomAlert from '../../components/CustomAlert';
import { jsCheckReadyToAddCart, jsGetProductDetailForCart, jsHideTaobaoThing, jsShowOptionsPopup } from './script/taobao'
import {jsHide1688Thing, js1688ShowOptionsPopup, jsCheck1688ReadyToAddCart, jsGet1688ProductDetailForCart} from './script/alibaba'
import {jsGetChemistDetailForCart} from './script/chemist'
import ProgressBar from 'react-native-progress/Bar'

class TaobaoWebView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: false,
            searchKeyword: '',
            url: props.navigation.getParam('url')
        }
    }

    loadingTimer = null
    currentUrl = null

    componentDidMount() {
    }

    onstartRequest(event) {
        try {
            // console.log(event)

            this.currentUrl = event.mainDocumentURL ? event.mainDocumentURL : event.url

            if (this.currentUrl.indexOf('http') != 0) {
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
        }
    }

    async addToCart() {
        // console.log(this.currentUrl)
        if(this.currentUrl.indexOf('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id=') == 0){
            this.setState({url: this.currentUrl.replace('https://ju.taobao.com/m/jusp/alone/detailwap/mtp.htm?item_id=', 'https://detail.m.tmall.com/item.htm?id=')})
            return
        }
        if (this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') == -1 && this.currentUrl.indexOf('m.1688.com/offer') == -1 && 
            this.currentUrl.indexOf('https://www.chemistwarehouse.com.au/buy/') == -1 && this.currentUrl.indexOf('https://dis.as.criteo.com/dis/dis.aspx' == -1)
        ) {
            CustomAlert(null, 'Đây không phải trang chi tiết sản phẩm')
            return
        }

        if(this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1){
            this.webview.injectJavaScript(jsCheckReadyToAddCart)
        } else if(this.currentUrl.indexOf('m.1688.com/offer') != -1){
            this.webview.injectJavaScript(jsCheck1688ReadyToAddCart)
        } else if(this.currentUrl.indexOf('https://www.chemistwarehouse.com.au/buy/') != -1 || this.currentUrl.indexOf('https://dis.as.criteo.com/dis/dis.aspx') != -1){
            this.webview.injectJavaScript(jsGetChemistDetailForCart)
        }
    }

    onBack() {
        this.props.navigation.goBack()
    }

    async onMessage(event) {
        try {
            if (event.nativeEvent.data) {
                let response = JSON.parse(event.nativeEvent.data)
                // console.log(response)
                if (response) {
                    if (response.type == 'checkReadyToAddCart') {
                        if (response.value) {
                            if(this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1){
                                this.webview.injectJavaScript(jsGetProductDetailForCart)
                            } else if(this.currentUrl.indexOf('m.1688.com/offer') != -1){
                                this.webview.injectJavaScript(jsGet1688ProductDetailForCart)
                            }
                        } else {
                            if(this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') != -1){
                                this.webview.injectJavaScript(jsShowOptionsPopup)
                            } else if(this.currentUrl.indexOf('m.1688.com/offer') != -1){
                                this.webview.injectJavaScript(js1688ShowOptionsPopup)
                            }
                        }
                    }
                    if (response.type == 'getProductDetailForCart') {
                        const cart = response.value
                        let options = {}
                        cart.options.map((item) => {
                            options[item.propertyTitle] = item.propertyValue
                        })

                        // console.log(cart)
                        this.props.addItemToCart(cart.title, cart.title, cart.shop_name, cart.quantity,
                            cart.price, JSON.stringify(options), cart.detailUrl, cart.detailUrl, cart.currency,
                            cart.image, cart.price)
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
        if(this.state.searchKeyword.indexOf('https://') != 0){
            return
        }

        this.setState({url: this.state.searchKeyword})
    }

    goBack(){
        if(this.webview){
            this.webview.goBack()
        }
    }

    reloadWeb(){
        if(this.webview){
            this.webview.reload()
        }
    }

    onChangeText(text){
        
        
        let searchKeyword = text

        try {
            const results = text.match(/(https?:\/\/[^\s]+)/g)
            if(results && results.length > 0){
                searchKeyword = results[0]
            }
        } catch (error) {
            console.log(error)
        }

        this.setState({searchKeyword: searchKeyword})
    }

    render() {

        const {url} = this.state
        const { cartCount } = this.props

        return (
            <View style={styles.container}>
                <SafeAreaView style={headerStyles.container}>
                    <StatusBar translucent barStyle='dark-content' backgroundColor='#00000000' networkActivityIndicatorVisible={this.state.loading}/>
                    <TouchableOpacity style={headerStyles.iconLeft} onPress={this.onBack.bind(this)}>
                        <Icon name={'times'} size={22} color={Global.MainColor} />
                    </TouchableOpacity>

                    <View style={[headerStyles.searchContainer]}>
                        <Icon name='search' size={15} color='#7f7f7f'/>
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
                {this.state.loading && <ProgressBar height={1} borderRadius={0} width={Global.ScreenWidth} color="#2196F3" indeterminate={true}/>}
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
                    {/* {this.state.loading && Platform.OS == 'android' &&
                        <View style={[StyleSheet.absoluteFill, { backgroundColor: '#00000077', alignItems: 'center', justifyContent: 'center' }]}>
                            <Image source={Media.LoadingIcon} style={{width : 30, height : 30}} resizeMode='contain'/>
                        </View>
                    } */}
                </View>
                <View style={{ width: Global.ScreenWidth, backgroundColor: Global.MainColor, flexDirection: 'row'}}>
                        <TouchableOpacity onPress={this.goBack.bind(this)} style={{ width: '25%', backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='chevron-left' color='white' size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 13, marginTop : 5, color: 'white', fontFamily: Global.FontName, fontWeight: '500' }}>Trang trước</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.reloadWeb.bind(this)} style={{ width: '25%', backgroundColor: '#aaaaaa', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='redo' color='white' size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 13, marginTop : 5, color: 'white', fontFamily: Global.FontName, fontWeight: '500' }}>Tải lại</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.addToCart.bind(this)} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace() }}>
                            <Icon name='cart-plus' color='white' size={20} style={{ marginRight: 10 }} />
                            <Text style={{ fontSize: 16, marginTop : 5, color: 'white', fontFamily: Global.FontName, fontWeight: '500' }}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>
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
