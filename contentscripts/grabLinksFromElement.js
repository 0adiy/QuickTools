//////////////////
// Driver code //
/////////////////
let isSelectionModeActive = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "activate_link_grabber") {
    if (!isSelectionModeActive) {
      activateSelectionMode();
    }
  }
});

/////////////
// Helpers //
/////////////
function activateSelectionMode() {
  isSelectionModeActive = true;
  document.body.style.cursor = "crosshair";

  injectHighlightStylesOnce();

  document.addEventListener("mouseover", onHoverElement);
  document.addEventListener("click", onClickSelectElement);
}

function deactivateSelectionMode() {
  isSelectionModeActive = false;
  document.body.style.cursor = "default";

  document.removeEventListener("mouseover", onHoverElement);
  document.removeEventListener("click", onClickSelectElement);

  document
    .querySelectorAll(".quicktools-linkgrab-hover-highlight")
    .forEach(el => el.classList.remove("quicktools-linkgrab-hover-highlight"));
}

function onHoverElement(event) {
  if (!isSelectionModeActive) return;

  document
    .querySelectorAll(".quicktools-linkgrab-hover-highlight")
    .forEach(el => el.classList.remove("quicktools-linkgrab-hover-highlight"));

  const target = event.target;
  if (target && target !== document.body) {
    target.classList.add("quicktools-linkgrab-hover-highlight");
  }
}

function onClickSelectElement(event) {
  if (!isSelectionModeActive) return;

  event.preventDefault();
  event.stopPropagation();

  const selectedElement = event.target;
  deactivateSelectionMode();

  const linkObjs = [...selectedElement.querySelectorAll("a")].map(a => {
    return { url: a.href, title: a.innerText };
  });

  // Send back to popup
  chrome.runtime.sendMessage({
    type: "LINKS_FROM_SELECTION",
    linkObjs,
  });
}

function injectHighlightStylesOnce() {
  // exit if already styled
  if (document.body.getAttribute("data-quicktools-style")) return;

  const style = document.createElement("style");

  style.innerHTML = `
    .quicktools-linkgrab-hover-highlight {
      outline: 3px solid rgba(255, 255, 0, 0.7);
      background-color: rgba(255, 255, 0, 0.1);
    }
  `;

  document.head.appendChild(style);
  document.body.setAttribute("data-quicktools-style", "true");
}
