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
	handleComment,
} from "./handlers.js";

// utils
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

// Attaching and loading <details> `open` attribute
for (let x of ["custom-scripts-category", "tabs-category", "temp-category"]) {
	console.log(x, localStorage.getItem(x));
	const detailsRef = $(`#${x}`);
	const summaryRef = detailsRef.children[0];

	detailsRef.open = localStorage.getItem(x) === "true" ? true : false;

	summaryRef.addEventListener("click", (e) => {
		const val = detailsRef.open;
		localStorage.setItem(x, `${!val}`);
		detailsRef.open = val;
	});
}

// Load urlTextbox with local storage
$("#urlTextbox").value = localStorage.getItem("urlTextbox") || "";
// $("#urlTextbox").focus();

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

// Shortcuts
document.addEventListener("keydown", (e) => {
	if (e.ctrlKey && e.key === "/") {
		handleComment();
	}
});
