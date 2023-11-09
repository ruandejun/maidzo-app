/**
 * @flow
 * @providesModule Header
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions,
  FlatList,
} from 'react-native';

import Global from 'src/Global';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { getStatusBarHeight } from 'react-native-iphone-x-helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const headerStyles = StyleSheet.create({

  container : {
    backgroundColor: 'white',
    flexDirection : 'row',
    justifyContent: 'center',
    paddingTop: getStatusBarHeight(),
    // borderBottomWidth: Platform.OS ? 1 / PixelRatio.getPixelSizeForLayoutSize(1) : 0,
    height: 50 + getStatusBarHeight(),
    width : Global.ScreenWidth
  },
  buttonIcon : {
    width : 24,
    height : 24,
  },
  iconLeft : {
    left : 8,
    position : 'absolute',
    bottom : 8,
    width : 30,
    height : 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftText : {
    left : 10,
    position : 'absolute',
    bottom : 12,
    fontSize : 15,
    fontWeight : '500',
    color : Global.MainColor,
    fontFamily : Global.FontName
  },
  iconRight : {
    right : 8,
    position : 'absolute',
    bottom : 8,
    width : 30,
    height : 30,
    justifyContent: 'center',
    alignItems: 'center'
  },
  rightText : {
    right : 10,
    position : 'absolute',
    bottom : 12,
    fontSize : 15,
    fontWeight : '500',
    color : Global.MainColor,
    fontFamily : Global.FontName
  },
   cartCountText : {
     fontSize : 9,
     textAlign : 'center',
     fontFamily : Global.FontName,
     color : 'white',
     width : '100%'
   },
   cartCountButton : {
     right : 0,
     top: 0,
     position : 'absolute',
     width : 14, height : 14,
     borderRadius: 7,
     justifyContent: 'center',
     alignItems: 'center',
     backgroundColor: Global.MainColor
   },
  logoImage : {
    position : 'absolute',
    left : 50, width : Global.ScreenWidth - 100,
    height : 15,
    bottom : 18,
    resizeMode : 'contain',
  },
  headerTitle : {
    fontSize : 18,
    fontFamily : Global.FontName,
    alignItems : 'center',
    textAlign : 'center',
    textAlignVertical : 'center',
    color : '#7F7F7F',
    position : 'absolute',
    left : 60, width : Global.ScreenWidth - 120,
    bottom : 8,
    fontWeight: '500'
  },
  searchContainer : {
    borderRadius : 20,
    backgroundColor : '#e5e5e5',
    alignItems : 'center',
    justifyContent : 'center',
    flexDirection : 'row',
    position : 'absolute',
    left : 50, width : Global.ScreenWidth - 100,
    bottom : 8,
    overflow : 'hidden',
    padding : 3, paddingLeft: 10, paddingRight: 10
  },
  searchIcon : {
    tintColor : '#7f7f7f',
    width : 15,
    height : 15,
  },
  searchInput : {
    paddingTop : 0,
    paddingBottom : 0,
    flex : 1,
    marginLeft : 8,
    color : Global.MainColor,
    height : 25
  },
  headerSeparator : {
   height : 1,
   backgroundColor : '#e0e0e0',
   width : '100%',
   position : 'absolute',
   bottom : 0,
   left : 0
 }
 });

const Header = (props) => {
  const [openRecent, setOpenRecent] = useState(false);
  const [recents, setRecents] = useState([]);
  const [searchText, setSearchText] = useState('');
  const insets = useSafeAreaInsets()

  useEffect(() => {
    // Load recent search keywords from AsyncStorage here if needed
  }, []);

  const onEndSubmit = () => {
    if (props.onEndSubmit) {
      props.onEndSubmit();
    }
    // Handle AsyncStorage for recent search keywords here
  };

  const onFocus = () => {
    // Load and set recent search keywords here if needed
  };

  return (
    <SafeAreaView style={[headerStyles.container, {height: 50 + insets.top, paddingTop: insets.top}]}>
      <StatusBar translucent barStyle="dark-content" backgroundColor="#00000000" />
      {props.leftIcon && (
        <TouchableOpacity
          style={headerStyles.iconLeft}
          onPress={() => {
            if (props.leftAction) props.leftAction();
          }}
        >
          <Icon name={props.leftIcon} size={22} color={Global.MainColor} />
        </TouchableOpacity>
      )}
      {props.leftText && (
        <Text style={headerStyles.leftText} onPress={() => {
          if (props.leftAction) props.leftAction();
        }}>{props.leftText}</Text>
      )}
      {props.imageTitle && (
        <Image style={headerStyles.logoImage} source={Media.HouselinkIcon} />
      )}
      {props.title && (
        <Text numberOfLines={1} style={headerStyles.headerTitle}>{props.title}</Text>
      )}
      {props.searchBar && (
        <View style={[headerStyles.searchContainer, props.searchContainer]}>
          <Icon name="search" size={15} color="#7f7f7f" />
          <TextInput
            style={[headerStyles.searchInput]}
            underlineColorAndroid="#00000000"
            placeholder={props.searchPlaceholder}
            placeholderTextColor="#7f7f7f"
            value={searchText}
            returnKeyType="search"
            autoFocus={props.autoFocus && props.autoFocus === true}
            onChangeText={(text) => {
              setSearchText(text);
              if (props.headerChangeText) props.headerChangeText(text);
            }}
            onFocus={onFocus}
            onSubmitEditing={onEndSubmit}
            onEndEditing={onEndSubmit}
            clearTextOnFocus={true}
            clearButtonMode="always"
          />
        </View>
      )}
      {props.right2Icon && (
        <TouchableOpacity
          style={{ right: 40, position: 'absolute', bottom: 12, width: 30, height: 30, justifyContent: 'center', alignItems: 'center' }}
          ref={props.refRight}
          onPress={() => {
            if (props.right2Action) props.right2Action();
          }}
        >
          <Image source={props.right2Icon} resizeMode="contain" />
        </TouchableOpacity>
      )}
      {props.rightIcon && (
        <TouchableOpacity style={headerStyles.iconRight} ref={props.refRight} onPress={() => {
          if (props.rightAction) props.rightAction();
        }}>
          <Icon name={props.rightIcon} size={23} color={Global.MainColor} />

          {props.rightCount > 0 && (
            <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'green', minWidth: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 9, fontFamily: Global.FontName, color: 'white' }}>{props.rightCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      )}
      {props.rightText && (
        <Text style={headerStyles.rightText} onPress={() => {
          if (props.rightAction) props.rightAction();
        }}>{props.rightText}</Text>
      )}
      <View style={headerStyles.headerSeparator} />
    </SafeAreaView>
  );
};

export default Header;
