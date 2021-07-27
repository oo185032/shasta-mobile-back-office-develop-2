export interface ItemPrice {
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  priceType: string;
  priceCode: string;
  batchId: string;
  batchName: string;
  status: string;
  quantity: string;
  override: boolean;
}

export interface LongDescription {
  locale: string;
  value: string;
  values: Value[];
}

export interface Value {
  locale: string;
  value: string;
}

export interface ShortDescription {
  locale: string;
  value: string;
  values: Value[];
}

export interface AuditTrail {
  lastUpdated: string;
  lastUpdatedByUser: string;
}

export interface PackageIdentifier {
  type: string;
  value: string;
}

export interface MerchandiseCategory {
  nodeId: string;
}

export interface DynamicAttribute {
  type: string;
  attributes: Attribute;
}

export interface Attribute {
  key: string;
  value?: string;
  localizedValue?: LocalizedValue;
}

export interface LocalizedValue {
  values?: Value[];
}
