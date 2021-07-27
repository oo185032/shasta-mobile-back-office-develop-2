import * as actions from "../../constants";

const initialState = {
  showCustomAlert: false,
  showErrorAlert: false
};

const customAlertReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actions["DETECT_CHANGE"]:
      return {
        ...state,
        showCustomAlert: action.payload.showCustomAlert,
        showErrorAlert: action.payload.showErrorAlert,
      };
    default:
      return state;
  }
};

export default customAlertReducer;
