import {
  handleInput,
  handleGetUrls,
  handleOpenUrls,
  handleClearText,
  handleCopyText,
  handleReloadAll,
  handleGroupTabs,
  handleEnableContextMenu,
  handleEnableSelection,
  handleEnableContentEditing,
  handleClearCookies,
  handleComment,
  handleGrabLinksFromElement,
} from "./handlers.js";

///////////
// utils //
///////////

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

//////////////////////
// Verbose handling //
//////////////////////

// Load verbose btn state and attach updater on click
const verboseBtn = $("#verboseBtn");
function updateVerboseBtnUI(updateValue = false) {
  chrome.storage.local.get("verbose", result => {
    let verbose = result.verbose ?? false;

    if (updateValue) {
      verbose = !verbose;
      chrome.storage.local.set({ verbose });
    }

    // REVIEW - why use of 2 classes??
    if (!verbose) {
      verboseBtn.classList.remove("selected");
      verboseBtn.classList.add("unselected");
    } else {
      verboseBtn.classList.remove("unselected");
      verboseBtn.classList.add("selected");
    }
  });
}

updateVerboseBtnUI();

verboseBtn.onclick = () => {
  updateVerboseBtnUI(true);
};

/////////////////////////////////////
// Handle Categories (details tag) //
/////////////////////////////////////

// Attaching click event handler and loading state of <details> open attribute
const sectionIds = [
  "custom-scripts-category",
  "tabs-category",
  "temp-category",
];

sectionIds.forEach(id => {
  const detailsRef = document.getElementById(id);
  const summaryRef = detailsRef.querySelector("summary");

  // Load initial state from chrome.storage
  // REVIEW - why not [id] instead of just id? why does this work?
  chrome.storage.local.get(id, result => {
    const isOpen = result[id];
    if (typeof isOpen === "boolean") {
      detailsRef.open = isOpen;
    }
  });

  summaryRef.addEventListener("click", () => {
    // Toggle state and persist
    const newVal = !detailsRef.open;
    chrome.storage.local.set({ [id]: newVal });
  });
});

////////////////////////////////////////
// Load urlTextbox with local storage //
////////////////////////////////////////
chrome.storage.local
  .get(["urlTextbox"])
  .then(res => res.urlTextbox)
  .then(urlTextboxValue => {
    $("#urlTextbox").value = urlTextboxValue || "";
  });

// $("#urlTextbox").focus(); // TODO - why not??

/////////////////////////
// Attaching listeners //
/////////////////////////
$("#urlTextbox").addEventListener("input", handleInput);
$("#getUrls").addEventListener("click", e => {
  // based on verbose or not, pass titles=true/false in handleGetUrls
  chrome.storage.local
    .get(["verbose"])
    .then(result => result.verbose)
    .then(verbose => handleGetUrls(true, verbose));
});
$("#getUrls").addEventListener("contextmenu", e => {
  e.preventDefault();
  if (e.ctrlKey) handleGetUrls(false, true);
  else handleGetUrls(false, false);
});
$("#openUrls").addEventListener("click", handleOpenUrls);
$("#clearText").addEventListener("click", handleClearText);
$("#copyText").addEventListener("click", handleCopyText);
$("#reloadAll").addEventListener("click", handleReloadAll);
$("#groupTabs").addEventListener("click", handleGroupTabs);
$("#enableContextMenu").addEventListener("click", handleEnableContextMenu);
$("#enableSelection").addEventListener("click", handleEnableSelection);
$("#enableContentEditing").addEventListener(
  "click",
  handleEnableContentEditing
);
$("#clearCookies").addEventListener("click", handleClearCookies);
$("#grabLinksFromElement").addEventListener(
  "click",
  handleGrabLinksFromElement
);

///////////////
// Shortcuts //
///////////////
document.addEventListener("keydown", e => {
  if (e.ctrlKey && e.key === "/") handleComment();
});
