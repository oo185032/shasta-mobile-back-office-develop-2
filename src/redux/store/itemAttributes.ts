export interface ItemWithAttributes {
    itemUPC: string,
    itemSKU?: string,
    itemCode: string,
    departmentId: string,
    departmentName: string,
    itemPrices: PriceDetail[],
    itemDetails: { description: ItemDescription},
    itemAttributes: ItemAttributes
}

export interface PriceDetail {
    price: number,
    startDate: string,
    endDate: string,
    priceType: string,
    priceCode: string,
    batchId: string,
    batchName: string,
    quantity: string,
    status: string,
    currency: string,
}

export interface DescriptionDetail {
    locale: string,
    value: string
}

export interface ItemDescription {
    longDescription: DescriptionDetail,
    shortDescription: DescriptionDetail
}

export interface ItemAttributes{
    status?: string,
    pack?: number,
    size?: string,
    wic?: boolean,
    visualVerify?: boolean,
    randomWeight?: boolean,
    taxability?: string,
    timeRestriction?: string,
    ageRestriction?: string,
    foodStampEligible?: boolean    
}

export const PriceStatus = {
    Inactive: 'INACTIVE',
    Active: 'ACTIVE',
    Discontinued: 'DISCONTINUED',
    Seasonal: 'SEASONAL',
    ToDiscontinue: 'TO_DISCONTINUE',
    Unauthorized: 'UNAUTHORIZED'
} as const

type PriceStatus = typeof PriceStatus[keyof typeof PriceStatus]

export const BatchStatus = {
    CurrentAndFuture: 'CURRENT_AND_FUTURE',
    OnHold: 'ON_HOLD',
    TimedRelease: 'TIMED_RELEASE',
    ImmediateRelease: 'IMMEDIATE_RELEASE'
} as const

type BatchStatus = typeof BatchStatus[keyof typeof BatchStatus]

export interface NewItem {
    copiedFromItemCode: string,
    upc: string,
    sku?: string,
    longDescription: string,
    shortDescription: string
    nodeId: string,
    departmentId: string,
    departmentName?: string, 
    itemAttributes: ItemAttributes,
    itemPrice: NewItemPrice,
}

export interface NewItemPrice {
    price: number,
    priceMultiplet?: number,
    quantity: number,
    currency: string,
    effectiveDate: string,
    endDate: string,
}

export interface ItemWithAtrributesToEdit {
    item: ItemIdentifiersForAttributes,
    itemAttributes: ItemAttributes
}

export interface ItemIdentifiersForAttributes {
    upc: string,
    departmentId: string
}

