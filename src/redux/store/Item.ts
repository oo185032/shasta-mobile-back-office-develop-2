import {
  DynamicAttribute,
  LongDescription,
  MerchandiseCategory,
  PackageIdentifier,
  ShortDescription,
  AuditTrail,
} from './commonModels';

export interface PriceDetail {
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

export interface DescriptionDetail {
  locale: string;
  value: string;
}

export interface ItemDescription {
  longDescription: DescriptionDetail;
  shortDescription: DescriptionDetail;
}

export interface Location {
  aisle?: string;
  shelf?: string;
  locationType?: string;
  position?: string;
  longitude?: number;
  latitude?: number;
}

export interface ItemId {
  itemCode: string;
  itemUPC: string;
  status: string;
  departmentId: string;
  departmentName: string;
  itemsPrices: PriceDetail[];
  itemDetails: { description: ItemDescription };
  locations: Location[];
  additionalDetails: AdditonalDetails;
}

export interface AdditonalDetails {
  //Not available in Figma yet
}

export interface Item {
  version: number;
  imageUrls: string[];
  packageIdentifiers?: PackageIdentifier[];
  longDescription?: LongDescription;
  shortDescription?: ShortDescription;
  merchandiseCategory: MerchandiseCategory;
  alternateCategories?: string[];
  status: string;
  departmentId: string;
  nonMerchandise?: boolean;
  referenceId?: string;
  externalIdentifiers?: string[];
  dynamicAttributes?: DynamicAttribute[];
  itemId: ItemId;
  auditTrail?: AuditTrail;
}
