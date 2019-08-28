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
  Platform
} from 'react-native';

import {isIphoneX, getBottomSpace} from 'src/Global';

const styles = StyleSheet.create({
  container: {
    width: Global.ScreenWidth,
    height: isIphoneX() ? 94 : 60,
    backgroundColor: '#1B5795',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingBottom : getBottomSpace()
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: (isIphoneX() ? 93 : 59) - getBottomSpace(),
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
    width : 20, height : 20,
    borderRadius : 10, backgroundColor: 'red', alignItems: 'center', justifyContent: 'center',
    position: 'absolute',
    top: 5, right: 10
  },
  bagdeText: {
    fontSize : 10,
    color: 'white', fontFamily: Global.FontName
  }
})

import Global, { Media } from 'src/Global';
import { connect } from 'react-redux';

class Tabbar extends React.PureComponent {

  openTab(tabIndex) {
    const { state } = this.props.navigation
    const {routes} = state

    this.props.jumpTo(routes[tabIndex].routeName)
  }

  render() {

    const { navigation, orderCount, cartCount} = this.props;
    const currentIndex = navigation.state.index;

    return (
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

                {orderCount > 0 && 
                  <View style={[styles.notiBagde]}>
                    <Text style={styles.bagdeText}>{orderCount}</Text>
                  </View>
                }
            </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.openTab.bind(this, 2)}>
          <View style={[styles.buttonContainer]}>
            <Image resizeMode='contain' style={[styles.buttonIcon, {tintColor: currentIndex == 2 ? '#FDCC0D' : 'white'}]} source={Media.CartTab} />
            <Text style={[styles.buttonText, {color: currentIndex == 2 ? '#FDCC0D' : 'white'}]}>Giỏ hàng</Text>

            {cartCount > 0 && 
              <View style={[styles.notiBagde]}>
                <Text style={styles.bagdeText}>{cartCount}</Text>
              </View>
            }
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={this.openTab.bind(this, 3)}>
            <View style={[styles.buttonContainer]}>
                <Image resizeMode='contain' style={[styles.buttonIcon, {tintColor: currentIndex == 3 ? '#FDCC0D' : 'white'}]} source={Media.NotificationTab} />
                <Text style={[styles.buttonText, {color: currentIndex == 3 ? '#FDCC0D' : 'white'}]}>Thông báo</Text>
            </View>
        </TouchableWithoutFeedback>

      </View>
    )
  }
}



const mapStateToProps = (state, ownProps) => {
  console.log(state)
  return {
    cartCount: state.cart.count,
    orderCount: state.order.count,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Tabbar);