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

class PayOrderView extends React.Component {

    state = {
        amount_refund: 0
    }

    componentDidMount(){
        const need_to_pay = this.props.navigation.getParam('need_to_pay')
        if(need_to_pay < 0){
            this.setState({amount_refund: Math.abs(need_to_pay).toString()})
        }
    }

    onSend() {
        const {amount_refund, note} = this.state

        if(amount_refund.length == 0){
            CustomAlert(null, 'Vui lòng nhập số tiền thanh toán')
            return
        }

        const order_id = this.props.navigation.getParam('order_id')

        fetchUnlengthApi('post', 'page/create_refund/', {order_id: order_id, amount_refund: -Math.abs(parseFloat(amount_refund)), note: note, })
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
            CustomAlert('Thất bại', 'Hoàn tiền đơn hàng không thành công')
        })
    }

    render() {

        const order_id = this.props.navigation.getParam('order_id')

        return (
            <View style={styles.container}>
                <Header
                    title={'Hoàn tiền đơn hàng - ' + order_id}
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={{padding: 10, width: '100%'}}>
                    <Text style={{fontSize: 14, fontWeight: '500', color: 'black', marginTop: 5, fontFamily: Global.FontName}}>{'Số tiền cần hoàn: ' + convertMoney(this.state.amount_refund) + ' đ'}</Text>
                </View>
                
                <View style={[styles.inputContainer]}>
                    <TextInput
                        value={this.state.amount_refund}
                        onChangeText={(text) => this.setState({amount_refund: text})}
                        underlineColorAndroid='#00000000'
                        placeholder='Nhập số tiền cần hoàn'
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
                    <Text style={styles.loginText}>Hoàn tiền</Text>
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