import {
  handleClassesResponse,
  handleLibraryRequest,
  handleTeachersRequest,
  handleStudentsRequest,
  handleNoticesRequest,
} from "./handlers.js";

export const target = "*://connect.det.wa.edu.au/*";

const apiRequestPathRegex =
  "connect\\.det\\.wa\\.edu\\.au/connectapi/rest/api/v1";

const classesRegex = new RegExp(`^${apiRequestPathRegex}/app/my_classes/`);

const libraryRegex = new RegExp(
  `^${apiRequestPathRegex}/library/node/.+/contents$`,
);

const teachersRegex = new RegExp(
  `^${apiRequestPathRegex}/common/schoolclasses/.+/(teachers|staff)$`,
);

export const studentsRegex = new RegExp(
  `^${apiRequestPathRegex}/common/schoolclasses/.+/students$`,
);

export const noticesRegex = new RegExp(
  `^${apiRequestPathRegex}/notices/scope/DomainSchoolClass/.+/$`,
);

export function observeResponse(details) {
  if (details.type !== "xmlhttprequest") return;
  const requestType = getInterestingRequestType(details.url);

  if (requestType == "boring") return;

  processResponse(details, requestType);
}

async function processResponse(details, requestType) {
  console.log("processResponse, request type: ", requestType);
  try {
    const rawText = await getFullResponseData(details.requestId);
    if (requestType === "classesRequest") {
      await handleClassesResponse(rawText);
    }

    if (requestType === "libraryRequest") {
      await handleLibraryRequest(details, rawText);
    }

    if (requestType === "teachersRequest") {
      console.log("processing a teachersRequest");
      await handleTeachersRequest(details, rawText);
    }

    if (requestType === "studentsRequest") {
      console.log("processing a studentsRequest");
      await handleStudentsRequest(details, rawText);
    }

    if (requestType === "noticesRequest") {
      console.log("processing a noticesRequest");
      await handleNoticesRequest(details, rawText);
    }
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
  const urlObject = new URL(url);
  let cleanUrl = urlObject.hostname + urlObject.pathname;

  if (classesRegex.test(cleanUrl)) {
    return "classesRequest";
  }

  if (libraryRegex.test(cleanUrl)) {
    return "libraryRequest";
  }
  if (teachersRegex.test(cleanUrl)) {
    console.log("Url is a teachersRequest");
    return "teachersRequest";
  }
  if (studentsRegex.test(cleanUrl)) {
    console.log("url is a studentsRequest");
    return "studentsRequest";
  }
  if (noticesRegex.test(cleanUrl)) {
    console.log("url is a noticesRequest");
    return "noticesRequest";
  }
  return "boring";
}
