// utils
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Load urlTextbox with local storage
$("#urlTextbox").value = localStorage.getItem("urlTextbox") || "";
$("#urlTextbox").focus();

// Import handler functions
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
} from "./handlers.js";

// Attaching listeners
$("#urlTextbox").addEventListener("input", handleInput);
$("#getUrls").addEventListener("click", handleGetUrls);
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
