/**
 * @flow
 * @providesModule Header
 */

import React from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  StatusBar,
  PixelRatio,
  Platform,
  TouchableOpacity,
  TextInput,
  Dimensions, AsyncStorage,
  FlatList
} from 'react-native';

import {isIphoneX} from 'src/Global'

export const headerStyles = StyleSheet.create({

 container : {
   backgroundColor: 'white',
   flexDirection : 'row',
   justifyContent: 'center',
   paddingTop: Platform.OS === 'ios' ? (isIphoneX() ? 50 : 20) : 0,
   // borderBottomWidth: Platform.OS ? 1 / PixelRatio.getPixelSizeForLayoutSize(1) : 0,
   height: isIphoneX() ? 84 : 64,
   top: 0,
   left: 0,
   right: 0,
   width : Global.ScreenWidth
 },
 buttonIcon : {
   width : 24,
   height : 24,
 },
 iconLeft : {
   left : 8,
   position : 'absolute',
   bottom : 0,
   width : 30,
   height : 30,
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
   fontWeight : '700',
   fontFamily : Global.FontName,
   alignItems : 'center',
   textAlign : 'center',
   textAlignVertical : 'center',
   color : Global.MainColor,
   position : 'absolute',
   left : 60, width : Global.ScreenWidth - 120,
   bottom : 8
 },
 searchContainer : {
   borderRadius : 3,
   backgroundColor : '#e5e5e5',
   alignItems : 'center',
   justifyContent : 'center',
   flexDirection : 'row',
   position : 'absolute',
   left : 50, width : Global.ScreenWidth - 100,
   bottom : 8,
   overflow : 'hidden',
   padding : 3,
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
   marginRight : 8,
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

import Global from 'src/Global';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default class Header extends React.Component{

  constructor(props){
    super(props);

    this.state = {
      openRecent : false,
      recents : [],
    }
  }

  onEndSubmit(event){
    // console.log(event)
    // AsyncStorage.getItem('recent_search_keywords', (error, result) => {
    //   if(result){
    //     try {
    //       var recents = JSON.parse(result);
    //       recents.push({key : event.nativeEvent.text})
    //       this.setState({openRecent : false});

    //       AsyncStorage.setItem('recent_search_keywords', JSON.stringify(recents), (error) => {
    //         console.log(error);
    //       })
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // })
  }

  onFocus(){
    // AsyncStorage.getItem('recent_search_keywords', (error, result) => {
    //   console.log({error : error, result : result});
    //   if(result){
    //     try {
    //       var recents = JSON.parse(result);
    //       this.setState({recents : recents});
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   }
    // })
  }

  onSelectRecent(item){
    this.setState({openRecent : false}, () => {
      if(this.props.headerChangeText){
        this.props.headerChangeText(item.key);
      }
    })
  }

 render(){

   const {leftIcon, autoFocus, leftText, leftAction, imageTitle, title, rightIcon, rightText, rightAction, right2Icon, right2Action, searchPlaceholder, searchText, onFocusSearch, headerChangeText, searchBar, refRight, cartCountText} = this.props;
 
   return(
     <View style={headerStyles.container}>
       <StatusBar translucent barStyle='dark-content' backgroundColor='#00000000'/>
       {leftIcon &&
         <TouchableOpacity style={headerStyles.iconLeft} onPress={() => {if(leftAction) leftAction()}}>
           <Icon name={leftIcon} size={18} color={'#333333'}/>
         </TouchableOpacity>
       }
       {leftText &&
          <Text style={headerStyles.leftText} onPress={() => {if(leftAction) leftAction()}}>{leftText}</Text>  
       }
       {imageTitle && 
         <Image style={headerStyles.logoImage} source={Media.HouselinkIcon}/>
       }
       {title && 
         <Text numberOfLines={1} style={headerStyles.headerTitle}>{title}</Text>
       }
       {searchBar && 
         <View style={[headerStyles.searchContainer, !rightIcon && !rightText ? {width : Global.ScreenWidth - 60} : {}]}>
           <Image source={Media.SearchIcon} style={headerStyles.searchIcon}/>
           <TextInput 
             style={[headerStyles.searchInput, ]}
             underlineColorAndroid='#00000000'
             placeholder={searchPlaceholder}
             placeholderTextColor='#7f7f7f'
             value={searchText}
             autoFocus={(autoFocus && autoFocus == true) ? true : false}
             onChangeText={(text) => {if(headerChangeText) headerChangeText(text)}}
             onFocus={() => {if(onFocusSearch) onFocusSearch()}}
             onSubmitEditing={this.onEndSubmit.bind(this)}
             onEndEditing={this.onEndSubmit.bind(this)}
           />
         </View>
       }
       {right2Icon &&
         <TouchableOpacity style={{right : 40, position : 'absolute', bottom : 12, width : 30, height : 30, justifyContent: 'center', alignItems: 'center'}} ref={refRight} onPress={() => {if(right2Action) right2Action()}}>
           <Image source={right2Icon} resizeMode='contain'/>
         </TouchableOpacity>
       }
       {rightIcon &&
         <TouchableOpacity style={headerStyles.iconRight} ref={refRight} onPress={() => {if(rightAction) rightAction()}}>
           <Icon name={rightIcon} size={18} color={'#333333'}/>
         </TouchableOpacity>
       }
       {rightText &&
         <Text style={headerStyles.rightText} onPress={() => {if(rightAction) rightAction()}}>{rightText}</Text>
       }
       <View style={headerStyles.headerSeparator}/>
       {false && this.state.openRecent && this.state.recents.length > 0 && searchText.length == 0 &&
        <FlatList 
          data={this.state.recents}
          renderItem={({item, index}) => {
            return(
              <TouchableOpacity style={{flexDirection : 'row', height : 40, }} onPress={this.onSelectRecent.bind(this, item)}>
                <Text style={{fontSize : 14, color : '#333333', fontFamily : Global.FontName,}}>{item.key}</Text>
              </TouchableOpacity>
            )
          }}
          ListHeaderComponent={() => {
            return(
              <Text style={{height : 40, fontWeight : '500', color : '#666666', fontFamily : Global.FontName}}>Recent Search</Text>
            )
          }}
        />
      }
     </View>
   )
 }
}