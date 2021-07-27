import getConfig from '../config';

class DepartmentsService {
    setHeaders(token: string, config: any) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'nep-organization': config.organization,
            'nep-enterprise-unit': config.enterpriseUnit,
            'authorization': `AccessToken ${token}`
        }
    }
    async getDepartments(token: string, departmentId?: string, categoryId?: string) {
        let config = getConfig();
        var url = `${config.baseUrl}${config.endpoints.departments}`
        
        if (departmentId && categoryId) {
            url += `?parentId=${departmentId}-${categoryId}`
        } else if (departmentId) {
            url += `?parentId=${departmentId}`
        }

        let headers = this.setHeaders(token, config);
        try {   
            let response = await fetch(
                url,
                {
                    method: 'GET',
                    headers
                }
            )
            if (!response.ok) {
                return { data: undefined, error: true}
            }
            let jsonResponse = await response.json()
            return { data: jsonResponse, error: false }
        } catch (err) {
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }
    }    
}
export default new DepartmentsService();