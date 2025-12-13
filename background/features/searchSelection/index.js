/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../../lib/featureclient.js" */

import { injectedFunc } from "./injected.js";

const COMMAND_NAME = "search-selection-on-google";
const MESSAGE_NAME = "search-selection-on-google";

/** @param {FeatureClient} client */
export function registerSearchSelection(client) {
  // NOTE - Same command name needs to be mentioned in extension's manifest.json
  client.registerCommand(COMMAND_NAME, handleSearchSelectionCommand);

  client.registerMessage(MESSAGE_NAME, handleSearchSelectionMessage);
}

/** @type {CommandHandlerCb} */
async function handleSearchSelectionCommand(client, tab) {
  // basically calling the function like
  // injectedFunc(MESSAGE_NAME)
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: false },
    func: injectedFunc,
    args: [MESSAGE_NAME],
  });
}

/** @type {MessageHandlerCb} */
async function handleSearchSelectionMessage(
  client,
  message,
  sender,
  sendResponse
) {
  await chrome.search.query({ text: message.query, disposition: "NEW_TAB" });

  // NOTE - Alternate approch that doesn't use the default search engine

  // const tabRef = await chrome.tabs.create({
  //   url: `https://www.google.com/search?q=${message.query}`,
  //   active: true,
  // });
  // console.log("tab created:", tabRef);
}
