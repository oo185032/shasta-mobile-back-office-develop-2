import * as actions from '../../constants'

const initialState = {
    departments: [],
    categories: [],
    subCategories: []
}

const departmentsReducer = (state = initialState, action: any) => {
    switch (action.type) {
      case actions["GET_DEPARTMENTS_START"]:
        return {
          ...state
        }
      case actions["GET_DEPARTMENTS_SUCCESS"]:
        return {
          ...state,
          departments: action.payload
          
        }
      case actions["GET_CATEGORIES_SUCCESS"]:
        return {
          ...state,
          categories: action.payload
          
        }
      case actions["GET_SUB_CATEGORIES_SUCCESS"]:
        return {
          ...state,
          subCategories: action.payload
          
        }
      case actions["GET_DEPARTMENTS_ERROR"]:
        return {
            ...state,
            departments: [],
            categories: [],
            subCategories: []
        }
      default:
        return state
    }
  }
  
  export default departmentsReducer