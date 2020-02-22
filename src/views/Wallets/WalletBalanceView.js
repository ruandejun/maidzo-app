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
    buttonContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%', borderBottomWidth: 4, backgroundColor: 'white',
    },
    buttonText: {fontSize: 14, fontWeight: '500', color: '#333333', fontFamily: Global.FontName, }
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, decode, getBottomSpace } from 'src/Global';
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {getWalletBalance} from './redux/action'

class WalletBalanceView extends React.Component {

    state = {
        viewMode : 'general'
    }

    componentDidMount(){
        this.onRefresh()
    }

    onRefresh(){
        if(this.props.user){
            this.props.getWalletBalance(this.props.user.username)
        }
    }

    changeMode(mode){
        this.setState({viewMode: mode})
    }

    openDepositDetail(){
        this.props.navigation.navigate('DepositListView')
    }

    openPayDetail(){
        this.props.navigation.navigate('PayListView')
    }

    openRefundDetail(){
        this.props.navigation.navigate('RefundListView')
    }

    render() {

        const {user, payment_information, balance, company_information, walletDetail} = this.props
        const {viewMode} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title='Quản lý ví'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={{widht: '100%', height : 40, flexDirection: 'row', }}>
                    <TouchableOpacity onPress={this.changeMode.bind(this, 'general')} style={[styles.buttonContainer, { borderBottomColor: viewMode == 'general' ? Global.MainColor : 'white'}]}>
                        <Text style={styles.buttonText}>Thông Tin</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.changeMode.bind(this, 'detail')} style={[styles.buttonContainer, { borderBottomColor: viewMode != 'general' ? Global.MainColor : 'white'}]}>
                        <Text style={styles.buttonText}>Chi tiết</Text>
                    </TouchableOpacity>
                </View>
                {viewMode == 'general' &&
                    <ScrollView style={{flex: 1, marginTop : 8, width: '100%', marginBottom: getBottomSpace()}}
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
                                            <TouchableOpacity onPress={() => Clipboard.setString(`${payment_information.vietcombank}`)} style={{flexDirection: 'row', marginTop : 5, width: '100%', alignItems: 'center'}}>
                                                <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, flex: 1}}>{`Số tài khoản: ${payment_information.vietcombank}`}</Text>
                                                <Icon name='copy' style={{width: 30}} size={20} color='#CECECE'/>
                                            </TouchableOpacity>
                                            <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Chi nhánh: ${payment_information.vietcombank_brand}`}</Text>
                                        </View>
                                    }

                                    {payment_information &&
                                        <View style={{width: '90%', marginTop : 15, padding: 10, borderWidth: 0.5, borderColor: '#CECECE', borderRadius: 5, alignItems: 'center'}}>
                                            <Image source={Media.TechcombankIcon} style={{width: 100, height: 30, marginTop : 10}} resizeMode='contain'/>
                                            <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 8, width: '100%'}}>{'Ngân hàng Techcombank'}</Text>
                                            <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, marginTop : 5, width: '100%'}}>{`Chủ tài khoản: ${payment_information.techcombank_name}`}</Text>
                                            <TouchableOpacity onPress={() => Clipboard.setString(`${payment_information.techcombank}`)} style={{flexDirection: 'row', marginTop : 5, width: '100%', alignItems: 'center'}}>
                                                <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName, flex: 1}}>{`Số tài khoản: ${payment_information.techcombank}`}</Text>
                                                <Icon name='copy' style={{width: 30}} size={20} color='#CECECE'/>
                                            </TouchableOpacity>
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
                }
                {viewMode == 'detail' &&
                    <ScrollView style={{flex: 1, marginTop : 8, width: '100%', marginBottom: getBottomSpace()}}
                        refreshControl={<RefreshControl refreshing={this.props.isFetching} onRefresh={this.onRefresh.bind(this)}/>}>
                            {walletDetail && walletDetail.statistics_deposits && 
                                <TouchableOpacity onPress={this.openDepositDetail.bind(this)} style={{backgroundColor: 'white', padding: 16, marginTop : 16, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row', paddingRight: 16, width: '100%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, fontWeight: '500', color: '#777777', fontFamily: Global.FontName, width: '100%', marginBottom: 5}}>Thông tin nạp tiền</Text>
                                        <Icon name='chevron-right' color={Global.MainColor} size={16}/>
                                    </View>

                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng tiền đã nạp</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.statistics_deposits.sum_amount) + ' đ'}</Text>
                                    </View>
                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng số lần đã nạp</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.statistics_deposits.count)}</Text>
                                    </View>
                                </TouchableOpacity>
                            }

                            {walletDetail && walletDetail.statistics_pays && 
                                <TouchableOpacity onPress={this.openPayDetail.bind(this)} style={{backgroundColor: 'white', padding: 16, marginTop : 16, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row', paddingRight: 16, width: '100%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, fontWeight: '500', color: '#777777', fontFamily: Global.FontName, width: '100%', marginBottom: 5}}>Thông tin thanh toán</Text>
                                        <Icon name='chevron-right' color={Global.MainColor} size={16}/>
                                    </View>

                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng thanh toán</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.statistics_pays.sum_amount) + ' đ'}</Text>
                                    </View>
                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng số lần thanh toán</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.statistics_pays.count)}</Text>
                                    </View>
                                </TouchableOpacity>
                            }

                            {walletDetail && walletDetail.statistics_refunds && 
                                <TouchableOpacity onPress={this.openRefundDetail.bind(this)} style={{backgroundColor: 'white', padding: 16, marginTop : 16, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row', paddingRight: 16, width: '100%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, fontWeight: '500', color: '#777777', fontFamily: Global.FontName, width: '100%', marginBottom: 5}}>Thông tin hoàn tiền</Text>
                                        <Icon name='chevron-right' color={Global.MainColor} size={16}/>
                                    </View>

                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng hoàn tiền</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.statistics_refunds.sum_amount) + ' đ'}</Text>
                                    </View>
                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng số lần hoàn tiền</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.statistics_refunds.count)}</Text>
                                    </View>
                                </TouchableOpacity>
                            }

                            {walletDetail && walletDetail.sum_list_order && 
                                <TouchableOpacity onPress={this.openPayDetail.bind(this)} style={{backgroundColor: 'white', padding: 16, marginTop : 16, width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                                    <View style={{flexDirection: 'row', paddingRight: 16, width: '100%', alignItems: 'center'}}>
                                        <Text style={{fontSize: 14, fontWeight: '500', color: '#777777', fontFamily: Global.FontName, width: '100%', marginBottom: 5}}>Thông tin đơn hàng</Text>
                                        <Icon name='chevron-right' color={Global.MainColor} size={16}/>
                                    </View>

                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng thanh toán thêm</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.sum_list_order.sum_need_to_pay) + ' đ'}</Text>
                                    </View>
                                    <View style={{width: '100%', marginTop : 10, flexDirection: 'row', alignItems: 'center', jusitfyContent: 'space-between', padding: 8, borderBottomWidth: 1, borderBottomColor: '#CECECE'}}>
                                        <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>Tổng số đơn hàng</Text>
                                        <Text style={{fontSize: 16, color: 'black', fontFamily: Global.FontName, flex: 1, textAlign: 'right'}}>{convertMoney(walletDetail.sum_list_order.sum_count_order)}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                    </ScrollView>
                }
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.auth.user,
        balance: state.wallet.balance,
        walletDetail: state.wallet.detail,
        payment_information: state.setting.payment_information,
        company_information: state.setting.company_information,
        isFetching: state.wallet.isFetching
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getWalletBalance: (username) => dispatch(getWalletBalance(username))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletBalanceView);
