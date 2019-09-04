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
    Clipboard,
    TouchableOpacity,
    RefreshControl,
    ScrollView,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2', alignItems: 'center'
    },
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, decode, getBottomSpace } from 'src/Global';
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {getWalletBalance} from './redux/action'
class WalletBalanceView extends React.Component {

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        this.props.getWalletBalance()
    }

    render() {

        const {user, payment_information, balance, company_information} = this.props

        return (
            <View style={styles.container}>
                <Header
                    title='Ví Maidzo'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <ScrollView style={{flex: 1, width: '100%', marginBottom: getBottomSpace()}}
                    refreshControl={<RefreshControl refreshing={this.props.isFetching} onRefresh={this.onRefresh.bind(this)}/>}>
                        <View style={{backgroundColor: 'white', height: 120, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={{fontSize: 13, color: '#333333', fontFamily: Global.FontName, marginBottom : 8}}>Số dư</Text>
                            <Text style={{color: '#DF5539', fontSize: 20, fontFamily: Global.FontName, fontWeight: '500'}}>{convertMoney(balance) + ' đ'}</Text>
                        </View>
                        {user && 
                            <View style={{backgroundColor: 'white', padding: 16, marginTop : 16, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                <Text style={{fontSize: 18, color: '#777777', fontFamily: Global.FontName, width: '100%'}}>Hướng dẫn nạp tiền vào tài khoản</Text>

                                <Text style={{fontSize: 15, marginTop: 20, color: '#333333', fontFamily: Global.FontName, width: '100%'}}>Nội dung chuyển khoản</Text>
                                <TouchableOpacity onPress={() => Clipboard.setString(`NAP ${user.username} ${user.phone_number}`)} style={{flexDirection: 'row', padding: 8, backgroundColor: '#333333', marginTop : 10, width: '100%', alignItems: 'center'}}>
                                    <Text style={{textAlign: 'center', marginLeft : 30, flex: 1, fontSize: 14, color: 'white', fontFamily: Global.FontName}}>{`NAP ${user.username} ${user.phone_number}`}</Text>
                                    <Icon name='copy' style={{width: 30}} size={20} color='#CECECE'/>
                                </TouchableOpacity>
                                <Text style={{fontSize: 11, marginTop: 8, color: Global.MainColor, fontFamily: Global.FontName, width: '100%'}}>Quý khách vui lòng chuyển số tiền mà quý khách muốn nạp vào hệ thống theo đúng nội dung mẫu như trên. Chúng tôi hoàn toàn không chịu trách nhiệm nếu quý khách chuyển khoản không đúng nội dung trên.</Text>


                                <Text style={{fontSize: 15, marginTop: 20, color: '#333333', fontFamily: Global.FontName, width: '100%'}}>Thông tin ngân hàng</Text>
                                
                                {payment_information &&
                                    <View style={{width: '90%', marginTop : 15, padding: 10, borderWidth: 0.5, borderColor: '#CECECE', borderRadius: 5, alignItems: 'center'}}>
                                        <Image source={Media.VietcombankIcon} style={{width: 100, height: 30, marginTop : 10}} resizeMode='contain'/>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 8, width: '100%'}}>{'Ngân hàng Vietcombank'}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Chủ tài khoản: ${payment_information.vietcombank_name}`}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Số tài khoản: ${payment_information.vietcombank}`}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Chi nhánh: ${payment_information.vietcombank_brand}`}</Text>
                                    </View>
                                }

                                {payment_information &&
                                    <View style={{width: '90%', marginTop : 15, padding: 10, borderWidth: 0.5, borderColor: '#CECECE', borderRadius: 5, alignItems: 'center'}}>
                                        <Image source={Media.TechcombankIcon} style={{width: 100, height: 30, marginTop : 10}} resizeMode='contain'/>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 8, width: '100%'}}>{'Ngân hàng Techcombank'}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Chủ tài khoản: ${payment_information.techcombank_name}`}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Số tài khoản: ${payment_information.techcombank}`}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Chi nhánh: ${payment_information.techcombank_brand}`}</Text>
                                    </View>
                                }

                                {company_information &&
                                    <View style={{width: '90%', marginTop : 15, padding: 10, borderWidth: 0.5, borderColor: '#CECECE', borderRadius: 5, alignItems: 'center'}}>
                                        <Text style={{fontSize: 16, color: Global.MainColor, fontFamily: Global.FontName, marginTop : 5, marginBottom: 3, width: '100%'}}>{'Thanh toán trực tiếp tại kho hàng'}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Địa chỉ: ${company_information.Address}`}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Hotline1: ${company_information.Hotline1}`}</Text>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Hotline2: ${company_information.Hotline2}`}</Text>
                                    </View>
                                }
                            </View>
                        }
                </ScrollView>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.auth.user,
        balance: state.wallet.balance,
        payment_information: state.setting.payment_information,
        company_information: state.setting.company_information,
        isFetching: state.wallet.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getWalletBalance: () => dispatch(getWalletBalance())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletBalanceView);
