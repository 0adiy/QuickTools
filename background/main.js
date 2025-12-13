import { FeatureClient } from "./lib/featureclient.js";
import { StoreClient } from "./lib/storeclient.js";
import * as features from "./features/regFuncExports.js";

const storeClient = new StoreClient();
const client = new FeatureClient(storeClient);

// Call register func of each feature passing client in
const featureList = Object.values(features);
featureList.forEach(regFunc => regFunc(client));

client.startListening();
