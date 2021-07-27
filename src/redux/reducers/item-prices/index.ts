import * as actions from '../../constants';

const initialState = {
  item: null,
};

const itemPricesReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actions['ITEM_PRICES_START']:
      return {
        ...state,
      };
    case actions['ITEM_PRICES_SUCCESS']:
      return {
        ...state,
        item: action.payload.item,
      };
    case actions['ITEM_PRICES_ERROR']:
      return {
        ...state,
        item: null,
      };
    case actions['OVERRIDE_ITEM_PRICES_START']:
      return {
        ...state,
      };
    case actions['OVERRIDE_ITEM_PRICES_SUCCESS']:
      return {
        ...state,
        item: action.payload.item,
      };
    case actions['OVERRIDE_ITEM_PRICES_ERROR']:
      return {
        ...state,
        item: null,
      };
    default:
      return state;
  }
};

export default itemPricesReducer;
