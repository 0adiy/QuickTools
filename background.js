// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "Hello") {
//     chrome.tabs.create({ url: "https://example.com/" }, (tab) => {
//       chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
//         if (info.status === "complete" && tabId === tab.id) {
//           chrome.tabs.onUpdated.removeListener(listener);
//           chrome.debugger.attach({ tabId: tab.id }, "1.0", () => {
//             // Update the tab URL
//             chrome.tabs.update(tabId, { url: "https://www.youtube.com" });
//             chrome.debugger.sendCommand(
//               { tabId: tab.id },
//               "Network.setUserAgentOverride",
//               {
//                 userAgent:
//                   "Mozilla/5.0 (Linux; Android 4.2.1; en-us; Nexus 5 Build/JOP40D) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19",
//               },
//               () => {
//                 chrome.debugger.detach({ tabId: tab.id });
//               }
//             );
//           });
//         }
//       });
//     });
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   console.log("hello");

//   if (request.message === "open") {
//     chrome.tabs.query({}, allTab => {
//       sendResponse(allTab);
//     });
//   }
//   return true;
// });

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   console.log("some event occrued");
//   // if (message.action === "grab") {
//   //   grabber(message, sender, sendResponse);
//   // } else if (message.action === "open") opener(message, sender, sendResponse);
// });

// function grabber(message, sender, sendResponse) {
//   chrome.tabs.query({}, allTab => {
//     sendResponse(allTab);
//   });
// }
