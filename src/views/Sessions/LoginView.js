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
    TouchableWithoutFeedback,
    Alert
} from 'react-native'


const styles = StyleSheet.create({
    container: {
        flex : 1,
        alignItems : 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    headerContainer: {
        backgroundColor: '#F6F6F6',
        flexDirection: 'row',
        height: 60 + getStatusBarHeight(),
        paddingTop: getStatusBarHeight(),
        alignItems: 'center', justifyContent: 'center',
        paddingLeft: 30, paddingRight: 30
    },
    modeContainer: {
        flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomColor: Global.MainColor,
        height: 60
    },
    modeText: {
        fontSize: 25, color: '#7F7F7F', fontFamily: Global.FontName
    },
    inputText: {
        fontSize: 18, color: 'black', fontFamily: Global.FontName, padding: 0,
    },
    inputContainer: {
        width: '100%',
        padding: 16,
        borderBottomWidth: 1, borderBottomColor: '#CCCCCC'
    },
    buttonContainer: {
        alignItems: 'center', justifyContent: 'center', margin: 16, width: Global.ScreenWidth - 16, backgroundColor: Global.MainColor,
        height: 50
    },
    buttonText: {
        fontSize: 20, color: 'white', fontFamily: Global.FontName
    }
 })

import {connect} from 'react-redux'
import Global, {Media, getStatusBarHeight, getBottomSpace} from 'src/Global';
import {unmountError, login, register} from './redux/action'
import CustomAlert from 'components/CustomAlert'

class LoginView extends React.Component{

   state = {
       email: '',
       username: '',
       verifyPassword: '',
       facebook: '',
       phone: '',
       password: '',
       isRegister: false
   }

   onForgotPassword(){
    this.props.navigation.navigate('ForgotPasswordView')
   }

   componentWillUnmount() {
    this.props.unmountError();
   }

   componentWillMount() {
    this.props.unmountError();
   }

    onLogin(){
        Keyboard.dismiss();
        
        const {username, password} = this.state

        if(username.length == 0 || password.length == 0){
            CustomAlert('Vui lòng nhập đầy đủ thông tin')
            return
        }

        this.props.login(username, password)
    }

    onRegister(){
        Keyboard.dismiss();
        
        const {username, password, verifyPassword, phone, email, facebook} = this.state

        if(username.length == 0 || password.length == 0 || verifyPassword.length == 0 || email.length == 0 || phone.length == 0){
            CustomAlert('Vui lòng nhập đầy đủ thông tin')
            return
        }

        if(verifyPassword != password){
            CustomAlert('Vui lòng nhập mật khẩu trùng nhau')
            return
        }

        this.props.register(username, email, facebook, phone, password, verifypassword)
    }

   render(){

    const {username, password, verifyPassword, phone, email, facebook, isRegister} = this.state

       return(
           <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
               <View style={styles.container}>
                    <View style={styles.headerContainer}>
                        <TouchableOpacity onPress={() => this.setState({isRegister: false})} style={[styles.modeContainer, {borderBottomWidth: isRegister ? 0 : 1}]}>
                            <Text style={styles.modeText}>Đăng nhập</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({isRegister: true})} style={[styles.modeContainer, {borderBottomWidth: isRegister ? 1 : 0}]}>
                            <Text style={styles.modeText}>Đăng ký</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            value={username}
                            onChangeText={(text) => this.setState({username: text})}
                            underlineColorAndroid='#00000000'
                            placeholder='Tên đăng nhập'
                            placeholderTextColor='#CECECE'
                            autoCapitalize='none'
                            style={styles.inputText}/>
                    </View>
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput 
                                value={email}
                                onChangeText={(text) => this.setState({email: text})}
                                underlineColorAndroid='#00000000'
                                placeholder='Địa chỉ email*'
                                placeholderTextColor='#CECECE'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                style={styles.inputText}/>
                        </View>
                    }
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput 
                                value={phone}
                                onChangeText={(text) => this.setState({phone: text})}
                                underlineColorAndroid='#00000000'
                                placeholder='Số điện thoại*'
                                placeholderTextColor='#CECECE'
                                keyboardType='phone-pad'
                                style={styles.inputText}/>
                        </View>
                    }
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput 
                                value={phone}
                                onChangeText={(text) => this.setState({phone: text})}
                                underlineColorAndroid='#00000000'
                                placeholder='Facebook'
                                placeholderTextColor='#CECECE'
                                style={styles.inputText}/>
                        </View>
                    }
                    <View style={styles.inputContainer}>
                        <TextInput 
                            value={password}
                            onChangeText={(text) => this.setState({password: text})}
                            underlineColorAndroid='#00000000'
                            placeholder='Mật khẩu*'
                            secureTextEntry
                            placeholderTextColor='#CECECE'
                            style={styles.inputText}/>
                    </View>
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput 
                                value={verifyPassword}
                                onChangeText={(text) => this.setState({verifyPassword: text})}
                                underlineColorAndroid='#00000000'
                                placeholder='Nhập lại mật khẩu*'
                                secureTextEntry
                                placeholderTextColor='#CECECE'
                                style={styles.inputText}/>
                        </View>
                    }

                    {!isRegister &&
                        <TouchableOpacity onPress={this.onLogin.bind(this)} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Đăng nhập</Text>
                        </TouchableOpacity>
                    }
                    {isRegister &&
                        <TouchableOpacity onPress={this.onRegister.bind(this)} style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>Đăng ký</Text>
                        </TouchableOpacity>
                    }

                    <View style={{flex: 1}}/>

                    {this.props.isFetching &&
                        <View style={[StyleSheet.absoluteFill, {alignItems : 'center', justifyContent : 'center', backgroundColor: '#00000044'}]}>
                            <Image source={Media.LoadingIcon} style={{width : 30, height : 30}} resizeMode='contain'/>
                        </View>
                    }
                </View>
           </TouchableWithoutFeedback>
       )
   }
}

const mapPropsToState = (state, ownProps) => {
   return {
        user: state.auth.user,
        isFetching : state.auth.isFetching
   }
 }
 
 const mapDispatchToState = dispatch => {
   return {
    login : (username, password) => dispatch(login(username, password)),
    register : (username, email, facebook, phone, password, verifypassword) => dispatch(register(username, email, facebook, phone, password, verifypassword)),
    unmountError : () => dispatch(unmountError())
   }
 }
 
 export default connect(mapPropsToState, mapDispatchToState)(LoginView);