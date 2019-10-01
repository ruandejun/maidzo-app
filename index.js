/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Client } from 'bugsnag-react-native';
const bugsnag = new Client("2832e561b229d293a0aece7791a2cfb4");

AppRegistry.registerComponent(appName, () => App);
