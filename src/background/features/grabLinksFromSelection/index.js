/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../../lib/featureclient.js" */

const COMMAND_NAME = "grab-links-from-selection";

const MESSAGE_ACTIVATE_SELECTION_POPUP = "activate-selection-mode-POPUP"; // req from popup
const MESSAGE_GRABBED_LINKS = "grab-links-from-selection-CONTENT"; // comes from content script to bg
const MESSAGE_ACTIVATE_SELECTION_CONTENT = "activate-selection-mode-BACKGROUND"; // goes from bg to content script

// TODO - auto-gen it's path with only the last file path name being correct, maybe using vite?
const CONTENT_SCRIPT_PATH =
  "src/background/features/grabLinksFromSelection/injectedContentScript.js";

/** @param {FeatureClient} client */
export function registerGrabLinksFromSelection(client) {
  client.registerCommand(COMMAND_NAME, handleCommand);
  client.registerMessage(MESSAGE_GRABBED_LINKS, handleContentScriptMessage);
  client.registerMessage(MESSAGE_ACTIVATE_SELECTION_POPUP, handlePopupMessage);
}

/** @type {MessageHandlerCb} */
async function handlePopupMessage(client, message, sender, sendResponse) {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  const tabId = tabs[0].id;

  await injectAndActivate(tabId);
}

/** @type {CommandHandlerCb} */
async function handleCommand(client, tab) {
  await injectAndActivate(tab.id);
}

/** @type {MessageHandlerCb} */
async function handleContentScriptMessage(
  client,
  message,
  sender,
  sendResponse
) {
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

async function injectAndActivate(tabId) {
  try {
    // 1. Try sending a message FIRST.
    // If the content script is already injected and listening, this works.
    const response = await chrome.tabs.sendMessage(tabId, {
      type: MESSAGE_ACTIVATE_SELECTION_CONTENT,
    });
    console.log("Script already present, sent message successfully:", response);
  } catch (error) {
    // 2. If sendMessage fails, it usually means the script isn't loaded in the page yet.

    // Inject the content script dynamically using the Scripting API
    try {
      await chrome.scripting.executeScript({
        target: { tabId },
        files: [CONTENT_SCRIPT_PATH],
      });

      // After successful injection, now send the message to activate the mode
      const response = await chrome.tabs.sendMessage(tabId, {
        type: MESSAGE_ACTIVATE_SELECTION_CONTENT,
      });
      console.log("sent message successfully:", response);
    } catch (injectionError) {
      console.error("Failed to inject script or send message:", injectionError);
    }
  }
}
