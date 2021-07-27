import { ITEM_DETAILS_START, ITEM_DETAILS_SUCCESS, ITEM_DETAILS_ERROR, ITEM_PRICE_RELEASED_TO_POS, CLEAR_ITEM_PRICE_RELEASED_TO_POS } from '../../constants'

const initialState = {
  isItemFetching: false,
  items: [],
  isPriceReleased: false
}

const itemDetailsReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case ITEM_DETAILS_START: 
        return {
          ...state
        }
      case ITEM_DETAILS_SUCCESS:
        return {
          ...state,
          isItemFetching: false,
          items: [...action.payload.items]
        }
      case ITEM_DETAILS_ERROR:
        return {
          ...state,
          isItemFetching: false,
          items: []
        }
      case ITEM_PRICE_RELEASED_TO_POS:
        return {
          ...state,
          isPriceReleased: true
        }
      case CLEAR_ITEM_PRICE_RELEASED_TO_POS:
        return {
          ...state,
          isPriceReleased: false
        }
      default:
        return state
    }
  }
  
  export default itemDetailsReducer
  