/**
 * Gets all tabs across all windows using
 * @returns {Promise<chrome.tabs.Tab[]>}
 */
async function getAllTabs() {
  // An empty query object retrieves all tabs across all windows.
  const tabs = await chrome.tabs.query({});
  return tabs;
}

/**
 * Gets all tabs in the current active window only.
 * @returns {Promise<chrome.tabs.Tab[]>}
 */
async function getTabsInCurrentWindow() {
  // Query for all tabs within the currently focused window.
  const tabs = await chrome.tabs.query({ currentWindow: true });
  return tabs;
}

/**
 * Gets all currently highlighted (selected) tabs within the active window.
 * Users can select multiple tabs using Ctrl/Cmd + Click.
 * @returns {Promise<chrome.tabs.Tab[]>}
 */
async function getAllHighlightedTabs() {
  const tabs = await chrome.tabs.query({
    currentWindow: true,
    highlighted: true,
  });
  return tabs;
}

/**
 * Gets the single currently active (focused) tab in the active window.
 * There is always exactly one active tab per window.
 * @returns {Promise<chrome.tabs.Tab>}
 */
async function getCurrentActiveTab() {
  const tabs = await chrome.tabs.query({ currentWindow: true, active: true });

  // Early return
  if (tabs.length !== 1)
    throw new Error("Could not determine the single active tab.");

  // The query for an active tab always returns an array with one element
  return tabs[0];
}

export {
  getAllTabs,
  getTabsInCurrentWindow,
  getAllHighlightedTabs,
  getCurrentActiveTab,
};
