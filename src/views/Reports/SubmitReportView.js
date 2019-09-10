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
import {ActionSheet} from 'teaset'
import Header from 'components/Header'
import { fetchApi, fetchUnlengthApi } from 'actions/api'

class SubmitReportView extends React.Component {

    state = {
        body: '',
        title: '',
        group: null
    }

    componentDidMount(){

        const item_id = this.props.navigation.getParam('item_id')
        const shipment_package = this.props.navigation.getParam('shipment_package')
        const order_number = this.props.navigation.getParam('order_number')

        if(order_number){
            this.setState({title: 'Tôi cần khiếu nại đơn hàng ' + order_number})
        }
        
        if(item_id){
            this.setState({title: 'Tôi cần khiếu nại sản phẩm ' + item_id})
        }

        if(shipment_package){
            this.setState({title: 'Tôi cần khiếu nại vận đơn ' + shipment_package})
        }
    }

    onSend() {
        const {title, body, group} = this.state

        if(body.length == 0 || group == null || title.length == 0){
            CustomAlert(null, 'Vui lòng nhập thông tin khiếu nại')
            return
        }

        let requestBody = {username: this.props.user.username, title: title, body: body, group: group.id, type: 'manual', item_id: 0, order_number: 0, shop: 0}

        const item_id = this.props.navigation.getParam('item_id')
        const shipment_package = this.props.navigation.getParam('shipment_package')
        const order_number = this.props.navigation.getParam('order_number')

        if(item_id){
            requestBody.item_id = item_id
        }

        if(shipment_package){
            requestBody.shipment_package = shipment_package
        }

        if(order_number){
            requestBody.order_number = order_number
        }

        console.log(requestBody)

        fetchUnlengthApi('post', 'page/create_ticket/', requestBody)
        .then((data) => {
            console.log(data)
            if(data.success){
                CustomAlert(null, 'Khiếu nại của bạn đã gửi thành công.', [
                    {text: 'Quay lại', onPress: () => this.props.navigation.goBack()}
                ])
            } else {
                CustomAlert(null, data.msg)
            }
        })
        .catch((error) => {
            console.log(error)
            CustomAlert(null, 'Gửi khiếu nại không thành công')
        })
    }

    onChangeGroup(){
        ActionSheet.show([
            {title: 'Chăm sóc khách hàng', onPress: () => this.setState({group: {title: 'Chăm sóc khách hàng', id: 'cskh'}})},
            {title: 'Kế toán', onPress: () => this.setState({group: {title: 'Kế toán', id: 'ketoan'}})},
            {title: 'Đặt hàng', onPress: () => this.setState({group: {title: 'Đặt hàng', id: 'dathang'}})},
            {title: 'Kiểm hàng', onPress: () => this.setState({group: {title: 'Kiểm hàng', id: 'kiemhang'}})},
        ])
    }

    render() {

        return (
            <View style={styles.container}>
                <Header
                    title='Khiếu nại'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />
                <View style={styles.inputContainer}>
                    <TextInput
                        value={this.state.title}
                        underlineColorAndroid='#00000000'
                        editable={false}
                        placeholderTextColor='#CECECE'
                        style={styles.inputText} />
                </View>

                <TouchableOpacity onPress={this.onChangeGroup.bind(this)} style={styles.inputContainer}>
                    <TextInput
                        value={this.state.group ? this.state.group.title : ''}
                        underlineColorAndroid='#00000000'
                        placeholder='Lựa chọn bộ phận'
                        placeholderTextColor='#CECECE'
                        editable={false}
                        style={styles.inputText} />
                </TouchableOpacity>

                <View style={[styles.inputContainer, {height: 80}]}>
                    <TextInput
                        value={this.state.body}
                        onChangeText={(text) => this.setState({body: text})}
                        underlineColorAndroid='#00000000'
                        placeholder='Nội dung khiếu nại'
                        placeholderTextColor='#CECECE'
                        multiline
                        style={[styles.inputText, {height: 80, textAlignVertical: 'top'}]} />
                </View>
                <TouchableOpacity onPress={this.onSend.bind(this)} style={[styles.buttonContainer, { backgroundColor: Global.MainColor }]}>
                    <Text style={styles.loginText}>Gửi khiếu nại</Text>
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

export default connect(mapPropsToState, mapDispatchToState)(SubmitReportView);


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