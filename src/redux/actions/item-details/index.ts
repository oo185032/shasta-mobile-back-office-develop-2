import {
    ITEM_DETAILS_START,
    ITEM_DETAILS_SUCCESS,
    ITEM_DETAILS_ERROR,
    ITEM_PRICE_RELEASED_TO_POS,
    CLEAR_ITEM_PRICE_RELEASED_TO_POS,
    PRICE_VERIFY_START,
    PRICE_VERIFY_SUCCESS,
    PRICE_VERIFY_ERROR,
    ITEM_ATTRIBUTES_START,
    ITEM_ATTRIBUTES_SUCCESS,
    ITEM_ATTRIBUTES_ERROR,
    CREATE_NEW_ITEM_START,
    CREATE_NEW_ITEM_SUCCESS,
    CREATE_NEW_ITEM_ERROR,
    EDIT_ITEM_ATTRIBUTES_START,
    EDIT_ITEM_ATTRIBUTES_ERROR,
} from "../../constants"
import ItemService from "../../../services/itemService";
import { ItemWithAtrributesToEdit, NewItem } from "../../store/itemAttributes";

export function searchItemDetails(barcode: string, startDate?: Date, endDate?: Date) {
  return async (dispatch: any, getState: any) => {
      try {
          const { user: { userData: {token}}} = getState();
          dispatch({ type: ITEM_DETAILS_START })
          const itemData = await ItemService.searchItemDetails(barcode, token, startDate, endDate)
          if (!itemData.error) {
              dispatch({ type: ITEM_DETAILS_SUCCESS, payload: {...itemData.data} })
              return { error: false }
          } else {
              return { error: true }
          }
      } catch (err) {
          // Handle the erors in a centralized way
          dispatch({ type: ITEM_DETAILS_ERROR })
          return { error: true }
      }
  }
}

export function setPriceReleased() {
    return {
        type: ITEM_PRICE_RELEASED_TO_POS
    }
}

export function clearPriceReleased() {
    return {
        type: CLEAR_ITEM_PRICE_RELEASED_TO_POS
    }
}

export function priceVerify(barcode: string, isCurrentPrice?: boolean) {
    return async (dispatch: any, getState: any) => {
        try {
            const { user: { userData: {token}}} = getState();
            dispatch({ type: PRICE_VERIFY_START })
            const itemData = await ItemService.priceVerification(token,barcode, isCurrentPrice)
        
            if (itemData) {
                dispatch({ type: PRICE_VERIFY_SUCCESS, payload: {...itemData.data}})
                return { error: false }
            } else {
                return { error: true }
            }
        } catch (err) {
            // Handle the erors in a centralized way
            dispatch({ type: PRICE_VERIFY_ERROR })
            return { error: true }
        }
    }
  }

export function getItemAttributes(barcode: string) {
    return async (dispatch: any, getState: any) => {
        try {
            const { user: { userData: {token}}} = getState();
            dispatch({ type: ITEM_ATTRIBUTES_START })
            const itemData = await ItemService.getItemAttributes(token, barcode)
        
            if (!itemData.error) {
                dispatch({ type: ITEM_ATTRIBUTES_SUCCESS, payload: {...itemData.data}})
                return { error: false }
            } else {
                return { error: true }
            }
        } catch (err) {
            // Handle the erors in a centralized way
            dispatch({ type: ITEM_ATTRIBUTES_ERROR })
            return { error: true }
        }
    }    
}

export function createNewItem(newItem: NewItem) {
    return async (dispatch: any, getState: any) => {
        try {
            const { user: { userData: {token}}} = getState();
            dispatch({ type: CREATE_NEW_ITEM_START });
            const result = await ItemService.createNewItem(token, newItem);
            return result
        } catch (err) {
            // Handle the erors in a centralized way
            dispatch({ type: CREATE_NEW_ITEM_ERROR })
            return { error: true }
        }
    }    
}

export function editItem( itemCode: string, item: ItemWithAtrributesToEdit ) {
    return async (dispatch: any, getState: any) => {
        try {
            const { user: { userData: {token}}} = getState();
            dispatch({ type: EDIT_ITEM_ATTRIBUTES_START });
            const result = await ItemService.editItem(token, itemCode, item);
            return result;
        } catch (error) {
            // Handle the erors in a centralized way
            dispatch({ type: EDIT_ITEM_ATTRIBUTES_ERROR })
            return { error: true }            
        }
    }    
}


