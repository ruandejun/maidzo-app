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
        backgroundColor: '#f2f2f2'
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
        fontSize: 15, color: 'black', fontFamily: Global.FontName, padding: 0, paddingTop: 5, paddingBottom: 5, flex: 1
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

import { connect } from 'react-redux'
import Global, { Media, getStatusBarHeight, getBottomSpace } from 'src/Global';
import { updatePassword } from 'Sessions/redux/action'
import CustomAlert from 'components/CustomAlert'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Header from 'components/Header'

class UpdatePasswordView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        }
    }

    onUpdate() {
        const { newPassword, currentPassword, confirmPassword } = this.state

        if(newPassword.length == 0 || currentPassword.length == 0 || confirmPassword.length == 0){
            CustomAlert('Vui lòng nhập tất cả thông tin')
            return
        }

        if(newPassword != confirmPassword){
            CustomAlert('Mật khẩu mới không khớp')
            return
        }

        this.props.updatePassword(currentPassword, newPassword)
    }

    render() {

        const { newPassword, currentPassword, confirmPassword } = this.state

        return (
            <View style={styles.container}>
                <Header
                    title='Cập nhật mật khẩu'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Mật khẩu hiện tại</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={currentPassword}
                                placeholder='Mật khẩu hiện tại'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ currentPassword: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Mật khẩu mới</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={newPassword}
                                placeholder='Mật khẩu mới'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ newPassword: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Nhập lại mật khẩu mới</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={confirmPassword}
                                placeholder='Mật khẩu mới'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ confirmPassword: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                secureTextEntry={true}
                            />
                        </View>
                    </View>

                    <TouchableOpacity onPress={this.onUpdate.bind(this)} style={{ alignSelf: 'center', marginTop: 20, borderRadius: 20, width: 300, height: 40, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                        <Text style={{fontSize: 16, color: 'white', fontWeight: '500', fontFamily: Global.FontName}}>Cập nhật</Text>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>
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
        updatePassword: (current_password, new_password) => dispatch(updatePassword(current_password, new_password))
    }
}

export default connect(mapPropsToState, mapDispatchToState)(UpdatePasswordView);