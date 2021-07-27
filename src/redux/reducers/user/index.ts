import * as actions from '../../constants'

const initialState = {
  isUserLoggingIn: false,
  hasUserLoggedIn: false,
  userData: {}
}

const userReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case actions["USER_LOGIN_START"]:
        return {
          ...state,
          isUserLoggingIn: true
        }
      case actions["USER_LOGIN_SUCCESS"]:
        return {
          ...state,
          isUserLoggingIn: false,
          hasUserLoggedIn: true,
          userData: { ...action.payload }
        }
      case actions["USER_LOGIN_ERROR"]:
        return {
          ...state,
          isUserLoggingIn: false,
          hasUserLoggedIn: false,
          userData: null
        }
      default:
        return state
    }
  }
  
  export default userReducer
  