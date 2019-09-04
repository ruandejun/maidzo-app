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
import { updateProfile } from 'Sessions/redux/action'
import CustomAlert from 'components/CustomAlert'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Header from 'components/Header'

class UpdateProfileView extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            full_name: (props.user && props.user.full_name) ? props.user.full_name : '',
            phone_number: (props.user && props.user.phone_number) ? props.user.phone_number : '',
            city: (props.user && props.user.city) ? props.user.city : '',
            district: (props.user && props.user.district) ? props.user.district : '',
            street: (props.user && props.user.street) ? props.user.street : '',
        }
    }

    onUpdate(value, name) {
        this.props.updateProfile(this.props.user.username, value, name)
    }

    render() {

        const { full_name, phone_number, street, district, city } = this.state
        const { user } = this.props

        return (
            <View style={styles.container}>
                <Header
                    title='Hồ sơ của tôi'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <KeyboardAwareScrollView style={{ flex: 1, width: '100%' }}>
                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Tên đầy đủ</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={full_name}
                                placeholder='Nhập tên đầy đủ của bạn'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ full_name: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                            />
                            {user && user.full_name != full_name &&
                                <TouchableOpacity onPress={this.onUpdate.bind(this, full_name, 'full_name')} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                                    <Icon name='check' color='white' size={15} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Số điện thoại</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={phone_number}
                                placeholder='Nhập số điện thoại của bạn'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ phone_number: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                                keyboardType='phone-pad'
                            />
                            {user && user.phone_number != phone_number &&
                                <TouchableOpacity onPress={this.onUpdate.bind(this, phone_number, 'phone_number')} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                                    <Icon name='check' color='white' size={15} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Địa chỉ nơi ở</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={street}
                                placeholder='Nhập địa chỉ của bạn'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ street: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                            />
                            {user && user.street != street &&
                                <TouchableOpacity onPress={this.onUpdate.bind(this, street, 'street')} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                                    <Icon name='check' color='white' size={15} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Quận/huyện đang sinh sống</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={district}
                                placeholder='Nhập quận/huyện bạn đang sinh sống'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ district: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                            />
                            {user && user.district != district &&
                                <TouchableOpacity onPress={this.onUpdate.bind(this, district, 'district')} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                                    <Icon name='check' color='white' size={15} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>

                    <View style={{ width: '100%', padding: 16, marginTop: 8, backgroundColor: 'white' }}>
                        <Text style={{ fontSize: 12, color: '#333333', fontFamily: Global.FontName }}>Tỉnh/Thành phố đang sinh sống</Text>
                        <View style={{ flexDirection: 'row', width: '100%', borderBottomColor: '#CECECE', borderBottomWidth: 0.5, marginTop: 8 }}>
                            <TextInput
                                value={city}
                                placeholder='Nhập tỉnh/thành phố bạn đang sinh sống'
                                placeholderTextColor='#777777'
                                onChangeText={(text) => this.setState({ city: text })}
                                underlineColorAndroid='#00000000'
                                style={styles.inputText}
                            />
                            {user && user.city != city &&
                                <TouchableOpacity onPress={this.onUpdate.bind(this, city, 'city')} style={{ width: 30, height: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: 'green' }}>
                                    <Icon name='check' color='white' size={15} />
                                </TouchableOpacity>
                            }
                        </View>
                    </View>
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
        updateProfile: (pk, value, name) => dispatch(updateProfile(pk, value, name))
    }
}

export default connect(mapPropsToState, mapDispatchToState)(UpdateProfileView);