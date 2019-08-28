/**
 * @flow
 */

import React from 'react';
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Image,
    StatusBar,
    AsyncStorage,
    Text
} from 'react-native'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    logoIcon: {
        width: Global.ScreenWidth * 0.3,
        height: Global.ScreenWidth * 0.3
    },
    titleText: {
        fontFamily: Global.FontName,
        fontWeight : 'bold',
        textAlign: 'center',
        width : 170,
    }
})

import Global from 'src/Global'
import { connect } from 'react-redux'
import { getUser } from 'Sessions/redux/action';
import NavigationService from 'actions/NavigationService'

class SplashScreenView extends React.Component {

    async autoLogin() {

        console.log(this.props.user)

        try {
            if (this.props.user) {
                var value = await AsyncStorage.getItem("@USER_TOKEN");

                if (value) {
                    Global.userToken = value
                    this.props.loginSuccess(this.props.user)
                    NavigationService.reset('DashboardView')
                } else {
                    NavigationService.reset('LoginView')
                }
            } else if (Global.userId.length > 0 && Global.userToken.length > 0) {
                if (this.props.isLogin)
                    return;

                this.props.getUser();
            } else {

                var value = await AsyncStorage.getItem("@USER_TOKEN");

                if (value) {
                    Global.userToken = value

                    this.props.getUser();
                } else {
                    NavigationService.reset('LoginView')
                }
            }
        } catch (error) {
            console.log(error);
            NavigationService.reset('LoginView')
        }
    }

    componentWillMount() {
        this.autoLogin()
    }

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden />
                <Image resizeMode='contain' source={Media.LogoIcon} style={styles.logoIcon} />
            </View>
        )
    }
}

const mapPropsToState = (state, ownProps) => {
    return {
        isFetching: state.auth.isFetching,
        isLogin: state.auth.isLogin,
        user: state.auth.user
    }
}

const mapDispatchToState = dispatch => {
    return {
        getUser: () => { dispatch(getUser()); },
        loginSuccess: (user) => {
            dispatch({ type: "LOGIN_SUCCESSFULLY", data: user })
        },
    }
}

export default connect(mapPropsToState, mapDispatchToState)(SplashScreenView);