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
import Global, { Media } from 'src/Global';
import NavigationService from 'actions/NavigationService'
import Header from 'components/Header'
import { fetchApiLogin } from 'actions/api'

class ForgotPasswordView extends React.Component {

    state = {
        email: ''
    }

    onSend() {
        if(this.state.email.length == 0){
            CustomAlert(null, 'Vui lòng nhập địa chỉ email chính xác')
            return
        }

        fetchApiLogin('post', 'api/user/auth/resetPasswordViaEmail/', {email: this.state.email})
        .then((data) => {
            console.log(data)
            if(data.success){
                CustomAlert(null, 'Đã gửi email để lấy lại mật khẩu. Vui lòng kiểm tra email của bạn!')
            } else {
                CustomAlert(null, data.error)
            }
        })
        .catch((error) => {
            console.log(error)
        })
    }

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title='Thiết lập tài khoản'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <Text style={{fontSize: 14, textAlign: 'center', marginBottom : 15, width: '90%', alignSelf: 'center', marginTop : 20, fontFamily: Global.FontName, color: '#333333'}}>Vui lòng nhập địa chỉ email để lấy lại mật khẩu</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={this.state.email}
                        onChangeText={(text) => this.setState({ email: text })}
                        underlineColorAndroid='#00000000'
                        placeholder='Địa chỉ email'
                        placeholderTextColor='#CECECE'
                        keyboardType='email-address'
                        style={styles.inputText} />
                </View>
                <TouchableOpacity onPress={this.onSend.bind(this)} style={[styles.buttonContainer, { backgroundColor: Global.MainColor }]}>
                    <Text style={styles.loginText}>Gửi yêu cầu lấy lại mật khẩu</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapPropsToState = (state, ownProps) => {
    return {
        isFetching: state.auth.isFetching
    }
}

const mapDispatchToState = dispatch => {
    return {
    }
}

export default connect(mapPropsToState, mapDispatchToState)(ForgotPasswordView);


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f6f6f6'
    },
    inputContainer: {
        height: 50,
        borderRadius: 25,
        width: 300,
        padding: 5,
        paddingLeft: 15, paddingRight: 15,
        backgroundColor: 'white',
        shadowColor: '#A8A8A8',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: {
            height: 1,
            width: 0,
        },
        elevation: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10
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