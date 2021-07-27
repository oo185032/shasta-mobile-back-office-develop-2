import {
    USER_LOGOUT,
    USER_LOGIN_ERROR,
    USER_LOGIN_START,
    USER_LOGIN_SUCCESS,
} from "../../constants"
import UserService from '../../../services/userService'

export function userLogin(username: string, password: string) {
    return async (dispatch: any, getState: any) => {
        try {
            dispatch({ type: USER_LOGIN_START })
            const userData = await UserService.userLogin(username, password)
            if (!userData.error) {
                dispatch({ type: USER_LOGIN_SUCCESS, payload: {...userData.data} })
            } else {
                dispatch({ type: USER_LOGIN_ERROR })
                return { error: true }
            }
            return { error: false }
        } catch (err) {
            // Handle the erors in a centralized way
            dispatch({ type: USER_LOGIN_ERROR })
            return { error: true }
        }
    }
}

export function userLogout() {
    return {
        type: USER_LOGOUT
    }
}