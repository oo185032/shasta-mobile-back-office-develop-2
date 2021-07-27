import base64 from "react-native-base64";
import uuid from 'react-native-uuid';
import getConfig from '../config';

class UserService {
    async setHeaders(username: string, password: string, config: any) {
        const auth = 'Basic ' + base64.encode(username + ':' + password); 
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'nep-organization': config.organization,
            'Authorization': auth,
            // remove this when no longer a required header
            'nep-correlation-id': uuid.v4().toString(),
        }
    }

    async userLogin(username: string, password: string) {
        const config = getConfig();
        const loginUrl = `${config.baseUrl}${config.endpoints.login}`
        const headers = await this.setHeaders(username, password, config)

        try {   
            const response = await fetch(
                loginUrl,
                {
                    method: 'POST',
                    headers
                }
            )
            
            if (!response.ok) {
                return { data: undefined, error: true}
            }
            const jsonResponse = await response.json()
            return { data: jsonResponse, error: false }
        } catch (err) {
            return { data: undefined, error: true}
        }
    }
}

export default new UserService();