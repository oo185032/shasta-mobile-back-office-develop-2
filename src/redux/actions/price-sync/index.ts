import {
    PRICE_SYNC_START,
    PRICE_SYNC_SUCCESS,
    PRICE_SYNC_ERROR,
    ITEM_PRICE_RELEASED_TO_POS
} from "../../constants"
import ItemService from "../../../services/itemService";

export function priceSynchronization(itemCode: string, priceCode: string) {
  return async (dispatch: any, getState: any) => {
      try {
        const { user: { userData: {token}}} = getState();
          dispatch({ type: PRICE_SYNC_START })
          const response = await ItemService.priceSynchronization(itemCode, priceCode, token)
          if (!response.error) {
              dispatch({ type: PRICE_SYNC_SUCCESS, payload: undefined })
              dispatch({ type: ITEM_PRICE_RELEASED_TO_POS })
          }
          return { error: false }
      } catch (err) {
          // Handle the erors in a centralized way
          dispatch({ type: PRICE_SYNC_ERROR })
          return { error: true }
      }
  }
}