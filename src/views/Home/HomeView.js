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
        position: 'absolute', left : 0, right: 0, bottom: 0, height: 1, backgroundColor: '#CECECE'
    }
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getStatusBarHeight } from 'src/Global';
import {getWalletBalance} from 'Wallets/redux/action'
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'

class HomeView extends React.Component {

    componentDidMount(){
        this.props.getWalletBalance()
    }

    onpenWeb(){
        this.props.navigation.navigate('TaobaoWebView', {url: 'https://taobao.com'})
    }

    openSetting(){
        this.props.navigation.navigate('SettingView')
    }

    openWallet(){
        this.props.navigation.navigate('WalletBalanceView')
    }

    openSupport(){
        this.props.navigation.navigate('SupportView')
    }

    render() {

        const {user} = this.props

        return (
            <View style={styles.container}>
                <Header
                    title='Trang chủ'
                />

                <View style={{width: '100%', backgroundColor: 'white', marginTop : 10, marginBottom: 10, padding: 16}}>
                    <View style={{flexDirection: 'row'}}>
                        <Icon name='store' size={15} color='#333333'/>
                        <Text style={{marginLeft: 8, fontSize: 15, color: '#333333', fontFamily: Global.FontName,}}>Đặt mua sản phẩm</Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop : 8}}>
                        <TouchableOpacity onPress={this.onpenWeb.bind(this)} style={{padding: 10, alignItems: 'center', justifyContent: 'center'}}>
                            <Image source={Media.TaobaoIcon} style={{width: 60, height: 60}}/>
                            <Text style={{fontSize: 13, color: 'black', fontFamily: Global.FontName, marginTop : 4}}>taobao.com</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{width: '100%', backgroundColor: 'white', marginTop : 10, marginBottom: 10, padding: 16, paddingTop: 0, paddingBottom: 0}}>
                    <TouchableOpacity onPress={this.openWallet.bind(this)} style={styles.itemContainer}>
                        <Icon name='wallet' size={15} color='#DF5539'/>
                        <Text style={styles.itemText}>Ví Maidzo</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
                        <View style={styles.separator}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openSetting.bind(this)} style={styles.itemContainer}>
                        <Icon name='cog' size={15} color='#DF5539'/>
                        <Text style={styles.itemText}>Thiết lập tài khoản</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
                        <View style={styles.separator}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openSupport.bind(this)} style={styles.itemContainer}>
                        <Icon name='question-circle' size={15} color='#2CAC9B'/>
                        <Text style={styles.itemText}>Trung tâm trợ giúp</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
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
        getWalletBalance: () => dispatch(getWalletBalance())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(HomeView);
