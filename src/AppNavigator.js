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

import SettingView from 'Setting/SettingView'
import AboutView from 'Setting/AboutView'
import PrivacyView from 'Setting/PrivacyView'
import SupportView from 'Setting/SupportView'
import UpdateProfileView from 'Setting/UpdateProfileView'

import TrackingDetailView from 'Trackings/TrackingDetailView'
import ItemTrackingView from 'Trackings/ItemTrackingView'

import SubmitReportView from 'Reports/SubmitReportView'
import ReportListView from 'Reports/ReportListView'
import ReportDetailView from 'Reports/ReportDetailView'

import WalletBalanceView from 'Wallets/WalletBalanceView'
import DepositListView from 'Wallets/DepositListView'
import RefundListView from 'Wallets/RefundListView'
import PayListView from 'Wallets/PayListView'
import PayOrderView from 'Wallets/PayOrderView'
import RefundOrderView from 'Wallets/RefundOrderView'

import HomeView from 'Home/HomeView'
import TaobaoWebView from 'Home/TaobaoWebView'
import HomeSearchView from 'Home/HomeSearchView'

import CartView from 'Carts/CartView'
import CartConfirmView from 'Carts/CartConfirmView'
import CartInfoView from 'Carts/CartInfoView'
import ManualCartView from 'Carts/ManualCartView'

import OrderListView from 'Orders/OrderListView'
import OrderDetailView from 'Orders/OrderDetailView'

import NotificationView from 'Notifications/NotificationView'

const DashboardView = createBottomTabNavigator({
    HomeView: { screen: HomeView },
    OrderListView: { screen: OrderListView },
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
        TaobaoWebView: {
            screen: TaobaoWebView,
            navigationOptions: { header: null }
        },
        OrderDetailView: {
            screen: OrderDetailView,
            navigationOptions: { header: null }
        },
        SettingView: {
            screen: SettingView,
            navigationOptions: { header: null }
        },
        AboutView: {
            screen: AboutView,
            navigationOptions: { header: null }
        },
        PrivacyView: {
            screen: PrivacyView,
            navigationOptions: { header: null }
        },
        SupportView: {
            screen: SupportView,
            navigationOptions: { header: null }
        },
        WalletBalanceView: {
            screen: WalletBalanceView,
            navigationOptions: { header: null }
        },
        UpdateProfileView: {
            screen: UpdateProfileView,
            navigationOptions: { header: null }
        },
        CartView: {
            screen: CartView,
            navigationOptions: { header: null }
        },
        DepositListView: {
            screen: DepositListView,
            navigationOptions: { header: null }
        },
        PayListView: {
            screen: PayListView,
            navigationOptions: { header: null }
        },
        RefundListView: {
            screen: RefundListView,
            navigationOptions: { header: null }
        },
        TrackingDetailView: {
            screen: TrackingDetailView,
            navigationOptions: { header: null }
        },
        SubmitReportView: {
            screen: SubmitReportView,
            navigationOptions: { header: null }
        },
        ReportListView: {
            screen: ReportListView,
            navigationOptions: { header: null }
        },
        ReportDetailView: {
            screen: ReportDetailView,
            navigationOptions: { header: null }
        },
        HomeSearchView: {
            screen: HomeSearchView,
            navigationOptions: { header: null }
        },
        PayOrderView: {
            screen: PayOrderView,
            navigationOptions: { header: null }
        },
        RefundOrderView: {
            screen: RefundOrderView,
            navigationOptions: { header: null }
        },
        ItemTrackingView: {
            screen: ItemTrackingView,
            navigationOptions: { header: null }
        },
        ManualCartView: {
            screen: ManualCartView,
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