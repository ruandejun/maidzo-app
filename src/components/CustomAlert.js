/**
 * @flow
 * @providesModule CustomAlert
 */

import React from 'react'

import {
    Alert,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
} from 'react-native';

import {Overlay} from 'teaset';
import Global from 'src/Global';

export default CustomAlert = (title, message, buttons) => {
   var newButtons = [];
   if(!buttons || buttons.length == 0){
       newButtons = []
   } else {
       newButtons = buttons;
   }


   let overlayView = (
       <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        overlayOpacity={0.8}
         ref={v => this.overlayView = v}
       >
           <View style={{borderRadius : 14, minHeight : 100, width : 270, backgroundColor : Global.MainColor, justifyContent : 'center', alignItems : 'center'}}>
               <View style={{padding : 16, alignItems : 'center', justifyContent : 'center'}}>
                   {!!title && <Text style={{width : 238, textAlign : 'center', color : 'white', fontSize : 17, fontFamily : Global.FontBold}}>{title}</Text>}
                   {!!message && <Text style={{marginTop : !!title ? 8 : 0, width : 238, textAlign : 'center', color : '#f2f2f2', fontSize : 17, fontFamily : Global.FontRegular}}>{message}</Text>}
               </View>
               <View style={{flexDirection : 'row', height : newButtons.length > 0 ? 44 : 0, alignItems : 'center', justifyContent : 'center'}}>
                   {newButtons.map((item, index) => {
                       return(
                           <TouchableOpacity onPress={() => {this.overlayView && this.overlayView.close(); if(item.onPress) item.onPress()}} style={{flex : 1, alignItems : 'center', justifyContent : 'center', borderRightColor : '#aaaaaa', borderRightWidth : (index < newButtons.length - 1) ? StyleSheet.hairlineWidth : 0}}>
                               <Text style={[{color : item.color ? item.color : '#f2f2f2', fontSize : 17, fontFamily : Global.FontRegular, textAlign : 'center'}]}>{item.text}</Text>
                           </TouchableOpacity>
                       )
                   })}
               </View>
           </View>
         
       </Overlay.View>
     );
     Overlay.show(overlayView);
}