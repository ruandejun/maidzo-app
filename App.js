/**
 * @flow
 * @providesModule App
 */

import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './src/actions/configureStore';
import { PersistGate } from 'redux-persist/integration/react'
import { SheetProvider } from "react-native-actions-sheet"

import AppWithNavigationState from './src/AppNavigator';

const { store, persistor } = configureStore()

import {
  View,
  Image,
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  logoIcon: {
    width: Global.ScreenWidth * 0.4,
    height: Global.ScreenWidth * 0.4,
    tintColor: Global.MainColor
  }
})

const Splash = () => {
  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image resizeMode='contain' source={Media.LogoIcon} style={styles.logoIcon} />

      <Image source={Media.LoadingIcon} style={{ width: 30, height: 30 }} resizeMode='contain' />
    </View>
  )
}

class App extends React.Component {

  render() {
    return (
      <Provider store={store}>
        <SheetProvider>
          <PersistGate loading={<Splash />} persistor={persistor}>
            <AppWithNavigationState />
          </PersistGate>
        </SheetProvider>
      </Provider>
    );
  }
}

export default App;