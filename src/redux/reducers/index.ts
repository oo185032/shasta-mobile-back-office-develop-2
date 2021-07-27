import { combineReducers } from 'redux'
import userReducer from './user'
import itemDetailsReducer from './item-details'
import priceVerifyReducer from './price-verify'
import launchDarklyReducer from './launch-darkly'
import appOptionsReducer from './app-options'
import dataWedgeReducer from './data-wedge'
import itemAttributesReducer from './item-attributes'
import inventoryReducer from './inventory'
import departmentsReducer from './departments'
import customAlertReducer from './customAlerts'
import itemPricesReducer from './item-prices'

const appReducer = combineReducers({
    user: userReducer,
    itemDetails: itemDetailsReducer,
    priceVerify: priceVerifyReducer,
    launchDarkly: launchDarklyReducer,
    dataWedge: dataWedgeReducer,
    itemAttributes: itemAttributesReducer,
    appOptions: appOptionsReducer,
    inventory: inventoryReducer,
    departments: departmentsReducer,
    customAlerts: customAlertReducer,
    itemPrices: itemPricesReducer
})

const rootReducer = (state: any, action: any) => {
    if (action.type === 'USER_LOGOUT') {
        state = undefined
    }
  
    return appReducer(state, action)
}

export default rootReducer;
