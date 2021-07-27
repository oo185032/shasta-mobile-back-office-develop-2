import Realm from 'realm';
import {
  UserDocumentSchema,
  DocumentMetadataSchema,
  ItemCacheSchema,
  LongDescObject,
  ShortDescObject,
  ItemCacheShortDescriptionSchema,
  ItemCacheDynamicAttributesAttributesSchema,
  ItemCachePackageIdentifiersSchema,
  ItemCacheDynamicAttributesSchema,
  ItemCacheLongDescriptionSchema,
  ItemCacheMerchandiseCategorySchema,
} from './schemas';
import { store } from '../redux/store';
import getConfig from '../config';

const config = getConfig();
// TODO: Need to see how to set appId per environment. Currently we just have one appId
const appId = 'inv-mobile-sync-ppqki';

let app: Realm.App;
let metadataRealm: Realm | undefined;
let userRealm: Realm | undefined;
let cacheRealm: Realm | undefined;

// This function is expected to be called upon user login.
// Because we don't support offline login right now, we will open the synced version of remote realm.
// Once user is logged in, he will be able access the realm without network connection.
// TODO: front end developers need to call this function upon user login.
export async function openRealm() {
  app = Realm.App.getApp(appId);
  try {
    if (app.currentUser) {
      // A user had already logged in - open the Realm synchronously
      //TODO: Uncomment metadataRealm line once we got a fix.
      // metadataRealm = new Realm(getMetadataConfig(app.currentUser));
      userRealm = new Realm(getUserDocConfig(app.currentUser));
      cacheRealm = new Realm(getCacheConfig(app.currentUser));
    } else {
      // We don't have a user - login a user and open the realm async
      const user = await logInCustomFunction(store.getState().user.userData.token);
      // metadataRealm = await Realm.open(getMetadataConfig(user));
      userRealm = await Realm.open(getUserDocConfig(user));
      cacheRealm = await Realm.open(getCacheConfig(user));
    }
  } catch (error) {
    // TODO: handle realm errors in a centralized way:
    throw new Error(error);
  }
}

// getMetadataConfig - partitioned on user's org
function getMetadataConfig(user: any) {
  return {
    schema: [DocumentMetadataSchema],
    sync: {
      user,
      partitionValue: user.customData.organization,
      error: (_session: any, error: any) => {
        errorSync(metadataRealm, error);
      },
    },
  };
}

// getCacheConfig - partitioned on user's cache partition
function getCacheConfig(user: any) {
  return {
    schema: [
      ItemCacheSchema,
      ItemCacheDynamicAttributesSchema,
      ItemCacheDynamicAttributesAttributesSchema,
      ItemCacheLongDescriptionSchema,
      ItemCacheMerchandiseCategorySchema,
      ItemCachePackageIdentifiersSchema,
      ItemCacheShortDescriptionSchema,
      LongDescObject,
      ShortDescObject,
    ],
    sync: {
      user,
      partitionValue: user.customData.cache_partition,
      error: (_session: any, error: any) => {
        errorSync(cacheRealm, error);
      },
    },
  };
}

// getUserDocConfig - partitioned on user' username
function getUserDocConfig(user: any) {
  return {
    schema: [UserDocumentSchema],
    sync: {
      user,
      partitionValue: user.customData.partition, // <username>
      error: (_session: any, error: any) => {
        errorSync(userRealm, error);
      },
    },
  };
}

// login the current user into mongo realm using user's login token.
// app.login calls into MongoDB cloud function.
// after login, app.currentUser is set to the logged in user
async function logInCustomFunction(payload: string) {
  let user: Realm.User;
  try {
    const credentials = Realm.Credentials.function({ token: payload });
    user = await app.logIn(credentials);
    if (!user.customData) {
      await user.refreshCustomData();
    }
    return user;
  } catch (error) {
    // TODO: handleS realm errors in a centralized way:
    throw new Error(error);
  }
}

// errorSync - callback function for handling error when opening realm sync
function errorSync(realm: any, error: any) {
  if (realm) {
    if (error.name === 'ClientReset') {
      const realmPath = realm.path;
      realm.close();
      Realm.App.Sync.initiateClientReset(app, realmPath);
      realm = undefined;
    } else {
      console.error(`Received error ${error.message}`);
    }
  }
  // TODO: handle realm errors in a centralized way:
  throw error;
}

async function logOutUser() {
  if (app.currentUser) {
    app.currentUser.logOut();
  }
}

// This function is expected to be called on user logout.
// It will logout the current user from realm sync, and close all opened realms.
export async function closeRealms() {
  logOutUser();
  if (userRealm) {
    await userRealm.syncSession?.uploadAllLocalChanges();
    userRealm.close();
    userRealm = undefined;
  }
  if (metadataRealm) {
    await metadataRealm.syncSession?.uploadAllLocalChanges();
    metadataRealm.close();
    metadataRealm = undefined;
  }
  if (cacheRealm) {
    await cacheRealm.syncSession?.uploadAllLocalChanges();
    cacheRealm.close();
    cacheRealm = undefined;
  }
}

export { app, userRealm, metadataRealm, cacheRealm };
