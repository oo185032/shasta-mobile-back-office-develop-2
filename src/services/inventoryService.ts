import getConfig from '../config';

class InventoryService {
    setHeaders(token: string, config: any) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'nep-organization': config.organization,
            'nep-enterprise-unit': config.enterpriseUnit,
            'authorization': `AccessToken ${token}`
        }
    }

    async createDocument(token: string,documentName: string, documentType: string) {
        const config = getConfig();
        const inventoryDocumentUrl = `${config.baseUrl}${config.endpoints.inventoryCreateDocument}`
        const headers = await this.setHeaders(token, config);
        const body = {
            name: documentName,
            description: "Very descriptive text about this document.",
            type: documentType
        }
       
        try {   
            
            const response = await fetch(
                inventoryDocumentUrl,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(body) 
                }
            )
            
            if (!response.ok) {
                return { data: undefined, error: true}
            }
            const jsonResponse = await response.json()
            return { data: jsonResponse, error: false }
        } catch (err) {  
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }
    }

 }

export default new InventoryService();