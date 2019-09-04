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
    FlatList
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
})

import { connect } from 'react-redux';
import Global, { Media, getBottomSpace, decode, getStatusBarHeight } from 'src/Global';
import Header from 'components/Header'
import Webview from 'react-native-webview'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {addItemToCart} from 'Carts/redux/action'
import CustomAlert from '../../components/CustomAlert';

class TaobaoWebView extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            loading: false,
            canGoBack: false,
        }
    }

    loadingTimer = null
    currentUrl = null

    componentDidMount(){
    }

    onstartRequest(event){
        try {
            console.log(event)

            this.currentUrl = event.mainDocumentURL

            if(event.mainDocumentURL.indexOf('http') != 0){
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

    handleWebViewNavigationStateChange(newState){
        if(newState && !newState.loading){
            this.webview.injectJavaScript(`
                hideTaobaoThings();
            `)
        }
        this.setState({loading: newState && newState.loading, canGoBack: newState && newState.canGoBack})
    }

    async addToCart(){
        if(this.currentUrl.indexOf('https://m.intl.taobao.com/detail/detail.html') == -1){
            CustomAlert(null, 'Đây không phải trang chi tiết sản phẩm')
            return
        }

        await this.webview.injectJavaScript(`
            hideTaobaoThings();
            checkReadyToAddCart()
        `)
    }

    onBack(){
        if(this.state.canGoBack){
            this.webview && this.webview.goBack()
        } else {
            this.props.navigation.goBack()
        }
    }

    async onMessage(event){
        try {
            if(event.nativeEvent.data){
                let response = JSON.parse(event.nativeEvent.data)
                console.log(response)
                if(response){
                    if(response.type == 'checkReadyToAddCart'){
                        if(response.value){
                            this.webview.injectJavaScript(`
                                getProductDetailForCart()
                            `)
                        } else {
                            this.webview.injectJavaScript(`
                                forceShowOptionPopup();
                                hidePopupAddToCartButtons();
                            `)
                        }
                    }
                    if(response.type == 'getProductDetailForCart'){
                        const cart = response.value
                        let options = {}
                        cart.options.map((item) => {
                            options[item.propertyTitle] = item.propertyValue
                        })
                        this.props.addItemToCart(cart.title, cart.title, cart.shop_name, cart.quantity, 
                            cart.price, JSON.stringify(options), cart.detailUrl, cart.detailUrl, cart.currency, 
                            cart.parentImage, cart.price)
                    }
                }
            }
        } catch (error) {
            
        }
    }

    openCart(){
        this.props.navigation.navigate('CartView')
    }

    render() {

        const url = this.props.navigation.getParam('url')
        const {cartCount} = this.props

        return (
            <View style={styles.container}>
                <Header
                    leftIcon='chevron-left'
                    leftAction={this.onBack.bind(this)}
                    rightIcon='shopping-cart'
                    rightCount={cartCount}
                    rightAction={this.openCart.bind(this)}
                />
                <View style={{flex: 1}}>
                    <Webview 
                        ref={ref => (this.webview = ref)}
                        onNavigationStateChange={this.handleWebViewNavigationStateChange.bind(this)}
                        style={{flex: 1}} source={{uri: url}}
                        onShouldStartLoadWithRequest={this.onstartRequest.bind(this)}
                        onMessage={this.onMessage.bind(this)}
                        javaScriptEnabled={true}
                        originWhitelist={['*']}
                        injectedJavaScript={`
                        function hideTaobaoThings() {
                            var hides = document.querySelectorAll('.title-wrapper');
                            hides.forEach(function(h){h.style.display='none';});
                    
                            var banners = document.querySelectorAll('.smartbanner-wrapper');
                            banners.forEach(function(banner){banner.style.display='none';});
                    
                            var carts = document.querySelectorAll('.toolbar__cart');
                            carts.forEach(function(cart) {cart.style.display='none';});
                    
                            var bars = document.querySelectorAll('.bar');
                            bars.forEach(function(bar) {bar.style.display='none';});
                    
                            var closes = document.querySelectorAll('.mui-zebra-module .close-btn');
                            closes.forEach(function(close) {close.click();});
                    
                            closes = document.querySelectorAll('.mui-zebra-module .zebra-oversea-smartbanner-clear');
                            closes.forEach(function(close) {close.click();});
                          }

                          function checkReadyToAddCart() {
                            var canAddCart = true;
                            var element = document.querySelectorAll('.modal-sku-content');
                            element.forEach(function(node) {
                              var opt = node.getElementsByClassName('modal-sku-content-item-active').length;
                              if (opt == 'undefined' || opt < 1) {
                                canAddCart = false;
                              } else {}
                            });
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'checkReadyToAddCart', value: canAddCart}))
                          }

                          function forceShowOptionPopup(){
                            var addCart = document.getElementsByClassName('bar-addcart')[0]; 
                            if(addCart) { 
                              addCart.click();
                            } else { 
                              addCart = document.getElementsByClassName('bar-buynow')[0];
                              if(addCart) { 
                                addCart.click();
                              }
                            }
                          }
                    
                          function hidePopupAddToCartButtons() {
                            var modalBtns = document.querySelectorAll('.sku.card .modal .modal-btn-wrapper');
                            modalBtns.forEach(function(btn) {btn.style.display='none';});
                          }

                          function getProductDetailForCart() {
                            var product = {
                              title : "Taobao product name",
                              price : 0.0,
                              quantity : 1,
                              options : [],
                              image : "url_of_selected_product_image",
                              parentImage : "url_of_parent_image_as_default",
                              detailUrl : "product_source_url",
                              shop_name : "shop_name",
                              currency : "CNY"
                            };
                      
                            product.detailUrl = window.location.href;
                            product.title = document.getElementsByClassName('title')[0].innerText;
                            product.price = parseFloat(document.getElementsByClassName('modal-sku-title-price')[0].innerText);
                            product.quantity = parseInt(document.getElementsByClassName('sku-number-edit')[0].value);
                            product.shop_name = document.getElementsByClassName('shop-title-text')[0].innerText;
                      
                            var prdImages = document.querySelectorAll('.modal-title-sku .modal-sku-image img');
                            product.image = prdImages[0].src;
                            product.parentImage = document.getElementsByClassName('mui-lazy')[0].getAttribute('src');;
                      
                            var selectedOptions = [];
                            var element = document.querySelectorAll('.modal-sku-content');
                            element.forEach(function(node) {
                              var option = {
                                propertyTitle : node.getElementsByClassName('modal-sku-content-title')[0].innerText,
                                propertyValue : node.getElementsByClassName('modal-sku-content-item-active')[0].innerText
                              };
                              selectedOptions.push(option);
                            });
                      
                            product.options = selectedOptions;
                            
                            closeOptionPopup();
                            window.ReactNativeWebView.postMessage(JSON.stringify({type: 'getProductDetailForCart', value: product}))
                          }
                      
                          function closeOptionPopup() {
                            var modalCloses = document.querySelectorAll('.modal.modal-show .modal-close-btn');
                            modalCloses.forEach(function(close){close.click();});
                          }

                          true;
                        `}
                    />
                    <View style={{width: Global.ScreenWidth, backgroundColor: Global.MainColor}}>
                        <TouchableOpacity onPress={this.addToCart.bind(this)} style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', height: 60 + getBottomSpace(), paddingBottom: getBottomSpace()}}>
                            <Icon name='cart-plus' color='white' size={20} style={{marginRight: 10}}/>
                            <Text style={{fontSize: 18, color: 'white', fontFamily: Global.FontName, fontWeight: '500'}}>Thêm vào giỏ hàng</Text>
                        </TouchableOpacity>
                    </View>

                    {this.state.loading &&
                        <View style={[StyleSheet.absoluteFill, {backgroundColor: '#00000077', alignItems: 'center', justifyContent: 'center'}]}>
                            <ActivityIndicator size='small' color={Global.MainColor}/>
                        </View>
                    }
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
