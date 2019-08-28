/**
 * @flow
 */

import React from 'react';
import { View, StatusBar, Platform, BackHandler, Alert, Text } from 'react-native'
import { createStackNavigator, createAppContainer, createBottomTabNavigator } from "react-navigation"
import { connect } from 'react-redux'
import NavigationService from 'actions/NavigationService'
import Tabbar from 'components/Tabbar'

import SplashScreenView from './SplashScreenView'

import LoginView from 'Sessions/LoginView'
import ForgotPasswordView from 'Sessions/ForgotPasswordView'

import HomeView from 'Home/HomeView'
import HomeWebview from 'Home/HomeWebview'

import CartView from 'Carts/CartView'
import CartConfirmView from 'Carts/CartConfirmView'
import CartInfoView from 'Carts/CartInfoView'

import OrderListView from 'Orders/OrderListView'
import OrderDetailView from 'Orders/OrderDetailView'

import NotificationView from 'Notifications/NotificationView'

const DashboardView = createBottomTabNavigator({
    HomeView: { screen: HomeView },
    OrderListView: { screen: OrderListView },
    CartView: { screen: CartView },
    NotificationView: { screen: NotificationView }
}, {
        tabBarComponent: Tabbar,
        tabBarPosition: 'bottom',
        swipeEnabled: false, // fixes a bug in react navigation
        lazy: false, // fixes a bug in react navigation
        animationEnabled: true,
        removeClippedSubviews: true
    }
)

const AppNavigator = createAppContainer(
    createStackNavigator({
        SplashScreenView: {
            screen: SplashScreenView,
            navigationOptions: { header: null }
        },
        LoginView: {
            screen: LoginView,
            navigationOptions: { header: null }
        },
        ForgotPasswordView: {
            screen: ForgotPasswordView,
            navigationOptions: { header: null }
        },
        DashboardView: {
            screen: DashboardView,
            navigationOptions: { header: null }
        },
        CartConfirmView: {
            screen: CartConfirmView,
            navigationOptions: { header: null }
        },
        CartInfoView: {
            screen: CartInfoView,
            navigationOptions: { header: null }
        },
        HomeWebview: {
            screen: HomeWebview,
            navigationOptions: { header: null }
        },
        OrderDetailView: {
            screen: OrderDetailView,
            navigationOptions: { header: null }
        },
    }, {

            mode: 'modal',
            navigationOptions: { header: null }
        })
)

export class AppWithNavigationState extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        console.disableYellowBox = true
    }

    componentWillMount() {
        if (Text.defaultProps == null)
            Text.defaultProps = {};
        Text.defaultProps.allowFontScaling = false;

        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor('#00000000');
            StatusBar.setTranslucent(true)
        }
        StatusBar.setBarStyle('dark-content');
    }

    componentWillUnmount() {
    }

    render() {
        const { dispatch } = this.props;

        return (
            <AppNavigator ref={navigationRef => { NavigationService.setTopLevelNavigator(navigationRef) }} dispatch={dispatch} />
        )
    }
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps)(AppWithNavigationState)