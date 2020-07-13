/**
 * @flow
 * @providesModule Tabbar
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
  TextInput,
  Keyboard,
  SafeAreaView
} from 'react-native';

import {isIphoneX} from 'src/Global';
import { getBottomSpace } from 'react-native-iphone-x-helper';

const styles = StyleSheet.create({
  container: {
    width: Global.ScreenWidth,
    height: 60,
    backgroundColor: '#1B5795',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    flex : 1,
  },
  buttonIcon: {
    width: 25,
    height: 25
  },
  buttonText : {
    fontSize : 10,
    fontFamily : Global.FontName,
    marginTop : 5
  },
  notiBagde: {
    minWidth : 20, height : 20,
    borderRadius : 10, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center',
    position: 'absolute',
    top: 5, right: 10, padding: 2
  },
  bagdeText: {
    fontSize : 10,
    color: 'white', fontFamily: Global.FontName
  }
})

import Global, { Media } from 'src/Global';
import { connect } from 'react-redux';
import firebase from 'react-native-firebase'

class Tabbar extends React.PureComponent {

  openTab(tabIndex) {
    const { state } = this.props.navigation
    const {routes} = state

    this.props.jumpTo(routes[tabIndex].routeName)
  }

  componentDidUpdate(prevProps){
    if(this.props.unread != prevProps.unread){
      const notifications = firebase.notifications()
      notifications.setBadge(this.props.unread)
    }
  }

  render() {

    const { navigation, orderCount, cartCount, unread} = this.props;
    const currentIndex = navigation.state.index;

    return (
      <SafeAreaView style={{backgroundColor: '#1B5795'}}>
        <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.openTab.bind(this, 0)}>
            <View style={[styles.buttonContainer]}>
                <Image resizeMode='contain' style={styles.buttonIcon} source={Media.HomeTab} />
                <Text style={[styles.buttonText, {color: currentIndex == 0 ? '#FDCC0D' : 'white'}]}>Trang chủ</Text>
             </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.openTab.bind(this, 1)}>
            <View style={[styles.buttonContainer]}>
                <Image resizeMode='contain' style={[styles.buttonIcon, {tintColor: currentIndex == 1 ? '#FDCC0D' : 'white'}]} source={Media.OrderTab} />
                <Text style={[styles.buttonText, {color: currentIndex == 1 ? '#FDCC0D' : 'white'}]}>Đơn hàng</Text>

                {false && orderCount > 0 && 
                  <View style={[styles.notiBagde]}>
                    <Text style={styles.bagdeText}>{orderCount}</Text>
                  </View>
                }
            </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => navigation.navigate('CartView')}>
          <View style={[styles.buttonContainer]}>
            <Image resizeMode='contain' style={[styles.buttonIcon, {tintColor: 'white'}]} source={Media.CartTab} />
            <Text style={[styles.buttonText, {color: 'white'}]}>Giỏ hàng</Text>

            {cartCount > 0 && 
              <View style={[styles.notiBagde]}>
                <Text style={styles.bagdeText}>{cartCount}</Text>
              </View>
            }
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.openTab.bind(this, 2)}>
            <View style={[styles.buttonContainer]}>
                <Image resizeMode='contain' style={[styles.buttonIcon, {tintColor: currentIndex == 2 ? '#FDCC0D' : 'white'}]} source={Media.PackageTab} />
                <Text style={[styles.buttonText, {color: currentIndex == 2 ? '#FDCC0D' : 'white'}]}>Kiện hàng</Text>
            </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.openTab.bind(this, 3)}>
            <View style={[styles.buttonContainer]}>
                <Image resizeMode='contain' style={[styles.buttonIcon, {tintColor: currentIndex == 3 ? '#FDCC0D' : 'white'}]} source={Media.NotificationTab} />
                <Text style={[styles.buttonText, {color: currentIndex == 3 ? '#FDCC0D' : 'white'}]}>Thông báo</Text>

                {unread > 0 && 
                <View style={[styles.notiBagde]}>
                  <Text style={styles.bagdeText}>{unread}</Text>
                </View>
              }
            </View>
        </TouchableWithoutFeedback>
        </View>
        

      </SafeAreaView>
    )
  }
}



const mapStateToProps = (state, ownProps) => {
  // console.log(state)
  return {
    cartCount: state.cart.count,
    // orderCount: state.order.count,
    unread: state.notification.unread
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabbar);