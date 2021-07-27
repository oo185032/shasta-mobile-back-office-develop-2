/**
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import { store, persistor} from './src/redux/store';
import React, {useEffect, useState} from 'react';
import { Provider } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import {NavigationContainer} from '@react-navigation/native';
import LDClient from 'launchdarkly-react-native-client-sdk';
import { registerCustomIconType } from 'react-native-elements';
import { PersistGate } from 'redux-persist/integration/react';
import AuthNavigator from './src/navigations/AuthNavigator';
import CustomIcon from './src/styles/CustomIcon';
import { LAUNCH_DARKLY_SUCCESS } from './src/redux/constants';
import './src/i18n';
import getConfig from './src/config';

const App = () => {
  const config = getConfig();
  const client = new LDClient();
  const clientConfig = {
    mobileKey: `${config.mobileKey}`
  };
  const userConfig = {key: 'useremail@ncr.com'};
  const [signupFlag, setSignupFlag] = useState(false);
  const initializeLDClient = async () => {
    try {
      await client.configure(clientConfig, userConfig);
      store.dispatch({ type: LAUNCH_DARKLY_SUCCESS, payload: client })
      await initilaizeAllFlags();
    } catch (err) {
      if(err.message !== 'Client was already initialized'){
        console.error(`Error initializing LD client: ${err.message}`);
      }
    }
  }

  const initilaizeAllFlags = async () => {
    const boolFlag = await client.boolVariation('signup', false);
    if (boolFlag) {
      setSignupFlag(boolFlag)
    }
  }

  useEffect(() => {
    SplashScreen.hide();
    registerCustomIconType("app_icon", CustomIcon);
    initializeLDClient();
  }, []);
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <NavigationContainer>
          <AuthNavigator />
        </NavigationContainer>
      </PersistGate>
    </Provider>
  );
};

export default App;
