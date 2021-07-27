import {
    GET_DEPARTMENTS_START,
    GET_DEPARTMENTS_SUCCESS,
    GET_CATEGORIES_SUCCESS,
    GET_SUB_CATEGORIES_SUCCESS,
    GET_DEPARTMENTS_ERROR,
} from "../../constants"
import DepartmentsService from "../../../services/departmentsService";
import { Department } from "../../store/departments";

export const EMPTY_KEY = '_empty';
export const EMPTY_VALUE = ' ';

export function getDepartments(departmentId?: string, categoryId?: string, withEmptyItem: boolean = false) {
    return async (dispatch: any, getState: any) => {
        try {
            const { user: { userData: {token}}} = getState();
            dispatch({ type: GET_DEPARTMENTS_START })
            const deptData = await DepartmentsService.getDepartments(token, departmentId, categoryId)
        
            if (deptData) {
                let departments = deptData.data.departments;
                if (withEmptyItem) {
                    const emptyDepartment: Department = {departmentId: EMPTY_KEY, departmentName: EMPTY_VALUE};
                    departments.unshift(emptyDepartment);
                }

                if (departmentId && categoryId) {
                    dispatch({ type: GET_SUB_CATEGORIES_SUCCESS, payload: departments})
                } else if (departmentId) {
                    dispatch({ type: GET_CATEGORIES_SUCCESS, payload: departments})
                } else {
                    dispatch({ type: GET_DEPARTMENTS_SUCCESS, payload: departments})
                }
                return { error: false }
            } else {
                return { error: true }
            }
        } catch (err) {
            // Handle the erors in a centralized way
            dispatch({ type: GET_DEPARTMENTS_ERROR })
            return { error: true }
        }
    }    
}