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
    TouchableWithoutFeedback,
    Linking,
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
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import { getWalletBalance } from 'Wallets/redux/action'
import { getSettings } from 'Setting/redux/action'
import { getCart } from 'Carts/redux/action'
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { ScrollView } from 'react-native-gesture-handler';
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet';
import ImagePicker from 'react-native-image-crop-picker'
import { Overlay } from 'teaset'
import firebase from 'react-native-firebase'

class HomeView extends React.Component {

    state = {
        keyword: ''
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
        });
    }

    componentWillUnmount(){
        this.removeNotificationDisplayedListener();
        this.removeNotificationListener();
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
        this.props.navigation.navigate('WalletBalanceView')
    }

    openSupport() {
        this.props.navigation.navigate('SupportView')
    }

    openReports() {
        this.props.navigation.navigate('ReportListView')
    }

    onSearch() {
        if (this.state.keyword.length == 0) {
            return
        }

        this.props.navigation.navigate('HomeSearchView', { keyword: this.state.keyword })
    }

    onImageSearch() {
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

    render() {

        return (
            <View style={styles.container}>
                <Header
                    searchBar
                    searchText={this.state.keyword}
                    searchContainer={{ left: 16, width: Global.ScreenWidth - 32 }}
                    headerChangeText={(text) => this.setState({ keyword: text })}
                    searchPlaceholder='Nhập từ khoá để tìm kiếm sản phẩm'
                    onEndSubmit={this.onSearch.bind(this)}
                />

                <View style={{ width: '100%', backgroundColor: 'white', marginTop: 10, marginBottom: 10, padding: 16 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Icon name='tools' size={15} color='#333333' />
                        <Text style={{ marginLeft: 8, fontSize: 15, color: '#333333', fontFamily: Global.FontName, }}>Công cụ</Text>
                    </View>
                    <ScrollView horizontal style={{ width: '100%', marginTop: 8 }} showsHorizontalScrollIndicator={false}>
                        <View style={{ flexDirection: 'row', }}>
                            <TouchableOpacity onPress={this.onOpenWeb.bind(this)} style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                    <Icon name='cart-plus' color='white' size={25} />
                                </View>
                                <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>Tìm sản phẩm</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={this.onImageSearch.bind(this)} style={{ padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                    <Icon name='camera' color='white' size={25} />
                                </View>
                                <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>Tìm kiếm bằng ảnh</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ScanQRView')} style={{ padding: 10, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                    <Icon name='qrcode' color='white' size={25} />
                                </View>
                                <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>Quét mã vận đơn</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('TrackingAllView')} style={{ padding: 10, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ width: 60, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 30, backgroundColor: Global.MainColor }}>
                                    <Icon name='box-open' color='white' size={25} />
                                </View>
                                <Text style={{ width: 60, textAlign: 'center', fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop: 4 }}>{'Kiện hàng\n'}</Text>
                            </TouchableOpacity>
                        </View>
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

                    <TouchableOpacity onPress={this.openSetting.bind(this)} style={styles.itemContainer}>
                        <Icon name='cog' size={15} color='#DF5539' />
                        <Text style={styles.itemText}>Thiết lập tài khoản</Text>
                        <Icon name='chevron-right' size={14} color='#333333' />
                        <View style={styles.separator} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openSupport.bind(this)} style={styles.itemContainer}>
                        <Icon name='question-circle' size={15} color='#2CAC9B' />
                        <Text style={styles.itemText}>Trung tâm trợ giúp</Text>
                        <Icon name='chevron-right' size={14} color='#333333' />
                        <View style={styles.separator} />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openContact.bind(this)} style={styles.itemContainer}>
                        <Icon name='phone' size={15} color='#DF5539' />
                        <Text style={styles.itemText}>Liên hệ</Text>
                        <Icon name='chevron-right' size={14} color='#333333' />
                    </TouchableOpacity>
                </View>
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
