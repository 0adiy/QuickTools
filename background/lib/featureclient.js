/** @import { StoreClient } from "./storeclient"; */

/** A callback for message handlers.
 * @callback MessageHandlerCb
 * @param {FeatureClient} client
 * @param {any} message
 * @param {chrome.runtime.MessageSender} sender
 * @param {(response?: any) => void} sendResponse
 */

/** Type of handler func for a registered command.
 * @callback CommandHandlerCb
 * @param {FeatureClient} client
 * @param {chrome.tabs.Tab} [tab] The active tab (optional).
 */

// FeatureClient.js
class FeatureClient {
  /** @param {StoreClient} storeClient */
  constructor(storeClient) {
    this.featureHandlers = {
      messages: {},
      commands: {},
    };

    this.storeClient = storeClient;
  }

  /** Register a command handler
   * @param {String} messageType
   * @param {MessageHandlerCb} messageHandler
   */
  registerMessage(messageType, messageHandler) {
    // if the messageName doesn't have listners, set to empty array
    if (!this.featureHandlers.messages[messageType]) {
      this.featureHandlers.messages[messageType] = [];
    }

    // finally push to it's handlers
    this.featureHandlers.messages[messageType].push(messageHandler);
  }

  /** Register a command handler
   * @param {String} commandName
   * @param {CommandHandlerCb} commandHandler should be of signature (string, chrome.Tab)
   */
  registerCommand(commandName, commandHandler) {
    // if the commandName doesn't have listners, set to empty array
    if (!this.featureHandlers.commands[commandName])
      this.featureHandlers.commands[commandName] = [];

    // finally push to it's handlers
    this.featureHandlers.commands[commandName].push(commandHandler);
  }

  // Start listening for all registered handlers
  startListening() {
    // Logging
    displayTable(this.featureHandlers.commands, "Registered Commands Table:");
    displayTable(this.featureHandlers.messages, "Registered Message Table:");

    // Start Listening
    this._startListeningForMessages(this.featureHandlers.messages);
    this._startListeningForCommands(this.featureHandlers.commands);
  }

  _startListeningForMessages(messageHandlersMap) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      console.log("Message Recieved:", message, "\nfrom sender", sender);

      const handlerList = messageHandlersMap[message.type];
      handlerList?.forEach(handler =>
        handler(this, message, sender, sendResponse)
      );
    });
  }

  _startListeningForCommands(handlers) {
    chrome.commands.onCommand.addListener((commandName, tab) => {
      console.log("Command Recieved:", commandName, "\nfrom tab", tab);

      const handlerList = handlers[commandName];
      handlerList?.forEach(handler => handler(this, tab));
    });
  }
}

/**
 * Prints a table to the console for an object where values are arrays of handlers/functions.
 * @param {object} strToHandlerFuncs - The object containing command names as keys and handler arrays as values.
 * @param {string} [tableName] - A title for the console output.
 */
function displayTable(strToHandlerFuncs, tableName = "Commands") {
  if (!strToHandlerFuncs || typeof strToHandlerFuncs !== "object") {
    console.error("Invalid input provided to displayTable.");
    return;
  }

  console.groupCollapsed(tableName);

  // Transform the map into a structured array of objects suitable for console.table
  const tableData = Object.entries(strToHandlerFuncs).map(
    ([name, handlersList]) => {
      // Ensure handlersList is treated as an array and has a length property
      const count = Array.isArray(handlersList) ? handlersList.length : 0;

      return {
        CommandName: name,
        HandlerCount: count,
        Handlers: handlersList,
      };
    }
  );

  console.table(tableData);

  console.groupEnd();
}

export { FeatureClient };
