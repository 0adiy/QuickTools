import { FeatureClient } from "./lib/featureclient.js";
import { StoreClient } from "./lib/storeclient.js";
import * as features from "./features/regFuncExports.js";

const storeClient = new StoreClient();
const client = new FeatureClient(storeClient);

// Call register func of each feature passing client in
const featureList = Object.values(features);
featureList.forEach(regFunc => regFunc(client));

client.startListening();

// ---------------------
// ---------------------
// ---------------------

// TODO - Move this to features and register a message handler
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINKS_FROM_SELECTION") {
    const linkObjs = message.linkObjs;

    chrome.storage.local.get(["urlTextbox", "verbose"]).then(result => {
      let res = "";

      for (let ob of linkObjs) {
        if (result.verbose) {
          res += `# ${ob.title}\n${ob.url}\n\n`;
        } else {
          res += `${ob.url}\n`;
        }
      }

      // early return
      if (res.length === 0) return;

      res = result.urlTextbox + res;

      // console.log("result: ", result, " res: ", res);
      chrome.storage.local.set({ urlTextbox: res }, () => {
        // console.log("Links saved.");
      });
    });
  }
});
