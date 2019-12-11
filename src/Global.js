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
        ((dimen.height === 812 || dimen.width === 812) || (dimen.height === 896 || dimen.width === 896))
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
    {title: 'Hotline', number: '1900989977'},
    {title: 'Giải đáp thắc mắc', number: '+842466833354'},
    {title: 'Phản ánh chất lượng dịch vụ', number: '+842466833354'},
  ]

  export default Global = {
    MainColor: '#EE4D2D',
    ScreenWidth : Dimensions.get('screen').width,
    ScreenHeight : Dimensions.get('screen').height,
    FontName : 'Arial',
    apiUrl: 'https://quanly.maidzo.vn/',
    username: '',
    userId: '',
    userToken: '',
    pushToken: '',
    overlayPopView: null,
  }
  
  export const Media = media;