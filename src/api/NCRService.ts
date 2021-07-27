import { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import {Api} from "../api/Api";
import {User, LoginCredentials} from "../redux/store/User"
import * as dotenv from 'dotenv';

export class NCRService extends Api {

    constructor (config: AxiosRequestConfig) {
        // TODO: set config
        super(config);
    }

    public loginUser (credentials: LoginCredentials): Promise<User> {
        return this.post<User>('/login', JSON.stringify(credentials))
            .then((response: AxiosResponse<User>) => {
                const { data } = response;

                const state: User = {
                    id: data.id,
                    username: data.username,
                    email: data.email
                };

                return state;
            })
            .catch((error: AxiosError) => {
                throw error;
            });
    }
}