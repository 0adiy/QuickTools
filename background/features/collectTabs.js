/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../lib/featureclient.js" */

/** @param {FeatureClient} client */
export function registerCollectTabs(client) {
  // NOTE - Same command name needs to be mentioned in extension's manifest.json
  client.registerCommand("collect-tabs", handleCollectTabs);
}

/** @type {CommandHandlerCb} */
async function handleCollectTabs(client, tab) {
  // Fetch settings
  let textboxValue = await client.storeClient.getTextBoxValue();
  const verbose = await client.storeClient.getVerboseValue();

  // Collect tabs of current window
  const tabs = await chrome.tabs.query({ currentWindow: true });

  let newText = "";
  if (verbose) {
    newText = tabs.map(tab => `#${tab.title}\n${tab.url}\n`).join("\n");
  } else {
    newText = tabs.map(tab => tab.url).join("\n");
  }

  await client.storeClient.appendTextBoxValue(newText);
}
