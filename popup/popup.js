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
	handleClearCookies,
} from "./handlers.js";

// utils
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Attaching and loading <details> `open` attribute
for (let x of ["custom-scripts-category", "tabs-category", "temp-category"]) {
	// console.log(x, localStorage.getItem(x));
	const ref = $(`#${x}`);
	ref.open = localStorage.getItem(x) === "true" ? true : false;

	ref.addEventListener("click", (e) => {
		const val = ref.open;
		localStorage.setItem(x, `${!val}`);
		ref.open = val;
	});
}

// Load urlTextbox with local storage
$("#urlTextbox").value = localStorage.getItem("urlTextbox") || "";
$("#urlTextbox").focus();

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
$("#clearCookies").addEventListener("click", handleClearCookies);
