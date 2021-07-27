import * as actions from '../../constants'

const initialState = {
    ldClient: null
}

const launchDarklyReducer = (state = initialState, action: any) => {
    switch (action.type) {
        case actions["LAUNCH_DARKLY_SUCCESS"]:
            return {
                ...state,
                ldClient: action.payload
            }
        case actions["LAUNCH_DARKLY_ERROR"]:
            return {
                ...state,
                ldClient: null,
            }
      default:
            return state
    }
}
  
export default launchDarklyReducer