/**
 * @flow
 * @providesModule HomeMainView
 */

import React from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    Platform,
    ActivityIndicator,
    AppState,
    TouchableOpacity,
    TouchableWithoutFeedback,
    FlatList,
    Alert,
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2', alignItems: 'center'
    },
    itemContainer: {
        flexDirection: 'row', height: 45, alignItems: 'center'
    },
    itemText: {
        fontSize: 14, color: 'black', fontFamily: Global.FontName, flex: 1, marginLeft: 8, marginRight: 8
    },
    separator: {
        position: 'absolute', left : 0, right: 0, bottom: 0, height: 1, backgroundColor: '#CECECE'
    }
})

import { connect } from 'react-redux';
import Global, { Media, calculateDistance, decode, getBottomSpace } from 'src/Global';
import Header from 'components/Header'
import Icon from 'react-native-vector-icons/FontAwesome5'
import CustomAlert from 'components/CustomAlert';
import {logout, deleteAccount} from 'Sessions/redux/action'

class SettingView extends React.Component {

    onLogout(){
        CustomAlert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
            {text: 'Đăng xuất', onPress: () => {
                this.props.logout()
                this.props.navigation.goBack()
            }},
            {text: 'Bỏ', }
        ])
    }

    openPrivacy(){
        this.props.navigation.navigate('PrivacyView')
    }

    onAbout(){
        this.props.navigation.navigate('AboutView')
    }

    onProfile(){
        this.props.navigation.navigate('UpdateProfileView')
    }

    onUpdatePassword(){
        this.props.navigation.navigate('UpdatePasswordView')
    }

    onDeleteAccount(){
        Alert.alert('Xoá tài khoản', 'Bạn có xác nhận xoá tài khoản? Mọi thông tin sẽ bị xoá.', [
            {text: 'Không'},
            {text: 'Xoá', onPress: () => {
                this.props.deleteAccount()
            }}
        ])
    }

    render() {

        const {user} = this.props

        return (
            <View style={styles.container}>
                <Header
                    title='Thiết lập tài khoản'
                    leftIcon='chevron-left'
                    leftAction={() => this.props.navigation.goBack()}
                />

                <View style={{flex: 1, width: '100%', backgroundColor: 'white', marginTop : 10, marginBottom: 10, padding: 16, paddingTop: 0, paddingBottom: 0}}>
                    <TouchableOpacity onPress={this.onProfile.bind(this)} style={styles.itemContainer}>
                        <Text style={styles.itemText}>Hồ sơ của tôi</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
                        <View style={styles.separator}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onUpdatePassword.bind(this)} style={styles.itemContainer}>
                        <Text style={styles.itemText}>Cập nhật mật khẩu</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
                        <View style={styles.separator}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.openPrivacy.bind(this)} style={styles.itemContainer}>
                        <Text style={styles.itemText}>Điều khoản Alo68</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
                        <View style={styles.separator}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onAbout.bind(this)} style={styles.itemContainer}>
                        <Text style={styles.itemText}>Giới thiệu</Text>
                        <Icon name='chevron-right' size={14} color='#333333'/>
                        <View style={styles.separator}/>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onDeleteAccount.bind(this)} style={[styles.itemContainer, {marginTop: 32}]}>
                        <Text style={[styles.itemText, {color: 'red'}]}>Xoá tài khoản</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={this.onLogout.bind(this)} style={{width: '100%', height: 45 + getBottomSpace(), paddingBottom: getBottomSpace(), backgroundColor: '#DF5539', alignItems: 'center', justifyContent: 'center'}}>
                    <Text style={{color: 'white', fontSize: 16, fontFamily: Global.FontName, fontWeight: '500'}}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.auth.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(logout()),
        deleteAccount: () => dispatch(deleteAccount())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(SettingView);
