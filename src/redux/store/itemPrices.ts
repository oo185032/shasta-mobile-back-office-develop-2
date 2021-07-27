import { ItemPrice } from './commonModels';

export interface PricesResponse {
  item: ItemWithPrices;
}

export interface ItemWithPrices {
  itemCode: string;
  itemUpc: string;
  shortDescription: ShortDescription;
  itemPrices: [ItemPrice];
}

export interface ShortDescription {
  locale: string;
  value: string;
  values: [Value];
}

export interface ItemPriceExtended extends ItemPrice {
  //UI specific field
  isSelected: boolean;
}
export interface Value {
  locale: string;
  value: string;
}

/************************ Price Override Model ************************/
export interface OverridePrice {
  item: ItemOverrideRequest;
  itemPrice: ItemPriceOverrideRequest;
}

export interface ItemOverrideRequest {
  upc: string;
  shortDescription: string;
  departmentId: string;
}

export interface ItemPriceOverrideRequest {
  price: number;
  currency: string;
  effectiveDate: string;
  endDate?: string;
  status: string;
  linkGroupId?: LinkGroupId;
  tareWeightUom?: string;
  tareWeight?: number;
  precision?: number;
  includesContainer?: boolean;
  quantityPricedItem?: boolean;
  quantity?: number;
}

export interface LinkGroupId {
  linkGroupCode: string;
}
