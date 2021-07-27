import * as actions from '../../constants'

const initialState = {
  isFetching: false,
  items: []
}

const priceVerifyReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case actions["PRICE_VERIFY_START"]:
        return {
          ...state,
          isFetching: true
        }
      case actions["PRICE_VERIFY_SUCCESS"]:
        return {
          ...state,
          isFetching: false,
          items: [...action.payload.items]
          
        }
      case actions["PRICE_VERIFY_ERROR"]:
        return {
          ...state,
          isFetching: false,
  priceVerifyData: null,
        }
      default:
        return state
    }
  }
  
  export default priceVerifyReducer