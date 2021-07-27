import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistReducer } from 'redux-persist';
import * as actions from '../../constants';
const commonConfig = require('../../../config/common.json')

const appOptionsConfig = {
  key: 'appOptions',
  storage: AsyncStorage,
}

const initialState = commonConfig.defaults;

const appOptionsReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case actions["SAVE_APP_OPTIONS"]:
        return {
          ...state,
          ...action.payload,
        }
      default:
        return state
    }
  }
  
  export default persistReducer(appOptionsConfig, appOptionsReducer);
  