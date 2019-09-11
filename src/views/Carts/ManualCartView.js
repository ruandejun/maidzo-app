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
import {Checkbox, Stepper} from 'teaset'
import Header from 'components/Header'
import { fetchApi, fetchUnlengthApi } from 'actions/api'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {TextInputMask} from 'react-native-masked-text'
import { addManualItem } from 'Carts/redux/action'
import ActionSheet from 'teaset/components/ActionSheet/ActionSheet';

const currencies = ['VND', 'CNY', 'AUD']

class ManualCartView extends React.Component {

    state = {
        detailUrl: '',
        price: '0',
        currency: currencies[0],
        title: '',
        quantity: 0,
        parentImage: '',
        color: '',
        size: '',
        note: ''
    }

    onSend() {
        const {color, size, detailUrl, parentImage, quantity, title, currency, note, price} = this.state

        if(detailUrl.length == 0 || parentImage.length == 0 || quantity <= 0 || title.length == 0 || price == 0){
            CustomAlert(null, 'Vui lòng điền đủ thông tin')
            return
        }

        this.props.addManualItem(this.props.user.username, detailUrl, title, parentImage, parseInt(quantity), parseFloat(price), currency, color, size, note)
    }

    selectCurrency(){
        let items = currencies.map((item) => {
            return {
                title: item,
                onPress: () => this.setState({currency: item})
            }
        })
        ActionSheet.show(items)
    }

    render() {

        const {option, detailUrl, parentImage, quantity, title, currency, note, price} = this.state

        return (
            <View style={styles.container}>
                <Header
                    title='Thêm sản phẩm'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                    rightText='Xong'
                    rightAction={this.onSend.bind(this)}
                />
                <KeyboardAwareScrollView style={{flex: 1, width: '100%'}}>
                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Link sản phẩm</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={detailUrl}
                                placeholder='Nhập link sản phẩm'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ detailUrl: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                clearButtonMode='always'
                            />
                        </View>
                    </View>
                    

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Tên sản phẩm</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={title}
                                placeholder='Nhập tên sản phẩm'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ title: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                clearButtonMode='always'
                            />
                        </View>
                    </View>


                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Link ảnh sản phẩm</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={parentImage}
                                placeholder='Nhập link ảnh sản phẩm'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ parentImage: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                clearButtonMode='always'
                            />
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Giá sản phẩm</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInputMask
                                value={price}
                                options={{
                                    precision: 2,
                                    separator: ',',
                                    delimiter: '.',
                                    unit: '',
                                    suffixUnit: ''
                                  }}
                                type={'money'}
                                placeholder='Nhập giá sản phẩm'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ price: text })}
                                underlineColorAndroid='#00000000'
                                style={[styles.inputText, {flex: 1}]}
                            />

                            <TouchableOpacity onPress={this.selectCurrency.bind(this)} style={{flexDirection: 'row', borderRadius: 5, borderWidth: 1, borderColor: '#CECECE', alignItems: 'center', justifyContent: 'center', padding: 5}}>
                                <Text style={{marginRight: 5, fontSize: 15, color: '#333333', fontWeight: '500', fontFamily: Global.FontName}}>{currency}</Text>
                                <Icon name='chevron-down' size={14} color='#aaaaaa'/>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Số lượng</Text>
                        <Stepper
                            value={quantity}
                            min={1}
                            step={1}
                            style={{ borderWidth: 0, }}
                            onChange={(value) => this.setState({quantity: value})}
                            valueStyle={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}
                            subButton={
                                <View style={{ backgroundColor: '#rgba(238, 169, 91, 0.1)', borderColor: '#8a6d3b', borderWidth: 1, borderRadius: 4, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}>－</Text>
                                </View>
                            }
                            addButton={
                                <View style={{ backgroundColor: '#rgba(238, 169, 91, 0.1)', borderColor: '#8a6d3b', borderWidth: 1, borderRadius: 4, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 15, color: '#8a6d3b', fontFamily: Global.FontName }}>＋</Text>
                                </View>
                            }
                            showSeparator={false}
                        />
                    </View>
                    

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Tuỳ chọn sản phẩm</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8}}>
                            <TextInput
                                value={option}
                                placeholder='Màu sắc'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ full_name: option })}
                                underlineColorAndroid='#00000000'
                                style={[styles.inputText, ]}
                                clearButtonMode='always'
                            />
                        </View>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8}}>
                            <TextInput
                                value={option}
                                placeholder='Kích thước'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ full_name: option })}
                                underlineColorAndroid='#00000000'
                                style={[styles.inputText, ]}
                                clearButtonMode='always'
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
                                clearButtonMode='always'
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
        addManualItem: (add_item_username, link_add_item, name_add_item, link_image, add_item_quantity, add_item_price, add_item_currency, add_item_color, add_item_size, add_item_note) => dispatch(addManualItem(add_item_username, link_add_item, name_add_item, link_image, add_item_quantity, add_item_price, add_item_currency, add_item_color, add_item_size, add_item_note)),
    }
}

export default connect(mapPropsToState, mapDispatchToState)(ManualCartView);


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