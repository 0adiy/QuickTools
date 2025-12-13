///////////
// utils //
///////////
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//////////////
// Handlers //
//////////////
export function handleInput() {
  // TODO - extract this to updateUrlTextBox() in utils,
  // also extract getVerbose() and setVerbose() in utils
  const value = $("#urlTextbox").value;
  chrome.storage.local.set({ urlTextbox: value });
}

export async function handleCollectTabs(append = true, titles = false) {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  if (append == false) $("#urlTextbox").value = "";

  if ($("#urlTextbox").value.length > 0) $("#urlTextbox").value += "\n";

  if (titles) {
    $("#urlTextbox").value += tabs
      .map(tab => `#${tab.title}\n${tab.url}\n`)
      .join("\n");
  } else {
    $("#urlTextbox").value += tabs.map(tab => tab.url).join("\n");
  }

  chrome.storage.local.set({ urlTextbox: $("#urlTextbox").value });
}

export function handleOpenUrls() {
  const urls = $("#urlTextbox")
    .value.replace(/\/\*.*?\*\//gs, "")
    .split("\n")
    .map(url => url.trim())
    .filter(url => url.startsWith("http"));

  urls.forEach(url => chrome.tabs.create({ url }));
}

export function handleClearText() {
  $("#urlTextbox").value = "";
  chrome.storage.local.set({ urlTextbox: "" });
  $("#urlTextbox").focus();
}

export function handleCopyText() {
  const text = $("#urlTextbox").value;
  if (text.length === 0) return;
  navigator.clipboard.writeText(text);
}

export function handleReloadAll() {
  chrome.tabs.query({}, allTab => {
    allTab.forEach(tab => chrome.tabs.reload(tab.id));
  });
}

export function handleGroupTabs() {
  chrome.tabs.query({}, tabs => {
    const domainToTabs = tabs
      .filter(tab => !tab.pinned)
      .filter(tab => tab.groupId == -1) // filter tabs that are ungrouped
      .reduce((acc, tab) => {
        const url = new URL(tab.url);
        const domain = url.hostname;
        if (!acc[domain]) {
          acc[domain] = [];
        }
        acc[domain].push(tab.id);
        return acc;
      }, {});

    chrome.tabGroups.query({}, groups => {
      const domainToGroupId = {};
      groups.forEach(group => {
        domainToGroupId[group.title] = group.id;
      });

      for (const [domain, tabIds] of Object.entries(domainToTabs)) {
        if (tabIds.length <= 1) {
          continue;
        }

        const groupId = domainToGroupId[domain];
        if (groupId) {
          chrome.tabs.group({
            groupId: groupId,
            tabIds: tabIds,
          });
        } else {
          chrome.tabs.group({ tabIds: tabIds }, newGroupId => {
            chrome.tabGroups.create({ title: domain, color: "blue" }, group =>
              chrome.tabs.group({ groupId: group.id, tabIds: tabIds })
            );
          });
        }
      }
    });
  });
}

export function handleEnableContextMenu() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () =>
        document.addEventListener(
          "contextmenu",
          e => e.stopPropagation(),
          true
        ),
    });
  });
}

export function handleEnableSelection() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        document.addEventListener(
          "selectstart",
          e => e.stopPropagation(),
          true
        );
      },
    });
  });
}

export function handleEnableContentEditing() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => (document.body.contentEditable = true),
    });
  });
}

export function handleClearCookies() {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length > 0) {
      const domain = new URL(tabs[0].url).hostname;
      console.log("Current domain:", domain);

      chrome.cookies.getAll({ domain }, cookies => {
        console.log("Cookies found:", cookies);
        if (cookies.length === 0) {
          console.warn("No cookies found for this domain.");
        } else {
          cookies.forEach(cookie => {
            chrome.cookies.remove({
              url: `http${cookie.secure ? "s" : ""}://${cookie.domain}${
                cookie.path
              }`,
              name: cookie.name,
            });
          });
          console.log("Cookies cleared.");
        }
      });
    } else {
      console.warn("No active tab found.");
    }
  });
}

export function handleComment() {
  const textareaRef = $("#urlTextbox");
  const start = textareaRef.selectionStart;
  const end = textareaRef.selectionEnd;

  // console.log(start, ":",end);

  // modify
  textareaRef.value =
    textareaRef.value.slice(0, start) +
    "/*\n" +
    textareaRef.value.slice(start, end) +
    "\n*/" +
    textareaRef.value.slice(end);

  textareaRef.dispatchEvent(
    new Event("input", {
      bubbles: true,
      cancelable: true,
    })
  );

  //reset
  textareaRef.selectionStart = start;
  textareaRef.selectionEnd = end + 8;
}

export async function handleGrabLinksFromElement() {
  // send to background
  chrome.runtime.sendMessage({
    type: "activate-selection-mode-POPUP",
  });

  // close popup so user can interact with the page
  window.close();
}
