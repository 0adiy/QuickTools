/** @import { FeatureClient, MessageHandlerCb, CommandHandlerCb} from "../lib/featureclient.js" */

/** @param {FeatureClient} client */
export function registerScrapeLinks(client) {
  client.registerMessage("SCRAPE_LINKS", scrapeLinksMessageHandler);
}

/** @type {MessageHandlerCb} */
function scrapeLinksMessageHandler(client, message, sender, sendResponse) {
  console.log("Scraping links from the page...");
  sendResponse(["link1", "link2", "link3"]); // Dummy result
}
