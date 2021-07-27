import uuid from 'react-native-uuid';
import getConfig from '../config';
import { OverridePrice } from '../redux/store/itemPrices';

class ItemPricesService {
  setHeaders(token: string, config: any) {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // remove this when not required at BFF
      'nep-correlation-id': uuid.v4().toString(),
      'nep-organization': config.organization,
      'nep-enterprise-unit': config.enterpriseUnit,
      authorization: `AccessToken ${token}`,
    };
  }

  async getItemPrices(token: string, barcode: string, isCurrentPrice?: boolean) {
    let config = getConfig();
    let url = `${config.baseUrl}${config.endpoints.itemPrices}?upc=${barcode}`;
    url = isCurrentPrice ? url + `&isCurrentPrice=${isCurrentPrice}` : url;
    let headers = this.setHeaders(token, config);
    try {
      let response = await fetch(url, {
        method: 'GET',
        headers,
      });
      if (!response.ok) {
        //console.log("Response NOT OK item prices: ", response);
        return { data: undefined, error: true };
      }
      let jsonResponse = await response.json();
      //console.log("Response item prices: ", jsonResponse);
      return { data: jsonResponse, error: false };
    } catch (err) {
      // handle service errors in a centralized way: TODO
      return { data: undefined, error: true };
    }
  }

  async createOverrideItemPrices(token: string, itemCode: string, newPrice: OverridePrice) {
    let config = getConfig();
    let url = `${config.baseUrl}${config.endpoints.itemPricesOverride}/${itemCode}`;
    let headers = this.setHeaders(token, config);

    try {
      let response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(newPrice),
      });

      if (!response.ok) {
        //console.log('Response after create price override: ERROR', response);
        return { data: undefined, error: true, code: response.status };
      }
      let jsonResponse = await response.json();
      //console.log('Response after create new price override: ', jsonResponse);
      return { data: jsonResponse, error: false };
    } catch (err) {
      // handle service errors in a centralized way: TODO
      return { data: undefined, error: true };
    }
  }
}

export default new ItemPricesService();
