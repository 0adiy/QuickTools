/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../lib/featureclient.js" */

const COMMAND_NAME = "search-selection-on-google";
const MESSAGE_NAME = "search-selection-on-google";

/** @param {FeatureClient} client */
export function registerSearchSelection(client) {
  // NOTE - Same command name needs to be mentioned in extension's manifest.json
  client.registerCommand(COMMAND_NAME, handleOpenSelectionOnGoogle);

  client.registerMessage(MESSAGE_NAME, handleOpenSelectionOnGoogleMessage);
}

/** @type {CommandHandlerCb} */
async function handleOpenSelectionOnGoogle(client, tab) {
  // NOTE - The func in executeScript() is executed in context of target tab
  // hence it can't use chrome apis other than the runtime.sendMessage

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: async () => {
      const query = document.getSelection().toString();

      // sending `query` to correct `type` so it's caught by our own defined handler below
      chrome.runtime.sendMessage({ query, type: MESSAGE_NAME });
    },
  });
}

/** @type {MessageHandlerCb} */
async function handleOpenSelectionOnGoogleMessage(
  client,
  message,
  sender,
  sendResponse
) {
  const tabRef = await chrome.tabs.create({
    url: `https://www.google.com/search?q=${message.query}`,
    active: true,
  });
  // console.log("tab created:", tabRef);
}
