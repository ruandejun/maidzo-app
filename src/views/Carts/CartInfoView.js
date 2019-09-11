import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f6f6f6'
    },
    inputContainer: {
        width: '100%', padding: 10, paddingLeft: 16, paddingRight: 16, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#cccccc'
    },
    textInput: {
        fontSize: 14, color: '#333333', fontFamily: Global.FontName, flex: 1, padding: 0,
    },
    orderContainer: {
        height: 50, marginBottom : 20, marginTop : 10, backgroundColor: Global.MainColor, alignItems: 'center', justifyContent: 'center'
    },
    orderText: {
        fontSize: 14, color: 'white', fontWeight: '500', fontFamily: Global.FontName
    },
})

import { connect } from 'react-redux';
import Global, { Media, convertMoney, } from 'src/Global';
import Header from 'components/Header'
import CartItem from './component/CartItem'
import {getCart} from './redux/action'
import CustomAlert from 'components/CustomAlert'

class CartInfoView extends React.Component {

    constructor(props){
        super(props)

        const {user} = props

        this.state = {
            full_name: user && user.full_name ? user.full_name : '',
            phone_number: user && user.phone_number ? user.phone_number : '',
            facebook: user && user.facebook ? user.facebook : '',
            order_note: user && user.order_note ? user.order_note : '',
            district: user && user.district ? user.district : '',
            city: user && user.city ? user.city : '',
            street: user && user.street ? user.street : '',
            ship_method: 0
        }
    }

    onNext(){
        const {full_name, phone_number, facebook, ship_method, order_note, district, city, street} = this.state
        if(full_name.length == 0 || phone_number.length == 0 || district.length == 0 || city.length == 0 || street.length == 0){
            CustomAlert('Vui lòng điền đầy đủ thông tin')
            return
        }

        this.props.navigation.navigate('CartConfirmView', {cart_info: this.state})
    }

    render() {

        const {full_name, phone_number, facebook, ship_method, order_note, district, city, street} = this.state

        return (
            <View style={styles.container}>
                <Header title='Thông tin người nhận'
                        leftIcon='chevron-left'
                        leftAction={() => this.props.navigation.goBack()}
                />
                <ScrollView style={{flex: 1}}>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            value={full_name}
                            underlineColorAndroid='#00000000'
                            placeholder='Tên người nhận*'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(text) => this.setState({full_name : text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            value={phone_number}
                            underlineColorAndroid='#00000000'
                            placeholder='Số điện thoại người nhận*'
                            placeholderTextColor='#aaaaaa'
                            keyboardType='phone-pad'
                            onChangeText={(text) => this.setState({phone_number : text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            value={facebook}
                            underlineColorAndroid='#00000000'
                            placeholder='Facebook (để tiện liên lạc)'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(text) => this.setState({facebook : text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            value={street}
                            underlineColorAndroid='#00000000'
                            placeholder='Địa chỉ nhận hàng*'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(text) => this.setState({street : text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            value={district}
                            underlineColorAndroid='#00000000'
                            placeholder='Quận/ Huyện*'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(text) => this.setState({district : text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={styles.textInput}
                            value={city}
                            underlineColorAndroid='#00000000'
                            placeholder='Tỉnh/ Thành phố*'
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(text) => this.setState({city : text})}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput 
                            style={[styles.textInput, {height: 60}]}
                            value={order_note}
                            underlineColorAndroid='#00000000'
                            placeholder='Ghi chú'
                            multiline
                            placeholderTextColor='#aaaaaa'
                            onChangeText={(text) => this.setState({order_note : text})}
                        />
                    </View>
                </ScrollView>

                <View style={styles.footerContainer}>
                    <TouchableOpacity onPress={this.onNext.bind(this)} style={styles.orderContainer}>
                        <Text style={styles.orderText}>Giao đến địa chỉ này</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        cartItems: state.cart.items,
        isFetching: state.cart.isFetching,
        user: state.cart.user,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getCart: () => {dispatch(getCart())},
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CartInfoView);
