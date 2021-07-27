import {
    DETECT_CHANGE
} from "../../constants"

export function setDetectChangeCustomAlert(showCustomAlert : boolean) {
    return async (dispatch: any, getState: any) => {
        const { customAlerts } = getState();
        customAlerts.showCustomAlert = showCustomAlert
        try {
            dispatch({ type: DETECT_CHANGE, payload: customAlerts })
            return { error: false }
        } catch (err) {
            // Handle the erors in a centralized way
            customAlerts.showCustomAlert = false
            dispatch({ type: DETECT_CHANGE , payload: customAlerts})
            return { error: true }
        }
    }    
}

export function setDetectChangeErrorAlert(showErrorAlert : boolean) {
    return async (dispatch: any, getState: any) => {
        const { customAlerts } = getState();
        customAlerts.showErrorAlert = showErrorAlert
        try {
            dispatch({ type: DETECT_CHANGE, payload: customAlerts })
            return { error: false }
        } catch (err) {
            // Handle the erors in a centralized way
            customAlerts.showErrorAlert = false
            dispatch({ type: DETECT_CHANGE , payload: customAlerts})
            return { error: true }
        }
    }    
}