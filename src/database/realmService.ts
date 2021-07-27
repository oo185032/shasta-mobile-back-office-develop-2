import pipeline from './document-summary-pipeline';
import { app, openRealm, userRealm } from './realm';
import { ItemCacheDocument, UserDocument, UserDocumentSchema } from './schemas';
import {
  createUserDocument,
  mapDocumentSummary,
  mapItemCache,
  readItemCacheByItemCode,
  readItemCacheByPackageIdentifier,
} from '../utils/RealmUtils';

// readDocumentSummary retriveves the all the documentSummaries that are still open by leveraging the aggregation pipeline
export async function readDocumentSummary() {
  try {
    await openRealm();
    const docSummary = app.currentUser
      ?.mongoClient('shasta-dev')
      .db('inventory')
      .collection('documentMetadata')
      .aggregate(pipeline);
    const docs = (await docSummary).map(mapDocumentSummary);
    return docs;
  } catch (error) {
    console.error('cannot retrieve the document summary: ', error.message);
  }
}

// updatetItemList adds the scanned item and count to the userDocument inventoryCounts field.
// If userDocument does not exist, a new userDocument will be created with given documentId
export async function updateItemList(documentId: string, itemCode: string, count: number) {
  try {
    await openRealm();
    const userDocs = userRealm?.objects<UserDocument>(UserDocumentSchema.name);
    let userDoc = userDocs?.filtered('documentId == $0', documentId)[0];
    // Create userDocument if it does not exist in db
    if (!userDoc) {
      createUserDocument(documentId);
      userDoc = userDocs?.filtered('documentId == $0', documentId)[0];
    }
    userRealm?.write(() => {
      if (userDoc) {
        userDoc.inventoryCounts[itemCode] = count;
      }
    });
  } catch (error) {
    // TODO: handle realm errors in a centralized way. Right now error will be logged at this level and won't be thrown again.
    console.error('cannot update itemList for item: ', itemCode, error.message);
  }
}

// TODO: test this function once realm sync is fixed.
// TODO: Add callback that listen to item list change.
// readItemList will accept current documentId
// and extract all the itemCode inside the inventoryCounts and use it to query all the documents inside the itemCache
// Item that is not found in catalog will be omitted in the response list.
export async function readItemList(documentId: string) {
  try {
    await openRealm();
    const documentSummaries = await readDocumentSummary();
    const filteredSummary = documentSummaries?.filter((doc: any) => doc.documentId === documentId)[0];
    console.log(filteredSummary);
    const inventoryCounts = filteredSummary?.inventoryCounts;
    const itemList = [];
    console.log(inventoryCounts);
    if (inventoryCounts) {
      const itemCodes: string[] = Object.keys(inventoryCounts);
      for (const itemCode of itemCodes) {
        const itemCache: ItemCacheDocument = await readItemCacheByItemCode(itemCode);
        if (itemCache) {
          itemList.push(mapItemCache(itemCache, inventoryCounts[itemCode]));
        }
      }
      return itemList;
    }
  } catch (error) {
    // TODO: handle realm errors in a centralized way. Right now error will be logged at this level and won't be thrown again.
    console.error('cannot read itemList with DocumentID: ', documentId, error.message);
    return undefined;
  }
}

// UpdateUserDocStatus updates the "completed status" in userDocument to be true
export async function updateUserDocStatus(documentId: string) {
  try {
    await openRealm();
    const docs = userRealm?.objects<UserDocument>(UserDocumentSchema.name);
    const userDoc = docs?.filtered('documentId == $0', documentId)[0];
    if (userDoc) {
      userRealm?.write(() => {
        userDoc.completed = true;
      });
    }
    // TODO:handle error can be refactored to be more idiomatic way across the realm sync service
  } catch (error) {
    console.error(
      'cannot update the "completed status" in userDocument to be true with documentId: ',
      documentId,
      error.message,
    );
  }
}

// readItemDetails will call readItemCacheByPackageIdentifier to read from itemCache with the given packageIdentifier
// If cache misses, it will call into mobile /item/search endpoint, and populate the itemCache
// The response will be mapped to fields needed. If data is not found or error, it will return undefined.
export async function readItemDetails(packageIdentifier: string) {
  try {
    const itemCache = await readItemCacheByPackageIdentifier(packageIdentifier);
    if (itemCache) {
      return mapItemCache(itemCache);
    }
    return itemCache;
  } catch (err) {
    // TODO:handle error can be refactored to be more idiomatic way across the realm sync service
    console.error('cannot read itemDetails with packageIdentifier: ', packageIdentifier, err.message);
    return undefined;
  }
}
