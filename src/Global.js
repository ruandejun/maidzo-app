/**
* @flow
* Define the global variable
*/

import {
    Dimensions,
    Platform,
    StatusBar
  } from 'react-native'
  
  import media from './Media';

  export function isIphoneX() {
    const dimen = Dimensions.get('window');
    return (
      Platform.OS === 'ios' &&
      !Platform.isPad &&
      !Platform.isTVOS &&
      ((dimen.height === 780 || dimen.width === 780)
        || (dimen.height === 812 || dimen.width === 812)
        || (dimen.height === 844 || dimen.width === 844)
        || (dimen.height === 896 || dimen.width === 896)
        || (dimen.height === 926 || dimen.width === 926))
    );
  }  
  
  export function ifIphoneX(iphoneXStyle, regularStyle) {
    if (isIphoneX()) {
        return iphoneXStyle;
    }
    return regularStyle;
  }
  
  export function getStatusBarHeight(safe) {
    return Platform.select({
        ios: ifIphoneX(safe ? 44 : 30, 20),
        android: StatusBar.currentHeight
    });
  }
  
  export function getBottomSpace() {
    return isIphoneX() ? 34 : 0;
  }

  export function imageUrl(image_url){
    if(image_url.indexOf('https:') == -1){
      return 'https:' + image_url
    }

    return image_url
  }

  export const convertMoney = (money) => {
    if(!money) return money
    return (Math.round(money * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  export const contacts = [
    {title: 'Hotline', number: '02439999247', action: 'tel:842439999247', icon: 'phone'},
    {title: 'Messenger', number: 'shipway247', action: 'http://m.me/shipway247', icon: 'facebook-messenger'},
  ]

  export default Global = {
    MainColor: '#f07b4c',
    ScreenWidth : Dimensions.get('screen').width,
    ScreenHeight : Dimensions.get('screen').height,
    FontName : 'Arial',
    apiUrl: 'https://quanly.shipway247.com/',
    username: '',
    userId: '',
    userToken: '',
    pushToken: '',
    overlayPopView: null,
  }
  
  export const Media = media;