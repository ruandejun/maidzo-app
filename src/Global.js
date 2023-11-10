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

export function imageUrl(image_url) {
  if (image_url.indexOf('https:') == -1) {
    return 'https:' + image_url
  }

  return image_url
}

export const convertMoney = (money, showCurrency = false) => {
  if (!money) return money
  return (Math.round(money * 100) / 100).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") +  (showCurrency ? '₫' : '')
}

export const contacts = [
  { title: 'Hotline', number: '+842466721111', action: 'tel:842466721111', icon: 'phone' },
  { title: 'Zalo', number: '+842466721111', action: 'https://zalo.me/1807717681848049893', icon: 'headset' },
]

export default Global = {
  MainColor: '#1eaa51',
  ScreenWidth: Dimensions.get('screen').width,
  ScreenHeight: Dimensions.get('screen').height,
  FontName: 'Arial',
  apiUrl: 'https://quanly.chuyenhang365.com/',
  username: '',
  userId: '',
  userToken: '',
  pushToken: '',
  overlayPopView: null
}

export const Media = media;