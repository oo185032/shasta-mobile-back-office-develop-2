import { INVENTORY_CREATE_DOCUMENT_START,
    INVENTORY_CREATE_DOCUMENT_SUCCESS,
    INVENTORY_CREATE_DOCUMENT_ERROR,} from '../../constants'

const initialState = {
  isDocumentCreate: false,
  documentData: {},
}

const inventoryReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case INVENTORY_CREATE_DOCUMENT_START: 
        return {
          ...state,
          isDocumentCreate:true
        }
      case INVENTORY_CREATE_DOCUMENT_SUCCESS:
        return {
          ...state,
          isDocumentCreate: false,
          documentData: {...action.payload}
        }
      case INVENTORY_CREATE_DOCUMENT_ERROR:
        return {
          ...state,
          isDocumentCreate: false,
          documentData: {}
        }
     
      default:
        return state
    }
  }
  
  export default inventoryReducer
  