import {
  INVENTORY_CREATE_DOCUMENT_START,
  INVENTORY_CREATE_DOCUMENT_SUCCESS,
  INVENTORY_CREATE_DOCUMENT_ERROR,
} from '../../constants';
import InventoryService from '../../../services/inventoryService';
import { createUserDocument } from '../../../utils/RealmUtils';
export function createDocument(name: string, type: string) {
  return async (dispatch: any, getState: any) => {
    try {
      const {
        user: {
          userData: { token },
        },
      } = getState();
      dispatch({ type: INVENTORY_CREATE_DOCUMENT_START });
      const response = await InventoryService.createDocument(token, name, type);
      if (!response.error) {
        await dispatch({ type: INVENTORY_CREATE_DOCUMENT_SUCCESS, payload: response.data });
        const documentResponse = await createUserDocument(response.data.documentID);

        return { error: false };
      } else {
        return { error: true };
      }
    } catch (err) {
      // Handle the erors in a centralized way
      dispatch({ type: INVENTORY_CREATE_DOCUMENT_ERROR });
      return { error: true };
    }
  };
}
