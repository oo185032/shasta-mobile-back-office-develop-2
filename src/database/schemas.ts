import { BSON } from "realm";

export type ItemMap = {
    [itemCode: string]: number;
}

export type DocumentMetadata = {
    _id?: BSON.ObjectId;
    _partitionKey?: string;
    approved?: boolean;
    createdDateTime?: number;
    createdUserId?: string;
    description?: string;
    documentId?: string;
    enterpriseUnit?: string;
    name?: string;
    organization?: string;
    rejectReason?: string;
    rejected?: boolean;
    type?: string;
    updatedDateTime?: number;
};

export const DocumentMetadataSchema = {
    name: 'documentMetadata',
    properties: {
        _id: 'objectId?',
        _partitionKey: 'string?',
        approved: 'bool?',
        createdDateTime: 'int?',
        createdUserId: 'string?',
        description: 'string?',
        documentId: 'string?',
        enterpriseUnit: 'string?',
        name: 'string?',
        organization: 'string?',
        rejectReason: 'string?',
        rejected: 'bool?',
        type: 'string?',
        updatedDateTime: 'int?',
    },
    primaryKey: '_id',
};

export type Item = {
    description?: string;
    packageIdentifiers?: PackageIdentifier[]
}

export type PackageIdentifier = {
    type?: string;
    value?: string;
}

export type UserDocument = {
    _id?: BSON.ObjectId;
    _partitionKey?: string;
    completed?: boolean;
    documentId?: string;
    enterpriseUnit?: string;
    inventoryCounts?: any;
    organization?: string;
    user?: string;
};

export type InventoryCountMap = {
    [itemCode: string]: number;
}

export const UserDocumentSchema = {
    name: 'userDocument',
    properties: {
        _id: 'objectId?',
        _partitionKey: 'string?',
        completed: 'bool?',
        documentId: 'string?',
        enterpriseUnit: 'string?',
        inventoryCounts: '{}',
        organization: 'string?',
        user: 'string?',
    },
    primaryKey: '_id',
};

export type DocumentSummary = {
    _id?: BSON.ObjectId;
    _partitionKey?: string;
    approved?: boolean;
    createdDateTime?: number;
    description?: string;
    documentId?: string;
    enterpriseUnit?: string;
    inventoryCounts?: InventoryCountMap;
    name?: string;
    organization?: string;
    rejected?: boolean;
    status?: string;
    type?: string;
    updatedDateTime?: number;
    users?: string[];
}

export type ItemCacheDocument = {
    _id?: BSON.ObjectId;
    _partitionKey?: string;
    organization?: string;
    enterpriseUnit?: string;
    itemCode?: string;
    packageIdentifiers?: PackageIdentifier[];
    longDescription?: LongDescription;
    shortDescription?: ShortDescription;
    merchandiseCategory?: MerchandiseCategory;
    dynamicAttributes?: DynamicAttributes[];
}

export type LongDescription = {
    values: Description[];
}

export type Description = {
    locale: string;
    value: string;
}

export type ShortDescription = {
    values: Description[];
}

export type MerchandiseCategory = {
    nodeId: string;
}

export type DynamicAttributes = {
    type: string;
    attribute: Attribute[];
}

export type Attribute = {
    key: string;
    value: string;
}

export const ItemCacheSchema = {
    name: 'itemCache',
    properties: {
      _id: 'objectId?',
      _partitionKey: 'string?',
      dynamicAttributes: 'itemCache_dynamicAttributes[]',
      enterpriseUnit: 'string?',
      itemCode: 'string?',
      longDescription: 'itemCache_longDescription',
      merchandiseCategory: 'itemCache_merchandiseCategory',
      organization: 'string?',
      packageIdentifiers: 'itemCache_packageIdentifiers[]',
      shortDescription: 'itemCache_shortDescription',
    },
    primaryKey: '_id',
};

export const ItemCacheDynamicAttributesSchema = {
    name: 'itemCache_dynamicAttributes',
    embedded: true,
    properties: {
      attributes: 'itemCache_dynamicAttributes_attributes[]',
      type: 'string?',
    },
};

export const ItemCacheDynamicAttributesAttributesSchema = {
    name: 'itemCache_dynamicAttributes_attributes',
    embedded: true,
    properties: {
      key: 'string?',
      value: 'string?',
    },
};

export const LongDescObject = {
    name: 'itemCache_longDescription_values',
    embedded: true,
    properties: {
        locale: 'string?',
        value: 'string?'
    }
}

export const ItemCacheLongDescriptionSchema = {
    name: 'itemCache_longDescription',
    embedded: true,
    properties: {
      values: {type: "list", objectType: "itemCache_longDescription_values"},
    },
};


export const ItemCacheMerchandiseCategorySchema = {
    name: 'itemCache_merchandiseCategory',
    embedded: true,
    properties: {
      nodeId: 'string?',
    },
};

export const ItemCachePackageIdentifiersSchema = {
    name: 'itemCache_packageIdentifiers',
    embedded: true,
    properties: {
      type: 'string?',
      value: 'string?',
    },
};

export const ShortDescObject = {
    name: 'itemCache_shortDescription_values',
    embedded: true,
    properties: {
        locale: 'string?',
        value: 'string?'
    }
}
  
export const ItemCacheShortDescriptionSchema = {
    name: 'itemCache_shortDescription',
    embedded: true,
    properties: {
        values: {type: "list", objectType: "itemCache_shortDescription_values"},
      },
};
