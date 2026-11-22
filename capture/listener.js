import { handleClassesResponse } from "./handlers.js";
export const target = "*://connect.det.wa.edu.au/*";
const apiRequestPath = "connect.det.wa.edu.au/connectapi/rest/api/v1";
const classesRequestUrl = apiRequestPath + "/app/my_classes/";
//const libraryRequestUrl = apiRequestPath + "/library/node/ * /contents"
export function observeResponse(details) {
  if (details.type !== "xmlhttprequest") return;
  const requestType = getInterestingRequestType(details.url);

  if (requestType == "boring") {
    return;
  }

  processResponse(details, requestType);
}

async function processResponse(details, requestType) {
  try {
    const rawText = await getFullResponseData(details.requestId);
    if (requestType === "classesRequest") {
      await handleClassesResponse(rawText);
    }
    /*if (requestType === "libraryRequest") {
      await handleLibraryRequest(details, rawText);
    }*/
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

function getFullResponseData(requestId) {
  return new Promise((resolve, reject) => {
    const filter = browser.webRequest.filterResponseData(requestId);
    const decoder = new TextDecoder("utf-8");
    let fullResponse = "";

    filter.ondata = (event) => {
      fullResponse += decoder.decode(event.data, { stream: true });
      filter.write(event.data); // Pass data through to the webpage
    };

    filter.onstop = () => {
      fullResponse += decoder.decode(); // Flush remaining bytes
      filter.close();
      resolve(fullResponse);
    };

    filter.onerror = () => {
      reject(new Error(`error: ${filter.error}`));
    };
  });
}

function getInterestingRequestType(url) {
  if (url.includes(classesRequestUrl)) {
    return "classesRequest";
  }
  /*if (url.includes()) {
    return "libraryRequest";
    }*/
  return "boring";
}
