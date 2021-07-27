export interface ValidationItem {
  allowEmpty: boolean,
  pattern?: string,
  errorLabel?: string,
  yPosition?: number
}

export const validationMap: { [key: string]: ValidationItem } = {  
    upc: {
        allowEmpty: false,
        pattern: '^[0-9]{1,60}$'
    },
    sku: {
        allowEmpty: true,
        pattern: 'd+'
    },
    posDescription: {
        allowEmpty: false,
        pattern: '^.{1,150}$'
    },
    itemDescription: {
        allowEmpty: false,
    },
    department: {
        allowEmpty: false,
    },
    category: {
        allowEmpty: false,
    },
    subCategory: {
        allowEmpty: false,
    },
    pack: {
        allowEmpty: false,
        pattern: 'd+'
    },
    price: {
        allowEmpty: false,
        pattern: '^\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?$'
    }
}