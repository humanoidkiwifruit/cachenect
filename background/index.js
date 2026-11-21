import { observeResponse, target } from "../capture/listener.js";

browser.webRequest.onBeforeRequest.addListener(
  observeResponse,
  { urls: [target] },
  ["blocking"],
);




browser.action.onClicked.addListener(async () => {
  browser.tabs.create({
    url: browser.runtime.getURL("viewer/classes.html")
  });
});
