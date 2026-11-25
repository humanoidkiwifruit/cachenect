import {
  observeResponse,
  target,
  studentsRegex,
  noticesRegex,
} from "../capture/listener.js";

browser.webRequest.onBeforeRequest.addListener(
  observeResponse,
  { urls: [target] },
  ["blocking", "requestBody"],
);

browser.action.onClicked.addListener(async () => {
  browser.tabs.create({
    url: browser.runtime.getURL("viewer/classes.html"),
  });
});

function modifyRequest(details) {
  const url = new URL(details.url);
  let cleanUrl = url.hostname + url.pathname;
  if (
    (studentsRegex.test(cleanUrl) || noticesRegex.test(cleanUrl)) &&
    url.searchParams.has("range") &&
    url.searchParams.get("range") !== "100"
  ) {
    console.log("setting range to 100");
    //request is a request url that needs to be modified such that all the things are listed in one go. Just makes it easier to parse.
    url.searchParams.set("range", "100");
    return { redirectUrl: url.toString() };
  }
}

browser.webRequest.onBeforeRequest.addListener(
  modifyRequest,
  { urls: [target] },
  ["blocking"],
);
