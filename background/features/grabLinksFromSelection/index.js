/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../../lib/featureclient.js" */

const COMMAND_NAME = "grab-links-from-selection";

const MESSAGE_GRAB_LINKS = "grab-links-from-selection"; // comes from content script to bg
const MESSAGE_ACTIVATE_SELECTION = "activate-selection-mode"; // goes from bg to content script

// TODO - auto-gen it's path with only the last file path name being correct, maybe using vite?
const CONTENT_SCRIPT_PATH =
  "background/features/grabLinksFromSelection/injectedContentScript.js";

/** @param {FeatureClient} client */
export function registerGrabLinksFromSelection(client) {
  client.registerCommand(COMMAND_NAME, handleCommand);
  client.registerMessage(MESSAGE_GRAB_LINKS, handleMessageSuccess);
}

/** @type {CommandHandlerCb} */
async function handleCommand(client, tab) {
  try {
    // 1. Try sending a message FIRST.
    // If the content script is already injected and listening, this works.
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: MESSAGE_ACTIVATE_SELECTION,
    });
    // console.log("Script already present, sent message successfully:", response);
  } catch (error) {
    // 2. If sendMessage fails, it usually means the script isn't loaded in the page yet.

    // Inject the content script dynamically using the Scripting API
    try {
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: [CONTENT_SCRIPT_PATH],
      });

      // After successful injection, now send the message to activate the mode
      await chrome.tabs.sendMessage(tab.id, {
        type: MESSAGE_ACTIVATE_SELECTION,
      });
    } catch (injectionError) {
      console.error("Failed to inject script or send message:", injectionError);
    }
  }
}

/** @type {MessageHandlerCb} */
async function handleMessageSuccess(client, message, sender, sendResponse) {
  const { linkObjs } = message;

  const verbose = await client.storeClient.getVerboseValue();

  let res = "";
  for (let ob of linkObjs) {
    if (verbose) {
      res += `# ${ob.title}\n${ob.url}\n\n`;
    } else {
      res += `${ob.url}\n`;
    }
  }

  // early return
  if (res.length === 0) return;

  client.storeClient.appendTextBoxValue(res);
}
