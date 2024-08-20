// utils
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// load urlTextbox with local storage
$("#urlTextbox").value = localStorage.getItem("urlTextbox") || "";
$("#urlTextbox").focus();

//
// Attaching listeners
//
$("#urlTextbox").addEventListener("input", () =>
  localStorage.setItem("urlTextbox", $("#urlTextbox").value)
);

$("#getUrls").addEventListener("click", async () => {
  const tabs = await chrome.tabs.query({ currentWindow: true });
  $("#urlTextbox").value = tabs.map(tab => tab.url).join("\n");
  localStorage.setItem("urlTextbox", $("#urlTextbox").value);
});

$("#openUrls").addEventListener("click", () => {
  const urls = $("#urlTextbox")
    .value.split("\n")
    .map(url => url.trim())
    .filter(url => url.length > 0);

  urls.forEach(url => chrome.tabs.create({ url }));
});

$("#clearText").addEventListener("click", () => {
  $("#urlTextbox").value = "";
  localStorage.setItem("urlTextbox", "");
  $("#urlTextbox").focus();
});

$("#copyText").addEventListener("click", () => {
  const text = $("#urlTextbox").value;
  navigator.clipboard.writeText(text);
});

$("#reloadAll").addEventListener("click", () => {
  chrome.tabs.query({}, allTab => {
    allTab.forEach(tab => chrome.tabs.reload(tab.id));
  });
});

$("#groupTabs").addEventListener("click", () => {
  chrome.tabs.query({}, tabs => {
    // Create a mapping of domains to tab IDs
    const domainToTabs = tabs.reduce((acc, tab) => {
      const url = new URL(tab.url);
      const domain = url.hostname;
      if (!acc[domain]) {
        acc[domain] = [];
      }
      acc[domain].push(tab.id);
      return acc;
    }, {});

    // Get existing tab groups
    chrome.tabGroups.query({}, groups => {
      const domainToGroupId = {};

      // Map existing groups by their title
      groups.forEach(group => {
        domainToGroupId[group.title] = group.id;
      });

      // Create new groups and move tabs to those groups
      for (const [domain, tabIds] of Object.entries(domainToTabs)) {
        if (tabIds.length <= 1) {
          // Skip single tabs
          continue;
        }

        const groupId = domainToGroupId[domain];

        // Group already exists
        if (groupId) {
          chrome.tabs.group({
            groupId: groupId,
            tabIds: tabIds,
          });
        } else {
          // Create a new group and then move tabs to it
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
});

$("#enableContextMenu").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    // Get the ID of the active tab
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
});

$("#enableSelection").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    // Get the ID of the active tab
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
});

$("#enableContentEditing").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    // Get the ID of the active tab
    const tabId = tabs[0].id;

    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        document.body.contentEditable = true;
      },
    });
  });
});
