//////////////////
// Driver code //
/////////////////
const MESSAGE_ACTIVATE = "activate-selection-mode"; // recieved from bg
const MESSAGE_GRAB_LINKS = "grab-links-from-selection"; // sent to bg

let isSelectionModeActive = false; // global tracking variable

chrome.runtime.onMessage.addListener(onMessageActivate);

/////////////
// Helpers //
/////////////

function onMessageActivate(message, sender, sendResponse) {
  if (message.type === MESSAGE_ACTIVATE && !isSelectionModeActive)
    activateSelectionMode();
}

/** On Esc button press deactivateSelectionMode
 *  @param {KeyboardEvent} event */
function onEscPressed(event) {
  if (event.key == "Escape") deactivateSelectionMode();
}

function activateSelectionMode() {
  isSelectionModeActive = true;
  document.body.style.cursor = "crosshair";

  injectHighlightStylesOnce();

  document.addEventListener("mouseover", onHoverElement);
  document.addEventListener("click", onClickSelectElement);

  // Deactivate if Escape pressed
  document.addEventListener("keydown", onEscPressed);
}

function deactivateSelectionMode() {
  isSelectionModeActive = false;
  document.body.style.cursor = "default";

  document.removeEventListener("mouseover", onHoverElement);
  document.removeEventListener("click", onClickSelectElement);

  document
    .querySelectorAll(".quicktools-linkgrab-hover-highlight")
    .forEach(el => el.classList.remove("quicktools-linkgrab-hover-highlight"));

  // Remove Esc press listener
  document.removeEventListener("keydown", onEscPressed);
}

/** On hover highlight the element that will be selected
 *  @param {MouseEvent} event */
function onHoverElement(event) {
  if (!isSelectionModeActive) return;

  document
    .querySelectorAll(".quicktools-linkgrab-hover-highlight")
    .forEach(el => el.classList.remove("quicktools-linkgrab-hover-highlight"));

  const hoveredEl = event.target;
  if (!(hoveredEl instanceof Element)) return; // to assert that classList exists on this

  if (hoveredEl && hoveredEl !== document.body) {
    hoveredEl.classList.add("quicktools-linkgrab-hover-highlight");
  }
}

/** On click of highlighted element, send it's inner links as message and deactivate selection mode
 *  @param {MouseEvent} event */
function onClickSelectElement(event) {
  if (!isSelectionModeActive) return;

  event.preventDefault();
  event.stopPropagation();

  const selectedEl = event.target;
  if (!(selectedEl instanceof Element)) return; // to assert that querySelectorAll exists on this

  const linkObjs = Array.from(selectedEl.querySelectorAll("a")).map(a => ({
    url: a.href,
    title: a.innerText,
  }));

  deactivateSelectionMode();

  // Send back to bg script
  chrome.runtime.sendMessage({
    type: MESSAGE_GRAB_LINKS,
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
