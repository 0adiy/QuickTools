// utils
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// TODO - load if the `open` is set on a details element or not

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

$("#clearCookies").addEventListener("click", () => {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		if (tabs.length > 0) {
			const domain = new URL(tabs[0].url).hostname;
			console.log("Current domain:", domain);

			chrome.cookies.getAll({ domain }, (cookies) => {
				console.log("Cookies found:", cookies);
				if (cookies.length === 0) {
					console.warn("No cookies found for this domain.");
				} else {
					cookies.forEach((cookie) => {
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
});
