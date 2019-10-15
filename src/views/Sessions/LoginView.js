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
        flex: 1,
        alignItems: 'center',
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
        width: '90%',
        padding: 16,
        borderBottomWidth: 1, borderBottomColor: Global.MainColor,
    },
    buttonContainer: {
        alignItems: 'center', justifyContent: 'center', margin: 16, width: '90%', backgroundColor: Global.MainColor,
        height: 50, borderRadius: 5, marginTop: 30
    },
    buttonText: {
        fontSize: 20, color: 'white', fontFamily: Global.FontName
    },
    startText: {
        width: '90%', fontSize: 14, color: Global.MainColor, fontFamily: Global.FontName, textAlign: 'center'
    }
})

import { connect } from 'react-redux'
import Global, { Media, getStatusBarHeight, getBottomSpace } from 'src/Global';
import { unmountError, login, register } from './redux/action'
import { fetchApiLogin } from 'actions/api'
import CustomAlert from 'components/CustomAlert'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

class LoginView extends React.Component {

    state = {
        email: '',
        username: '',
        verifyPassword: '',
        facebook: '',
        phone: '',
        password: '',
        isRegister: false,
        isStart: true,
        searchKeyword: ''
    }

    componentDidMount() {
        const username = this.props.navigation.getParam('username')
        if (username) {
            this.setState({ username: username })
        }
    }

    onForgotPassword() {
        this.props.navigation.navigate('ForgotPasswordView')
    }

    componentWillUnmount() {
        this.props.unmountError();
    }

    componentWillMount() {
        this.props.unmountError();
    }

    onLogin() {
        Keyboard.dismiss();

        const { username, password } = this.state

        if (username.length == 0 || password.length == 0) {
            CustomAlert('Vui lòng nhập đầy đủ thông tin')
            return
        }

        this.props.login(username, password)
    }

    onRegister() {
        Keyboard.dismiss();

        const { username, password, verifyPassword, phone, email, facebook } = this.state

        if (username.length == 0 || password.length == 0 || verifyPassword.length == 0 || email.length == 0 || phone.length == 0) {
            CustomAlert('Vui lòng nhập đầy đủ thông tin')
            return
        }

        if (verifyPassword != password) {
            CustomAlert('Vui lòng nhập mật khẩu trùng nhau')
            return
        }

        this.props.register(username, email, facebook, phone, password, verifyPassword)
    }

    onStart() {
        const { searchKeyword } = this.state

        fetchApiLogin('get', `page/get_username/`, { key: searchKeyword })
            .then((data) => {
                // console.log(data)
                if (data && data.length > 0) {
                    this.setState({ isStart: false, isRegister: false, username: data[0] })
                } else {
                    CustomAlert('Chưa tồn tại', 'Tài khoản của bạn chưa tồn tại', [
                        { text: 'Quay lại', },
                        {
                            text: 'Đăng ký', onPress: () => {
                                this.setState({ isRegister: true, isStart: false, username: '' })
                            }
                        }
                    ])
                }
            })
            .catch((error) => {
                console.log(error)
                CustomAlert('Chưa tồn tại', 'Tài khoản của bạn chưa tồn tại', [
                    { text: 'Quay lại', },
                    {
                        text: 'Đăng ký', onPress: () => {
                            this.setState({ isRegister: true, isStart: false, username: '' })
                        }
                    }
                ])
            })
    }

