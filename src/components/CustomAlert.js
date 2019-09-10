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

   if(Global.overlayPopView){
    Global.overlayPopView.close()
   }

   let overlayView = (
       <Overlay.View
        style={{alignItems: 'center', justifyContent: 'center'}}
        overlayOpacity={0.8}
         ref={v => Global.overlayPopView = v}
       >
           <View style={{borderRadius : 10, minHeight : 100, width : 270, backgroundColor : 'white', justifyContent : 'center', alignItems : 'center'}}>
               <View style={{padding : 16, alignItems : 'center', justifyContent : 'center'}}>
                   {!!title && <Text style={{width : 238, textAlign : 'center', color : 'black', fontSize : 17, fontFamily : Global.FontBold}}>{title}</Text>}
                   {!!message && <Text style={{marginTop : !!title ? 8 : 0, width : 238, textAlign : 'center', color : '#333333', fontSize : 14, fontFamily : Global.FontRegular}}>{message}</Text>}
               </View>
               <View style={{flexDirection : 'row', height : 44, alignItems : 'center', justifyContent : 'center', borderTopColor: '#aaaaaa', borderTopWidth: 0.5, }}>
                   {newButtons && newButtons.length > 0 && newButtons.map((item, index) => {
                       return(
                           <TouchableOpacity onPress={() => {Global.overlayPopView && Global.overlayPopView.close(); if(item.onPress) item.onPress()}} style={{flex : 1, alignItems : 'center', justifyContent : 'center', borderRightColor : '#aaaaaa', borderRightWidth : (index < newButtons.length - 1) ? StyleSheet.hairlineWidth : 0}}>
                               <Text style={[{color : item.color ? item.color : Global.MainColor, fontSize : 17, fontFamily : Global.FontRegular, textAlign : 'center'}]}>{item.text}</Text>
                           </TouchableOpacity>
                       )
                   })}
                   {(! newButtons || newButtons.length == 0) && 
                    <TouchableOpacity onPress={() => {Global.overlayPopView && Global.overlayPopView.close(); }} style={{flex : 1, alignItems : 'center', justifyContent : 'center'}}>
                        <Text style={[{color : Global.MainColor, fontSize : 17, fontFamily : Global.FontRegular, textAlign : 'center'}]}>{'Ok'}</Text>
                    </TouchableOpacity>
                    }
               </View>
           </View>
         
       </Overlay.View>
     );
     Overlay.show(overlayView);
}