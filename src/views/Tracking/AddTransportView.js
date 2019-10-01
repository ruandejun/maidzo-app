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
import Header from 'components/Header'
import { fetchApi, fetchUnlengthApi } from 'actions/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

class AddTransportView extends React.Component {

    state = {
        note: '',
        tracking_list: ''
    }

    onSend() {
        Keyboard.dismiss()

        const {note, tracking_list} = this.state

        if(tracking_list.length == 0){
            CustomAlert(null, 'Vui lòng điền đủ thông tin')
            return
        }
        
        fetchUnlengthApi('post', 'page/add_transport_tracking/', {
                username: this.props.user.username, 
                tracking_list: tracking_list,
                note: note
            })
        .then((data) => {
            // console.log(data)
            if(data.success){
                CustomAlert('Thành công', data.msg)
                const onDone = this.props.navigation.getParam('onDone')
                if(onDone){
                    onDone()
                }
                this.props.navigation.goBack()
            } else {
                CustomAlert('Thất bại', 'Thêm ký gửi thất bại')
            }
        })
        .catch((error) => {
            console.log(error)
            CustomAlert('Thất bại', 'Thêm ký gửi thất bại')
        })
    }

    render() {

        const {note, tracking_list} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title='Thêm kiện ký gửi'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                    rightText='Xong'
                    rightAction={this.onSend.bind(this)}
                />
                <KeyboardAwareScrollView style={{flex: 1, width: '100%'}}>
                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Mã kiện</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8, height: 80}}>
                            <TextInput
                                value={tracking_list}
                                placeholder='Mã kiện (mỗi kiện một dòng)'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ tracking_list: text })}
                                underlineColorAndroid='#00000000'
                                multiline
                                style={[styles.inputText, {height: 80}]}
                            />
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Ghi chú</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8, height: 80}}>
                            <TextInput
                                value={note}
                                placeholder='Ghi chú'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ note: text })}
                                underlineColorAndroid='#00000000'
                                multiline
                                style={[styles.inputText, {height: 80}]}
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
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

export default connect(mapPropsToState, mapDispatchToState)(AddTransportView);


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
    },
    inputText: {
        padding: 5,
        fontFamily: Global.FontName,
        color: 'black',
        fontSize: 15, width: '100%'
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