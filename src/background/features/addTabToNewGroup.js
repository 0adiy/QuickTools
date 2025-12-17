/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../lib/featureclient.js" */

const COMMAND_NAME = "add-tab-to-new-group";

/** @param {FeatureClient} client */
export function registerAddToNewGroup(client) {
  // NOTE - Same command name needs to be mentioned in extension's manifest.json
  client.registerCommand(COMMAND_NAME, handleCommand);
}

/** @type {CommandHandlerCb} */
async function handleCommand(client, tab) {
  // Validations
  // tab.groupId is -1 when it's ungrouped, so return early if in any group
  if (tab.groupId != -1) return;

  chrome.tabs.group({ tabIds: [tab.id] });
}
