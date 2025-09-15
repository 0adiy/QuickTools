chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINKS_FROM_SELECTION") {
    const links = message.links;

    // FIXME - Store in correct part of local storage
    chrome.storage.local.get(["urlTextbox"]).then(result => {
      // TODO - check if verbose is on or not
      const res = result.urlTextbox + links.join("\n");

      console.log("result: ", result, " res: ", res);
      chrome.storage.local.set({ urlTextbox: res }, () => {
        console.log("Links saved.");
      });
    });
  }
});
