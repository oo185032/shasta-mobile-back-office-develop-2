import * as actions from '../../constants'

const initialState = {
    isAvailableZebraScanner: false
}

const dataWedgeReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actions["DATA_WEDGE_STATE"]:
            return {
                ...state,
                isAvailableZebraScanner: action.payload
            }
        default:
            return state
    }
}
  
export default dataWedgeReducer