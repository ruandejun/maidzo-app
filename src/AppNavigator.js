/**
 * @flow
 */

import React from 'react';
import { View, StatusBar, Platform, BackHandler, Alert, Text } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { navigationRef, isReadyRef } from 'actions/NavigationService'
import Tabbar from 'components/Tabbar'

import SplashScreenView from './SplashScreenView'

import LoginView from 'Sessions/LoginView'
import ForgotPasswordView from 'Sessions/ForgotPasswordView'

import SettingView from 'Setting/SettingView'
import AboutView from 'Setting/AboutView'
import PrivacyView from 'Setting/PrivacyView'
import SupportView from 'Setting/SupportView'
import UpdateProfileView from 'Setting/UpdateProfileView'
import ContactView from 'Setting/ContactView'
import UpdatePasswordView from 'Setting/UpdatePasswordView'

import TrackingDetailView from 'Trackings/TrackingDetailView'
import ItemTrackingView from 'Trackings/ItemTrackingView'
import TrackingAllView from 'Trackings/TrackingAllView'
import ScanQRView from 'Trackings/ScanQRView'
import AddTransportView from 'Trackings/AddTransportView'

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
import ImageSearchView from 'Home/ImageSearchView'
import HomeScanView from 'Home/HomeScanView'

import CartView from 'Carts/CartView'
import CartConfirmView from 'Carts/CartConfirmView'
import CartInfoView from 'Carts/CartInfoView'
import ManualCartView from 'Carts/ManualCartView'

import OrderListView from 'Orders/OrderListView'
import OrderDetailView from 'Orders/OrderDetailView'

import NotificationView from 'Notifications/NotificationView'

import MenuView from 'Setting/MenuView'

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const DashboardView = () => {
    return (
        <Tab.Navigator tabBar={props => <Tabbar {...props} />}>
            <Tab.Screen name="HomeView" component={HomeView} />
            <Tab.Screen name="OrderListView" component={OrderListView} />
            <Tab.Screen name="NotificationView" component={NotificationView} />
            <Tab.Screen name="MenuView" component={MenuView} />
        </Tab.Navigator>
    )
}

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

    render() {
        const { dispatch } = this.props;

        return (
            <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                    isReadyRef.current = true;
                }}>
                <Stack.Navigator initialRouteName="SplashScreenView" headerMode="float">
                    <Stack.Screen name="SplashScreenView" component={SplashScreenView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="LoginView" component={LoginView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ForgotPasswordView" component={ForgotPasswordView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="DashboardView" component={DashboardView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="CartConfirmView" component={CartConfirmView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="CartInfoView" component={CartInfoView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="TaobaoWebView" component={TaobaoWebView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="OrderDetailView" component={OrderDetailView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="SettingView" component={SettingView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="AboutView" component={AboutView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="PrivacyView" component={PrivacyView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="SupportView" component={SupportView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="WalletBalanceView" component={WalletBalanceView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="UpdateProfileView" component={UpdateProfileView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="CartView" component={CartView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="DepositListView" component={DepositListView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="HomeScanView" component={HomeScanView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="PayListView" component={PayListView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="RefundListView" component={RefundListView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="TrackingDetailView" component={TrackingDetailView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="SubmitReportView" component={SubmitReportView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ReportDetailView" component={ReportDetailView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="HomeSearchView" component={HomeSearchView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="PayOrderView" component={PayOrderView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="RefundOrderView" component={RefundOrderView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ItemTrackingView" component={ItemTrackingView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ManualCartView" component={ManualCartView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ImageSearchView" component={ImageSearchView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ScanQRView" component={ScanQRView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="AddTransportView" component={AddTransportView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="ContactView" component={ContactView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="UpdatePasswordView" component={UpdatePasswordView} options={{ header: () => null, headerBackTitle: () => "" }} />
                    <Stack.Screen name="TrackingAllView" component={TrackingAllView} options={{ header: () => null, headerBackTitle: () => "" }} />
                </Stack.Navigator>
            </NavigationContainer>
        )
    }
}

export default AppWithNavigationState