    render() {

        const { isStart, username, password, verifyPassword, phone, email, searchKeyword, facebook, isRegister } = this.state

        if (isStart) {
            return (
                <View style={styles.container}>
                    <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, paddingBottom: 140, justifyContent: 'center', alignItems: 'center', width: '100%' }} style={{ flex: 1, width: '100%', paddingTop: getStatusBarHeight() }}>
                        <Image source={Media.LogoFull} style={{ width: 180, height: 60, marginBottom: 60 }} resizeMode='contain' />

                        <Text style={styles.startText}>Địa chỉ email hoặc tên đăng nhập</Text>

                        <View style={styles.inputContainer}>
                            <TextInput
                                value={searchKeyword}
                                onChangeText={(text) => this.setState({ searchKeyword: text })}
                                underlineColorAndroid='#00000000'
                                placeholder='Địa chỉ email hoặc tên đăng nhập'
                                placeholderTextColor='#CECECE'
                                autoCapitalize='none'
                                autoFocus
                                autoCorrect={false}
                                style={styles.inputText} />
                        </View>

                        <TouchableOpacity onPress={this.onStart.bind(this)} style={[styles.buttonContainer, { marginTop: 30 }]}>
                            <Text style={styles.buttonText}>Tiếp</Text>
                        </TouchableOpacity>
                    </KeyboardAwareScrollView>

                    <Text onPress={() => this.setState({ isRegister: true, isStart: false })} style={{ fontSize: 14, color: '#333333', position: 'absolute', bottom: 15 + getBottomSpace(), left: 0, right: 0, textAlign: 'center', marginTop: 10, fontFamily: Global.FontName, }} >{'Bạn chưa có tài khoản? '}
                        <Text style={{ textDecorationLine: 'underline', color: Global.MainColor }}>Đăng ký</Text>
                    </Text>

                    {this.state.isFetching &&
                        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000044' }]}>
                            <Image source={Media.LoadingIcon} style={{ width: 30, height: 30 }} resizeMode='contain' />
                        </View>
                    }
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <KeyboardAwareScrollView contentContainerStyle={{ flex: 1, paddingBottom: 140, justifyContent: 'center', alignItems: 'center', width: '100%' }} style={{ flex: 1, width: '100%', paddingTop: getStatusBarHeight() }}>

                    <Image source={Media.LogoFull} style={{ width: 180, height: 60, marginBottom: 30 }} resizeMode='contain' />

                    {!isRegister &&
                        <Text style={[styles.inputText, { marginBottom: 30 }]}>{'Đăng nhập với tài khoản: '}
                            <Text style={{ color: Global.MainColor }}>{username}</Text>
                        </Text>
                    }
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={username}
                                onChangeText={(text) => this.setState({ username: text })}
                                underlineColorAndroid='#00000000'
                                placeholder='Tên đăng nhập'
                                autoCorrect={false}
                                placeholderTextColor='#CECECE'
                                autoCapitalize='none'
                                style={styles.inputText} />
                        </View>
                    }
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={email}
                                onChangeText={(text) => this.setState({ email: text })}
                                underlineColorAndroid='#00000000'
                                placeholder='Địa chỉ email*'
                                placeholderTextColor='#CECECE'
                                keyboardType='email-address'
                                autoCapitalize='none'
                                autoCorrect={false}
                                style={styles.inputText} />
                        </View>
                    }
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={phone}
                                onChangeText={(text) => this.setState({ phone: text })}
                                underlineColorAndroid='#00000000'
                                placeholder='Số điện thoại*'
                                placeholderTextColor='#CECECE'
                                keyboardType='phone-pad'
                                style={styles.inputText} />
                        </View>
                    }
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={facebook}
                                onChangeText={(text) => this.setState({ facebook: text })}
                                underlineColorAndroid='#00000000'
                                placeholder='Facebook'
                                placeholderTextColor='#CECECE'
                                style={styles.inputText} />
                        </View>
                    }
                    <View style={styles.inputContainer}>
                        <TextInput
                            value={password}
                            onChangeText={(text) => this.setState({ password: text })}
                            underlineColorAndroid='#00000000'
                            placeholder='Mật khẩu*'
                            secureTextEntry
                            placeholderTextColor='#CECECE'
                            autoCapitalize='none'
                            style={styles.inputText} />
                    </View>
                    {isRegister &&
                        <View style={styles.inputContainer}>
                            <TextInput
                                value={verifyPassword}
                                onChangeText={(text) => this.setState({ verifyPassword: text })}
                                underlineColorAndroid='#00000000'
                                placeholder='Nhập lại mật khẩu*'
                                secureTextEntry
                                autoCapitalize='none'
                                placeholderTextColor='#CECECE'
                                style={styles.inputText} />
                        </View>
                    }

                    {!isRegister &&
                        <Text style={{ fontSize: 14, color: '#333333', marginTop: 10, fontFamily: Global.FontName, textDecorationLine: 'underline' }} onPress={() => this.props.navigation.navigate('ForgotPasswordView')}>Quên mật khẩu?</Text>
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

                </KeyboardAwareScrollView>

                {!isStart &&
                    <Text onPress={() => this.setState({ isStart: true, username: '' })} style={{ fontSize: 14, color: '#333333', position: 'absolute', bottom: 15 + getBottomSpace(), left: 0, right: 0, textAlign: 'center', marginTop: 10, fontFamily: Global.FontName, }} >{'Đăng nhập với tài khoản khác '}
                        <Text style={{ textDecorationLine: 'underline', color: Global.MainColor }}>Quay lại</Text>
                    </Text>
                }

                {this.props.isFetching &&
                    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center', backgroundColor: '#00000044' }]}>
                        <Image source={Media.LoadingIcon} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                }
            </View>
        )
    }
}

const mapPropsToState = (state, ownProps) => {
    return {
        user: state.auth.user,
        isFetching: state.auth.isFetching
    }
}

const mapDispatchToState = dispatch => {
    return {
        login: (email, password) => dispatch(login(email, password)),
        register: (username, email, facebook, phone, password, verifypassword) => dispatch(register(username, email, facebook, phone, password, verifypassword)),
        unmountError: () => dispatch(unmountError())
    }
}

export default connect(mapPropsToState, mapDispatchToState)(LoginView);