// utils
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

export function handleInput() {
  localStorage.setItem("urlTextbox", $("#urlTextbox").value);
}

export async function handleGetUrls() {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  $("#urlTextbox").value = tabs.map(tab => tab.url).join("\n");
  localStorage.setItem("urlTextbox", $("#urlTextbox").value);
}

export function handleOpenUrls() {
  const urls = $("#urlTextbox")
    .value.split("\n")
    .map(url => url.trim())
    .filter(url => url.length > 0);

  urls.forEach(url => chrome.tabs.create({ url }));
}

export function handleClearText() {
  $("#urlTextbox").value = "";
  localStorage.setItem("urlTextbox", "");
  $("#urlTextbox").focus();
}

export function handleCopyText() {
  const text = $("#urlTextbox").value;
  navigator.clipboard.writeText(text);
}

export function handleReloadAll() {
  chrome.tabs.query({}, allTab => {
    allTab.forEach(tab => chrome.tabs.reload(tab.id));
  });
}

export function handleGroupTabs() {
  chrome.tabs.query({}, tabs => {
    const domainToTabs = tabs.reduce((acc, tab) => {
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
          chrome.tabs.group(
            {
              tabIds: tabIds,
            },
            newGroupId => {
              chrome.tabGroups.create(
                {
                  title: domain,
                  color: "blue",
                },
                group => {
                  chrome.tabs.group({
                    groupId: group.id,
                    tabIds: tabIds,
                  });
                }
              );
            }
          );
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
      func: () => {
        document.addEventListener(
          "contextmenu",
          e => e.stopPropagation(),
          true
        );
      },
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
      func: () => {
        document.body.contentEditable = true;
      },
    });
  });
}
