/**
 * @flow
 */

import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback
} from 'react-native'

import {SafeAreaView} from 'react-navigation'
import {connect} from 'react-redux'
import Global, {Media} from 'src/Global';
import NavigationService from 'actions/NavigationService';

class ForgotPasswordView extends React.Component{

   state = {
       email: '',
       password: ''
   }

   onLogin(){
    this.props.navigation.navigate('LoginView')
   }

   render(){

       return(
           <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
               <SafeAreaView style={styles.container}>
                    <Image resizeMode='contain' style={styles.logoImage} source={Media.LogoIcon}/>
                    <Text style={styles.viewTitle}>FORGOT PASSWORD</Text>
                    <View style={styles.inputContainer}>
                        <TextInput 
                            value={this.state.email}
                            onChangeText={(text) => this.setState({email: text})}
                            underlineColorAndroid='#00000000'
                            placeholder='E-mail'
                            placeholderTextColor='#CECECE'
                            keyboardType='email-address'
                            style={styles.inputText}/>
                    </View>

                    <TouchableOpacity style={[styles.buttonContainer, {backgroundColor: Global.MainColor}]}>
                        <Text style={styles.loginText}>Forgot Password</Text>
                    </TouchableOpacity>

                    <Text style={styles.signupText}>Already have an account?
                        <Text style={{color: '#3358FF'}} onPress={this.onLogin.bind(this)}>{'  Sign In'}</Text>
                    </Text>
            </SafeAreaView>
           </TouchableWithoutFeedback>
       )
   }
}

const mapPropsToState = (state, ownProps) => {
   return {
     isFetching : state.auth.isFetching
   }
 }
 
 const mapDispatchToState = dispatch => {
   return {
   }
 }
 
 export default connect(mapPropsToState, mapDispatchToState)(ForgotPasswordView);


 const styles = StyleSheet.create({
    container: {
        flex : 1,
        alignItems : 'center',
        justifyContent: 'center',
        backgroundColor: '#f6f6f6'
    },
    logoImage: {
        height : 80,
        width : 80
    },
    viewTitle: {
        fontFamily: Global.FontName,
        fontWeight: 'bold',
        fontSize: 20, marginTop: 40, marginBottom : 20,
    },
    inputContainer: {
        height : 50, 
        borderRadius : 25,
        width : 300,
        padding: 5,
        paddingLeft: 15, paddingRight : 15,
        backgroundColor: 'white',
        shadowColor: '#A8A8A8',
        shadowOpacity: 0.5,
        shadowRadius: 1,
        shadowOffset: {
          height: 1,
          width: 0,
        },
       elevation : 1,
       flexDirection: 'row',
       alignItems: 'center',
       justifyContent: 'center',
       marginTop : 10
    },
    inputText: {
        flex: 1,
        padding : 0,
        fontFamily: Global.FontName,
        color: 'black',
        fontSize : 15
    },
    signupText: {
         color: '#333333',
         fontFamily: Global.FontName,
         fontSize : 13,
         width : 300,
         textAlign: 'center',
         marginTop : 10
    },
    forgotPassword: {
        textDecorationLine: 'underline',
        color: '#333333',
        fontFamily: Global.FontName,
        fontSize : 13,
        width : 300,
        textAlign : 'right',
        marginTop : 10
    },
    buttonContainer: {
         height : 50, 
         borderRadius : 25,
         width : 300,
         flexDirection: 'row',
         alignItems: 'center',
         justifyContent: 'center',
         marginTop : 15
    },
    loginText: {
        color: 'white',
        fontSize : 14,
        fontWeight: 'bold',
        fontFamily: Global.FontName,
        textAlign: 'center',
        flex : 1
    },
    socialIcon: {
        width : 50, height : 50, borderRadius: 25,
    },
    googleText: {
         color: '#333333',
         fontSize : 14,
         fontFamily: Global.FontName,
         textAlign: 'center',
         flex : 1
    }
 })