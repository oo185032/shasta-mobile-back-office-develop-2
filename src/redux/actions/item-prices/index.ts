import {
  ITEM_PRICES_ERROR,
  ITEM_PRICES_START,
  ITEM_PRICES_SUCCESS,
  OVERRIDE_ITEM_PRICES_START,
  OVERRIDE_ITEM_PRICES_SUCCESS,
  OVERRIDE_ITEM_PRICES_ERROR,
} from '../../constants';
import ItemPricesService from '../../../services/itemPricesService';
import { OverridePrice } from '../../store/itemPrices';

export function getItemPrices(barcode: string, isCurrentPrice?: boolean) {
  return async (dispatch: any, getState: any) => {
    try {
      const {
        user: {
          userData: { token },
        },
      } = getState();
      dispatch({ type: ITEM_PRICES_START });
      const itemData = await ItemPricesService.getItemPrices(token, barcode, isCurrentPrice);

      if (!itemData.error) {
        dispatch({ type: ITEM_PRICES_SUCCESS, payload: { ...itemData.data } });
        return { error: false };
      } else {
        return { error: true };
      }
    } catch (err) {
      // Handle the erors in a centralized way
      dispatch({ type: ITEM_PRICES_ERROR });
      return { error: true };
    }
  };
}

export function createOverrideItemPrices(itemCode: string, newPrice: OverridePrice) {
  return async (dispatch: any, getState: any) => {
    try {
      const {
        user: {
          userData: { token },
        },
      } = getState();
      dispatch({ type: OVERRIDE_ITEM_PRICES_START });
      const itemData = await ItemPricesService.createOverrideItemPrices(token, itemCode, newPrice);

      if (!itemData.error) {
        dispatch({ type: OVERRIDE_ITEM_PRICES_SUCCESS, payload: { ...itemData.data } });
        return { error: false };
      } else {
        return { error: true };
      }
    } catch (err) {
      // Handle the erors in a centralized way
      dispatch({ type: OVERRIDE_ITEM_PRICES_ERROR });
      return { error: true };
    }
  };
}
