import { FeatureClient } from "./lib/featureclient.js";
import { StoreClient } from "./lib/storeclient.js";

// Registeration Commands
import { registerScrapeLinks } from "./features/scrapeLinks.js";
import { registerCollectTabs } from "./features/collectTabs.js";
import { registerSearchSelection } from "./features/searchSelection.js";

const storeClient = new StoreClient();

const client = new FeatureClient(storeClient);

// NOTE - Features should have been dynamically auto imported from features folder but that is
// not possible since we are in a browser extension context where dynamic imports are not allowed

const features = [
  registerScrapeLinks,
  registerCollectTabs,
  registerSearchSelection,
];

// Call register func of each feature passing client in
features.forEach(regFunc => regFunc(client));

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
