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
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2', alignItems: 'center'
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
import firebase from 'react-native-firebase'
import ActionButton from 'react-native-action-button'
import {fetchApi} from 'actions/api'
import PopupView from 'components/PopupView'
import DeviceInfo from 'react-native-device-info'

class HomeView extends React.Component {

    state = {
        keyword: '',
        pastedLink: '',
        currencies: []
    }

    componentDidMount() {
        if (this.props.user) {
            this.props.getWalletBalance(this.props.user.username)
        }
        this.props.getSettings()
        this.props.getCart()

        this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
            console.log(notification)
        });
        this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
            console.log(notification)
        })

        this.removeRefreshTokenlistener = firebase.messaging().onTokenRefresh((token) => {
            console.log({token})
            Global.pushToken = token

            if(this.props.user){
                fetchApi('post', 'api/user/auth/update_fcm/', {device_id: DeviceInfo.getUniqueId(), registration_id: token, platform_type: Platform.OS})
                .then((data) => {
                    console.log({data})
                })
                .catch((error) => {
                    console.log({error})
                })
            }
        })

        this.onLoadCurrency()


        fetchApi('get', 'api/system_configure/template/thong-bao/')
        .then((data) => {
            if(data && data.body && data.body.length > 0){
                let overlayView = (
                    <Overlay.PopView
                        modal={true}
                        ref={v => this.alertOverlayView = v}
                    >
                        <View style={{width: Global.ScreenWidth, height: Global.ScreenHeight, backgroundColor: '#00000044', alignItems: 'center', justifyContent: 'center'}}>
                            <PopupView title={data.title} html={data.body} onClose={() => this.alertOverlayView && this.alertOverlayView.close()}/>
                        </View>
                    </Overlay.PopView>
                );
                Overlay.show(overlayView)
            }
        })
        .catch((error) => {
            console.log(error)
        })

        StatusBar.setBarStyle('dark-content')
    }

    onLoadCurrency(){
        fetchApi('get', 'page/get_data_currency/',{order : 'asc', offset : 0, limit: 50})
        .then((data) => {
            console.log(data)
            if(data && data.rows){
                
                this.setState({currencies: data.rows})
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    componentWillUnmount(){
        this.removeNotificationDisplayedListener();
        this.removeNotificationListener();
        this.removeRefreshTokenlistener()
    }

    onpenWeb(url) {
        if(this.overlayView){
            this.overlayView.close()
        }
        this.props.navigation.navigate('TaobaoWebView', { url: url.replace('#modal=sku', '') })
    }

    openSetting() {
        this.props.navigation.navigate('SettingView')
    }

    openWallet() {
        if(!this.props.user){
            CustomAlert('Lỗi', 'Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ hàng', [
                {text: 'Bỏ'},
                {text: 'Đăng nhập', onPress: () => this.props.navigation.navigate('LoginView')}
            ])
            return
        }

        this.props.navigation.navigate('WalletBalanceView')
    }

    openSupport() {
        this.props.navigation.navigate('SupportView')
    }

    openReports() {
        if(!this.props.user){
            CustomAlert('Lỗi', 'Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ hàng', [
                {text: 'Bỏ'},
                {text: 'Đăng nhập', onPress: () => this.props.navigation.navigate('LoginView')}
            ])
            return
        }

        this.props.navigation.navigate('ReportListView')
    }

    openLogin(){
        this.props.navigation.navigate('LoginView')
    }

    onSearch() {
        if (this.state.keyword.length == 0) {
            return
        }

        let regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
        if(regex.test(this.state.keyword)){
            this.onpenWeb(this.state.keyword)
        } else {
            this.props.navigation.navigate('HomeSearchView', { keyword: this.state.keyword })
        }
        
    }

    onImageSearch() {
        if(!this.props.user){
            CustomAlert('Lỗi', 'Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ hàng', [
                {text: 'Bỏ'},
                {text: 'Đăng nhập', onPress: () => this.props.navigation.navigate('LoginView')}
            ])
            return
        }
        
        ActionSheet.show([
            {
                title: 'Chụp ảnh sản phẩm', onPress: () => {
                    try {
                        ImagePicker.openCamera({
                            width: 500,
                            height: 500,
                            cropping: true,
                        }).then(image => {
                            this.props.navigation.navigate('ImageSearchView', { image: { uri: image.path, type: 'image/jpeg', name: 'taobao.jpg' } })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                    
                }
            },
            {
                title: 'Chọn ảnh từ thư viện', onPress: () => {
                    try {
                        ImagePicker.openPicker({
                            width: 500,
                            height: 500,
                            cropping: true,
                        }).then(image => {
                            this.props.navigation.navigate('ImageSearchView', { image: { uri: image.path, type: 'image/jpeg', name: 'taobao.jpg' } })
                        })
                    } catch (error) {
                        console.log(error)
                    }
                    
                }
            },
        ], { title: 'Huỷ' })
    }

    onOpenWeb() {

        let overlayView = (
            <Overlay.PopView
                overlayOpacity={0.6}
                ref={v => this.overlayView = v}
            >
                    <View style={{ alignSelf: 'center', width: Global.ScreenWidth * 0.9, marginTop: Global.ScreenHeight * 0.5 - 240, height: 480, backgroundColor: 'white', borderRadius: 10, padding: 16, alignItems: 'center', justifyContent: 'center' }}>

                        <Text style={{ fontSize: 20, color: 'black', fontWeight: '500', marginBottom: 10, fontFamily: Global.FontName, }}>Chọn nguồn hàng</Text>
                        <ScrollView style={{ width: '100%' }} showsHorizontalScrollIndicator={false}>
                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://1688.com')} style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.AlibabaIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                    <Text style={{ flex: 1, marginLeft: 8, fontSize: 18, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>1688.com</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://m.intl.taobao.com')} style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.TaobaoIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                    <Text style={{ flex: 1, marginLeft: 8, fontSize: 18, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>taobao.com</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://www.tmall.com')} style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.TmallIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                    <Text style={{ flex: 1, marginLeft: 8, fontSize: 18, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>tmall.com</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://m.jd.com')} style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.JDIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                    <Text style={{ flex: 1, marginLeft: 8, fontSize: 18, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>jd.com</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://www.chemistwarehouse.com.au')} style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.ChemistIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                    <Text style={{ flex: 1, marginLeft: 8, fontSize: 18, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>chemistwarehouse</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {this.overlayView && this.overlayView.close(); this.props.navigation.navigate('ManualCartView')}} style={{ width: '100%', flexDirection: 'row', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.LogoIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                    <Text style={{ flex: 1, marginLeft: 8, fontSize: 18, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>Thêm sản phẩm ngoài</Text>
                                </TouchableOpacity>
                        </ScrollView>
                    </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView)
    }

    openContact(){
        this.props.navigation.navigate('ContactView')
    }

    onOpenLink(){
        const {pastedLink} = this.state
        Keyboard.dismiss()
        
        if(pastedLink && pastedLink.length > 0 && pastedLink.indexOf('http') > -1){
            this.onpenWeb(pastedLink)
        }
    }

    onScanCode(){
        this.props.navigation.navigate('HomeScanView')
    }

    onTracking(){
        if(!this.props.user){
            CustomAlert('Lỗi', 'Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ hàng', [
                {text: 'Bỏ'},
                {text: 'Đăng nhập', onPress: () => this.props.navigation.navigate('LoginView')}
            ])
            return
        }

        this.props.navigation.navigate('TrackingAllView')
    }

    onScanTracking(){
        if(!this.props.user){
            CustomAlert('Lỗi', 'Vui lòng đăng nhập để có thể thêm sản phẩm vào giỏ hàng', [
                {text: 'Bỏ'},
                {text: 'Đăng nhập', onPress: () => this.props.navigation.navigate('LoginView')}
            ])
            return
        }

        this.props.navigation.navigate('ScanQRView')
    }

    onSelectChinaSource(){
        ActionSheet.show([
            {title: '1688.com', onPress: this.onpenWeb.bind(this, 'https://1688.com')},
            {title: 'taobao.com', onPress: this.onpenWeb.bind(this, 'https://m.intl.taobao.com')},
            {title: 'tmall.com', onPress: this.onpenWeb.bind(this, 'https://www.tmall.com')},
            {title: 'jd.com', onPress: this.onpenWeb.bind(this, 'https://m.jd.com')}
        ], {title: 'Bỏ'})
    }

    render() {

        const {user} = this.props

        return (
            <View style={styles.container}>
                <Header
                    searchBar
                    searchText={this.state.keyword}
                    searchContainer={{ left: 16, width: Global.ScreenWidth - 62 }}
                    headerChangeText={(text) => this.setState({ keyword: text })}
                    searchPlaceholder='Nhập để tìm kiếm sản phẩm'
                    onEndSubmit={this.onSearch.bind(this)}
                    rightIcon='qrcode'
                    rightAction={this.onScanCode.bind(this)}
                />

                <ScrollView style={{flex: 1, width: '100%'}}>
                    <View style={{ width: '100%', backgroundColor: 'white', marginTop: 10, marginBottom: 10, padding: 16 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Icon name='cart-plus' size={15} color='#333333' />
                            <Text style={{ marginLeft: 8, fontSize: 15, color: '#333333', fontFamily: Global.FontName, }}>Sản phẩm</Text>
                        </View>
                        <ScrollView style={{ width: '100%', marginTop: 12 }} horizontal showsHorizontalScrollIndicator={false}>
                                {/* <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://1688.com')} style={{ marginRight: 16, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.AlibabaIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://m.intl.taobao.com')} style={{ marginRight: 16, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.TaobaoIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://www.tmall.com')} style={{ marginRight: 16, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.TmallIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://m.jd.com')} style={{ marginRight: 16, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.JDIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://www.chemistwarehouse.com.au')} style={{ marginRight: 16, width: 60, height: 60, alignItems: 'center', justifyContent: 'center' }}>
                                    <Image source={Media.ChemistIcon} style={{ width: 60, height: 60 }} resizeMode='contain'/>
                                </TouchableOpacity> */}

                                <TouchableOpacity onPress={this.onSelectChinaSource.bind(this)} style={{ marginRight: 16, width: 60, height: 60, borderRadius: 5, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: 'white', fontFamily: Global.FontName, fontSize: 12, fontWeight: '500'}}>Hàng Trung Quốc</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onpenWeb.bind(this, 'https://www.chemistwarehouse.com.au')} style={{ marginRight: 16, width: 60, height: 60, borderRadius: 5, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: 'white', fontFamily: Global.FontName, fontSize: 12, fontWeight: '500'}}>Hàng Úc</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('ManualCartView')} style={{ marginRight: 16, width: 60, height: 60, borderRadius: 5, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ textAlign: 'center', color: 'white', fontFamily: Global.FontName, fontSize: 12, fontWeight: '500'}}>Thêm sản phẩm ngoài</Text>
                                </TouchableOpacity>
                        </ScrollView>
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <Icon name='tools' size={15} color='#333333' />
                            <Text style={{ marginLeft: 8, fontSize: 15, color: '#333333', fontFamily: Global.FontName, }}>Công cụ</Text>
                        </View>
                        <ScrollView horizontal style={{ width: '100%', marginTop: 8 }} showsHorizontalScrollIndicator={false}>
                            <View style={{ flexDirection: 'row', }}>
                                <TouchableOpacity onPress={this.onImageSearch.bind(this)} style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                        <Icon name='camera' color='white' size={25} />
                                    </View>
                                    <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>Tìm kiếm bằng ảnh</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onScanTracking.bind(this)} style={{ padding: 10, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                        <Icon name='qrcode' color='white' size={25} />
                                    </View>
                                    <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>Quét mã vận đơn</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onTracking.bind(this)} style={{ padding: 10, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                        <Icon name='box-open' color='white' size={25} />
                                    </View>
                                    <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>{'Kiện hàng\n'}</Text>
                                </TouchableOpacity>
                            </View>
                        </ScrollView>

                        {/* <View style={{ flexDirection: 'row', marginTop : 15 }}>
                            <Icon name='paste' size={15} color='#333333' />
                            <Text style={{ marginLeft: 8, fontSize: 15, color: '#333333', fontFamily: Global.FontName, }}>Tìm sản phẩm</Text>
                        </View> */}

                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8}}>
                            <View style={{height: 30, flex: 1, borderRadius: 15, backgroundColor: '#eeeeee', paddingLeft: 15, paddingRight: 15}}>
                                <TextInput 
                                    ref={(ref) => this.pasteInput = ref}
                                    placeholder={'Dán link sản phẩm'}
                                    style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, flex: 1, padding: 0}}
                                    placeholderTextColor='#aaaaaa'
                                    underlineColorAndroid='#00000000'
                                    clearButtonMode='always'
                                    clearTextOnFocus={true}
                                    value={this.state.pastedLink}
                                    onChangeText={(text) => this.setState({pastedLink: text})}
                                />
                            </View>
                            <TouchableOpacity onPress={this.onOpenLink.bind(this)} style={{width: 50, height: 30, borderRadius: 15, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center', marginLeft: 8}}>
                                <Text style={{fontSize: 14, color: 'white', fontFamily: Global.FontName, fontWeight: '500'}}>Mở</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>

                    <View style={{width: '100%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', height: 30, paddingLeft: 10, paddingRight: 10}}>
                            <ScrollView horizontal style={{flex: 1}}>
                                {this.state.currencies.map((item) => {
                                    return(
                                        <View style={{height: 30, padding: 5, textAlign: 'center', justifyContent:'center', borderWidth: 0.5, borderRadius: 3, borderColor: '#aaaaaa', marginLeft: 5, marginRight: 5}}>
                                            <Text style={{fontSize: 11, color: '#333333', fontFamily: Global.FontName}}>{`1 ${item.currency} = ${convertMoney(item.exchange_rate)} VND`}</Text>
                                        </View>
                                    )
                                })}
                            </ScrollView>
                        </View>

                    <View style={{ width: '100%', backgroundColor: 'white', marginTop: 10, marginBottom: 10, padding: 16, paddingTop: 0, paddingBottom: 0 }}>
                        <TouchableOpacity onPress={this.openWallet.bind(this)} style={styles.itemContainer}>
                            <Icon name='wallet' size={15} color='#DF5539' />
                            <Text style={styles.itemText}>Ví Maidzo</Text>
                            <Icon name='chevron-right' size={14} color='#333333' />
                            <View style={styles.separator} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={this.openReports.bind(this)} style={styles.itemContainer}>
                            <Icon name='ticket-alt' size={15} color='#DF5539' />
                            <Text style={styles.itemText}>Danh sách khiếu nại</Text>
                            <Icon name='chevron-right' size={14} color='#333333' />
                            <View style={styles.separator} />
                        </TouchableOpacity>

                        {user &&
                            <TouchableOpacity onPress={this.openSetting.bind(this)} style={styles.itemContainer}>
                                <Icon name='cog' size={15} color='#DF5539' />
                                <Text style={styles.itemText}>Thiết lập tài khoản</Text>
                                <Icon name='chevron-right' size={14} color='#333333' />
                                <View style={styles.separator} />
                            </TouchableOpacity>
                        }

                        <TouchableOpacity onPress={this.openSupport.bind(this)} style={styles.itemContainer}>
                            <Icon name='question-circle' size={15} color='#2CAC9B' />
                            <Text style={styles.itemText}>Trung tâm trợ giúp</Text>
                            <Icon name='chevron-right' size={14} color='#333333' />
                            <View style={styles.separator} />
                        </TouchableOpacity>

                        {!user && 
                            <TouchableOpacity onPress={this.openLogin.bind(this)} style={styles.itemContainer}>
                                <Icon name='user' size={15} color='#DF5539' />
                                <Text style={styles.itemText}>Đăng nhập</Text>
                                <Icon name='chevron-right' size={14} color='#333333' />
                                <View style={styles.separator} />
                            </TouchableOpacity>
                        }
                    </View>
                </ScrollView>

                <ActionButton buttonColor={Global.MainColor}
                    renderIcon={() => <Icon name='phone' size={20} color='white' />}
                >
                    {contacts.map((item) => {
                        return(
                            <ActionButton.Item buttonColor={'blue'} title={item.title} onPress={() => Linking.openURL(item.action)}>
                                <Icon name={item.icon} size={18} color='white' />
                            </ActionButton.Item>
                        )
                    })}
                </ActionButton>
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
