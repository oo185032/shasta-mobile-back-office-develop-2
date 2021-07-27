import {
  SAVE_APP_OPTIONS
} from "../../constants"
import { store } from '../../store';

export function saveAppOptions(organization: string, enterpriseUnit: string, environment: string) {
  return store.dispatch({ type: SAVE_APP_OPTIONS, payload: {
    organization,
    enterpriseUnit,
    environment,
  }});
}