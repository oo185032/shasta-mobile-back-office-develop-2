import { BSON } from 'realm';
import getConfig from '../config';
import { app, cacheRealm, openRealm, userRealm } from '../database/realm';
import {
  UserDocument,
  UserDocumentSchema,
  DocumentSummary,
  ItemCacheDocument,
  ItemCacheSchema,
} from '../database/schemas';
import { store } from '../redux/store';
import ItemService from '../services/itemService';

const config = getConfig();

// createUserDocument creates a userDocument in mongo realm with the given document Id
export function createUserDocument(docId: string) {
  userRealm?.write(() => {
    userRealm?.create<UserDocument>(UserDocumentSchema.name, {
      _id: new BSON.ObjectId(),
      _partitionKey: `${app.currentUser?.customData.organization}_${app.currentUser?.customData.username}`,
      completed: false,
      documentId: docId,
      enterpriseUnit: config.enterpriseUnit,
      organization: app.currentUser?.customData.organization,
      user: app.currentUser?.customData.username,
    });
  });
}

// readUserDocuments user can fetch his own userDocument
export async function readUserDocuments() {
  try {
    await openRealm();
    const docs = userRealm?.objects<UserDocument>(UserDocumentSchema.name).filtered('completed == false');
    docs?.forEach((doc) => {
      console.log(doc.inventoryCounts);
    });
    return docs;
  } catch (error) {
    console.error('Error retrieving user documents:', error.message);
  }
}

// deleteUserDocuments delete all userDocuments
export async function deleteUserDocuments() {
  try {
    await openRealm();
    userRealm?.write(() => {
      userRealm?.delete(userRealm.objects(UserDocumentSchema.name));
    });
  } catch (error) {
    console.error('Error retrieving user documents:', error.message);
  }
}

// mapUserDocuments maps the realm sync userDocument to the expected data type
export function mapUserDocuments(value: UserDocument) {
  return {
    documentId: value.documentId,
    completed: value.completed,
    inventoryCounts: value.inventoryCounts,
    user: value.user,
  };
}

// mapDocumentSummary maps the realm sync documentSummary to the expected data type
export function mapDocumentSummary(value: DocumentSummary) {
  return {
    name: value.name,
    description: value.description,
    type: value.type,
    approved: value.approved,
    rejected: value.rejected,
    documentId: value.documentId,
    createdDate: value.createdDateTime,
    updatedDate: value.updatedDateTime,
    inventoryCounts: value.inventoryCounts,
    users: value.users,
    status: value.status,
  };
}

// write a document to itemCache
export async function writeItemCache(itemCacheDocument: ItemCacheDocument) {
  try {
    cacheRealm?.write(() => {
      cacheRealm?.create<ItemCacheDocument>(ItemCacheSchema.name, itemCacheDocument);
    });
  } catch (error) {
    console.error('Error write to itemCache: ', error.message);
    throw error;
  }
}

// map the itemSearch response to itemCacheDocument
export function buildItemCacheDocument(itemSearchResponse: any): ItemCacheDocument[] {
  const items: ItemCacheDocument[] = itemSearchResponse.searchResult.map((item: any) => {
    return {
      _id: new BSON.ObjectId(),
      _partitionKey: `${app.currentUser?.customData.cache_partition}`,
      organization: `${app.currentUser?.customData.organization}`,
      enterpriseUnit: config.enterpriseUnit,
      itemCode: item.itemCode,
      packageIdentifiers: item.packageIdentifiers,
      longDescription: item.longDescription,
      shortDescription: item.shortDescription,
      merchandiseCategory: item.merchandiseCategory,
      dynamicAttributes: item.dynamicAttributes,
    };
  });
  return items;
}

// Map ItemCacheDocument to data needed by frontend. Short description will always be the first value in the array now.
export function mapItemCache(itemCache: ItemCacheDocument, count?: number) {
  let shortDes;
  if (itemCache.shortDescription?.values && itemCache.shortDescription.values.length > 0) {
    shortDes = itemCache.shortDescription.values[0].value;
  }
  return {
    itemCode: itemCache.itemCode,
    shortDescription: shortDes,
    count: count,
  };
}

// readItemCacheByItemCode reads from itemCache with the given itemCode
// If cache misses, it will call into mobile /item/search endpoint, and populate the itemCache
// If Item does not exist in catalog, the response will be undefined
export async function readItemCacheByItemCode(itemCode: string) {
  try {
    await openRealm();
    let itemCacheDocFiltered: any = {};
    const itemCacheDocs = cacheRealm?.objects<ItemCacheDocument>(ItemCacheSchema.name);
    itemCacheDocFiltered = itemCacheDocs?.filtered('itemCode == $0', itemCode)[0];
    if (!itemCacheDocFiltered) {
      const itemSearchResponse = ItemService.searchItemByItemCode(store.getState().user.userData.token, [itemCode]);
      if ((await itemSearchResponse).error) {
        return itemCacheDocFiltered;
      } else {
        const itemCacheDocuments: ItemCacheDocument[] = buildItemCacheDocument((await itemSearchResponse).data);
        itemCacheDocuments.forEach((doc) => {
          writeItemCache(doc);
        });
        if (itemCacheDocuments.length > 0) return itemCacheDocuments[0];
      }
    }
    return itemCacheDocFiltered;
  } catch (error) {
    console.error('Error read from itemCache: ', error.message);
    throw error;
  }
}

// readItemCacheByPackageIdentifier reads from itemCache with the given packageIdentifier
// If cache misses, it will call into mobile /item/search endpoint, and populate the itemCache
// If Item does not exist in catalog, the response will be undefined
export async function readItemCacheByPackageIdentifier(packageIdentifier: string) {
  try {
    await openRealm();
    let itemCacheDocFiltered: any = {};
    const itemCacheDocs = cacheRealm?.objects<ItemCacheDocument>(ItemCacheSchema.name);
    itemCacheDocFiltered = itemCacheDocs?.filtered('$0 in packageIdentifiers.value', packageIdentifier)[0];
    if (!itemCacheDocFiltered) {
      const itemSearchResponse = ItemService.searchItemByBarcode(store.getState().user.userData.token, [
        packageIdentifier,
      ]);
      if ((await itemSearchResponse).error) {
        return itemCacheDocFiltered;
      } else {
        const itemCacheDocuments: ItemCacheDocument[] = buildItemCacheDocument((await itemSearchResponse).data);
        itemCacheDocuments.forEach((doc) => {
          writeItemCache(doc);
        });
        if (itemCacheDocuments.length > 0) return itemCacheDocuments[0];
      }
    }
    return itemCacheDocFiltered;
  } catch (error) {
    console.error('Error read from itemCache: ', error.message);
    throw error;
  }
}
