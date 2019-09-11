/**
 * @flow
 */

import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native'

import { SafeAreaView } from 'react-navigation'
import { connect } from 'react-redux'
import Global, { Media, convertMoney } from 'src/Global';
import NavigationService from 'actions/NavigationService'
import {Checkbox} from 'teaset'
import Header from 'components/Header'
import { fetchApi, fetchUnlengthApi } from 'actions/api'
import Icon from 'react-native-vector-icons/FontAwesome5'

class PayOrderView extends React.Component {

    state = {
        amount_pay: 0,
        pay_mode: 0
    }

    onSend() {
        const {amount_pay, note} = this.state

        if(amount_pay.length == 0){
            CustomAlert(null, 'Vui lòng nhập số tiền thanh toán')
            return
        }

        const order_id = this.props.navigation.getParam('order_id')

        fetchUnlengthApi('post', 'page/order_pay/', {order_id: order_id, amount_pay: parseFloat(amount_pay), note: note, })
        .then((data) => {
            // console.log(data)
            if(data.success){
                CustomAlert('Thành công', data.msg, [
                    {text: 'Quay lại', onPress: () => this.props.navigation.goBack()}
                ])
            } else {
                CustomAlert('Thất bại', data.msg)
            }
        })
        .catch((error) => {
            console.log(error)
            CustomAlert('Thất bại', 'Thanh toán đơn hàng không thành công')
        })
    }

    render() {

        const order_id = this.props.navigation.getParam('order_id')
        const need_to_pay = this.props.navigation.getParam('need_to_pay')
        const payment_left = this.props.navigation.getParam('payment_left')

        const {pay_mode} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title={'Thanh toán đơn hàng - ' + order_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={{padding: 10, width: '100%'}}>
                    <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>{'Cần cọc thêm: ' + convertMoney(need_to_pay) + ' đ'}</Text>
                    <Text style={{fontSize: 14, color: '#333333', fontFamily: Global.FontName}}>{'Tổng còn thiếu: ' + convertMoney(payment_left) + ' đ'}</Text>
                    <Text style={{fontSize: 14, fontWeight: '500', color: 'black', marginTop: 5, fontFamily: Global.FontName}}>{'Số tiền thanh toán: ' + convertMoney(this.state.amount_pay) + ' đ'}</Text>
                </View>
                
                <View style={{width: '100%', padding: 10, flexDirection: 'row'}}>
                    <Checkbox
                                        title={'Cần cọc thêm'}
                                        size='md'
                                        checked={pay_mode == 1}
                                        onChange={(value) => {
                                            if(value){
                                                this.setState({pay_mode : 1, amount_pay : need_to_pay})
                                            } else {
                                                this.setState({pay_mode : 0})
                                            }
                                        }}
                                        checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                        uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                                        style={{width: Global.ScreenWidth * 0.5 - 20}}
                                    />
                                    <Checkbox
                                        title={'Tổng còn thiếu'}
                                        size='md'
                                        checked={pay_mode == 2}
                                        onChange={(value) => {
                                            if(value){
                                                this.setState({pay_mode : 2, amount_pay : payment_left})
                                            } else {
                                                this.setState({pay_mode : 0})
                                            }
                                        }}
                                        checkedIcon={<Icon name='check-square' size={14} color={Global.MainColor}/>}
                                        uncheckedIcon={<Icon name='square' size={14} color={'#333333'}/>}
                                        style={{width: Global.ScreenWidth * 0.5 - 20}}
                                    />
                </View>
                
                <View style={[styles.inputContainer]}>
                    <TextInput
                        value={this.state.amount_pay}
                        onChangeText={(text) => this.setState({amount_pay: text})}
                        underlineColorAndroid='#00000000'
                        placeholder='Nhập số tiền thanh toán'
                        placeholderTextColor='#CECECE'
                        keyboardType='decimal-pad'
                        style={[styles.inputText]} />
                </View>

                <View style={[styles.inputContainer, {height: 80}]}>
                    <TextInput
                        value={this.state.note}
                        onChangeText={(text) => this.setState({note: text})}
                        underlineColorAndroid='#00000000'
                        placeholder='Ghi chú'
                        placeholderTextColor='#CECECE'
                        multiline
                        style={[styles.inputText, {height: 80, textAlignVertical: 'top'}]} />
                </View>
                <TouchableOpacity onPress={this.onSend.bind(this)} style={[styles.buttonContainer, { backgroundColor: Global.MainColor }]}>
                    <Text style={styles.loginText}>Thanh Toán</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapPropsToState = (state, ownProps) => {
    return {
        isFetching: state.auth.isFetching,
        user: state.auth.user
    }
}

const mapDispatchToState = dispatch => {
    return {
    }
}

export default connect(mapPropsToState, mapDispatchToState)(PayOrderView);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f6f6f6'
    },
    inputContainer: {
        height: 50,
        width: '100%',
        padding: 5,
        paddingLeft: 15, paddingRight: 15,
        backgroundColor: 'white',
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#CECECE'
    },
    inputText: {
        padding: 0,
        fontFamily: Global.FontName,
        color: 'black',
        fontSize: 15
    },
    buttonContainer: {
        height: 50,
        borderRadius: 25,
        width: 300,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15
    },
    loginText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        fontFamily: Global.FontName,
        textAlign: 'center',
        flex: 1
    }
})