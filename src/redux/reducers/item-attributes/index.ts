import * as actions from '../../constants'

const initialState = {
  item: null
}

const itemAttributesReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case actions["ITEM_ATTRIBUTES_START"]:
        return {
          ...state
        }
      case actions["ITEM_ATTRIBUTES_SUCCESS"]:
        return {
          ...state,
          item: action.payload.item
          
        }
      case actions["ITEM_ATTRIBUTES_ERROR"]:
        return {
            ...state,
            item: null,
        }
      default:
        return state
    }
  }
  
  export default itemAttributesReducer