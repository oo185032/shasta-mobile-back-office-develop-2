import moment from 'moment';
import uuid from 'react-native-uuid';
import getConfig from '../config';
import { ItemWithAtrributesToEdit, NewItem } from '../redux/store/itemAttributes';

export const UPC_DUPLICATE_ERROR = 409;

class ItemService {
    setHeaders(token: string, config: any) {
        return {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            // remove this when not required at BFF  
            'nep-correlation-id': uuid.v4().toString(),
            'nep-organization': config.organization,
            'nep-enterprise-unit': config.enterpriseUnit,
            'authorization': `AccessToken ${token}`
        }
    }
    async searchItemDetails(barcode: string, token: string, startDate?: Date, endDate?: Date) {
        let config = getConfig();
        let searchUrl = `${config.baseUrl}${config.endpoints.itemDetails}?upc=${barcode}`
        if (startDate && endDate) {
            searchUrl += `&startDate=${moment(startDate).format('YYYY-MM-DD')}&endDate=${moment(endDate).format('YYYY-MM-DD')}`
        }
        console.log(searchUrl)
        let headers = this.setHeaders(token, config);
        try {   
            
            let response = await fetch(
                searchUrl,
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

    async priceSynchronization(itemCode: string, priceCode: string, token: string) {
        let config = getConfig();
        let priceUrl = `${config.baseUrl}${config.endpoints.itemPricesImmediateRelease}`
        let headers = await this.setHeaders(token, config)
        let body = {"itemPriceCollection": [
            {
                "itemCode": itemCode,
                "enterpriseUnitId": config.enterpriseUnit,
                "priceCode" : priceCode        
            }
        ]}
        try {   
            
            let response = await fetch(
                priceUrl,
                {
                    method: 'POST',
                    headers, 
                    body: JSON.stringify(body) 
                }
            )
            
            if (!response.ok) {
                return { data: undefined, error: true}
            }
            return { data: undefined, error: false }
        } catch (err) {
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }
    }

    async priceVerification(token:string, barcode:string, isCurrentPrice?: boolean) {
        let config = getConfig();
        let priceUrl = `${config.baseUrl}${config.endpoints.itemDetails}?upc=${barcode}`;
        priceUrl = isCurrentPrice ? priceUrl + `&isCurrentPrice=${isCurrentPrice}` : priceUrl;
        let headers = await this.setHeaders(token, config);
        try {   
            
            let response = await fetch(
                priceUrl,
                {
                    method: 'GET',
                    headers, 
                }
            )
           
            let jsonResponses = await response.json()
            let statusCode = jsonResponses['requestStatus'];
            
            
            if (statusCode['statusCode'] == 200){
                return { data: jsonResponses, error: false }             
            }

            if (!response.ok) {
                return { data: undefined, error: true}
            }
        } catch (err) {
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }
    }

    async getItemAttributes(token: string, barcode: string) {
        let config = getConfig();
        let url = `${config.baseUrl}${config.endpoints.itemAttributes}?upc=${barcode}`
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
            console.log("Response item attributes: ", jsonResponse);
            return { data: jsonResponse, error: false }
        } catch (err) {
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }
    }  
    
    async createNewItem(token: string, newItem: NewItem) {
        let config = getConfig();
        let url = `${config.baseUrl}${config.endpoints.item}`
        let headers = await this.setHeaders(token, config);
        console.log('Request to create new item: ', newItem);

        try {   
            
            let response = await fetch(
                url,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(newItem) 
                }
            )
            
            if (!response.ok) {
                console.log('Response after create new item: ERROR', response);
                return { data: undefined, error: true, code: response.status}
            }
            let jsonResponse = await response.json()
            console.log('Response after create new item: ', jsonResponse);
            return { data: jsonResponse, error: false }
        } catch (err) {  
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }
    } 

    async editItem( token: string, itemCode: string, item: ItemWithAtrributesToEdit) {
        let config = getConfig();
        let url = `${config.baseUrl}${config.endpoints.itemAttributes}/${itemCode}`
        let headers = this.setHeaders(token, config);
        try {   
            let response = await fetch(
                url,
                {
                    method: 'POST',
                    headers,
                    body: JSON.stringify(item) 
                }
            )
            if (!response.ok) {
                //console.log("Response post item attributes: ERROR ", response);
                return { data: undefined, error: true}
            }
            let jsonResponse = await response.json()
            console.log("Response post item attributes: ", jsonResponse);
            return { data: jsonResponse, error: false }
        } catch (err) {
            // handle service errors in a centralized way: TODO
            return { data: undefined, error: true}
        }        
    }

    async searchItemByBarcode(token: string, barcode: string[]) {
        let config = getConfig();
        const barcodeParams = barcode.join(',');
        const searchUrl = `${config.baseUrl}${config.endpoints.itemSearch}?packageIdentifier=${barcodeParams}`;
    
        console.log(searchUrl);
        let headers = this.setHeaders(token, config);
        try {
          let response = await fetch(searchUrl, {
            method: 'GET',
            headers,
          });
          if (!response.ok) {
            return { data: undefined, error: true };
          }
          let jsonResponse = await response.json();
          return { data: jsonResponse, error: false };
        } catch (err) {
          // handle service errors in a centralized way: TODO
          return { data: undefined, error: true };
        }
      }
    
      async searchItemByItemCode(token: string, itemCode: string[]) {
        let config = getConfig();
        const itemCodeParams = itemCode.join(',');
        const searchUrl = `${config.baseUrl}${config.endpoints.itemSearch}?itemCode=${itemCodeParams}`;
    
        console.log(searchUrl);
        let headers = this.setHeaders(token, config);
        try {
          let response = await fetch(searchUrl, {
            method: 'GET',
            headers,
          });
          if (!response.ok) {
            return { data: undefined, error: true };
          }
          let jsonResponse = await response.json();
          return { data: jsonResponse, error: false };
        } catch (err) {
          // handle service errors in a centralized way: TODO
          return { data: undefined, error: true };
        }
      }

}

export default new ItemService();