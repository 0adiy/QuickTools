chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LINKS_FROM_SELECTION") {
    const linkObjs = message.linkObjs;

    chrome.storage.local.get(["urlTextbox", "verbose"]).then(result => {
      let res = "";

      for (let ob of linkObjs) {
        if (result.verbose) {
          res += `# ${ob.title}\n${ob.url}\n\n`;
        } else {
          res += `${ob.url}\n`;
        }
      }

      // early return
      if (res.length === 0) return;

      res = result.urlTextbox + res;

      // console.log("result: ", result, " res: ", res);
      chrome.storage.local.set({ urlTextbox: res }, () => {
        // console.log("Links saved.");
      });
    });
  }
});

chrome.commands.onCommand.addListener(command => {
  if (command == "collect-tabs") {
    handleCollectTabs();
  }
});

async function handleCollectTabs() {
  let { textboxValue, verbose } = await chrome.storage.local.get([
    "urlTextbox",
    "verbose",
  ]);

  // TODO : getting verbose or urlTextbox should be a function that always fetches from storage
  // then handling of setting the new value should again be part of the same struct/class
  // it can also have caching using private `updated` boolean that is set, when you set a value,
  // and next job of accessing will actually fetch from storage, unsetting the bool,
  // otherwise it can just return the current holding value
  textboxValue = textboxValue || "";

  const tabs = await chrome.tabs.query({ currentWindow: true });

  if (textboxValue.length > 0) textboxValue += "\n";

  if (verbose) {
    textboxValue += tabs.map(tab => `#${tab.title}\n${tab.url}\n`).join("\n");
  } else {
    textboxValue += tabs.map(tab => tab.url).join("\n");
  }

  chrome.storage.local.set({ urlTextbox: textboxValue });
}
