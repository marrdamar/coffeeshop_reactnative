/* eslint-disable prettier/prettier */
/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
// import App from './App';
// import Welcome from './src/screens/Welcome';
// import Auth from './src/screens/Auth';
// import Signup from './src/screens/Auth/Signup';
import Router from './router';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => Router);
