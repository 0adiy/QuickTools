// NOTE - This func is executed in context of target tab
// hence it can't use chrome apis other than the runtime.sendMessage

// TODO - Future scope: we can use `eslint-no-closure` here provided via plugins if eslint system is setup

/**
 * [WARNING]: This function is injected into the content script context via chrome.scripting.executeScript.
 * It is executed as a pure function string and cannot access closures or global variables from this file.
 * All dependencies must be passed via the 'args' parameter during injection.
 */
function injectedFunc(messageType) {
  const query = document.getSelection().toString();
  chrome.runtime.sendMessage({ query, type: messageType });
}

export { injectedFunc };
