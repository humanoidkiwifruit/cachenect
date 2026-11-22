export const target = "*://connect.det.wa.edu.au/*";
const apiRequestPath = "connect.det.wa.edu.au/connectapi/rest/api/v1";
const classesRequestUrl = "/connectapi/rest/api/v1/app/my_classes/";
export function observeResponse(details) {
  if (details.type !== "xmlhttprequest") return;
  if (!(isInterestingUrl(details.url) === "classesRequest")) return;

  let filter = browser.webRequest.filterResponseData(details.requestId);
  const decoder = new TextDecoder("utf-8");
  let fullResponse = "";

  filter.ondata = (event) => {
    fullResponse += decoder.decode(event.data, { stream: true });
    filter.write(event.data);
  };

  filter.onstop = async (event) => {
    try {
      fullResponse += decoder.decode();

      const json_data = JSON.parse(fullResponse);
      const json_classes = json_data.items;
      console.log(json_classes);

      await writeClassesData(json_classes);
    } catch (error) {
      console.error("error: ", error.message);
    } finally {
      filter.close();
    }
  };

  filter.onerror = () => {
    console.error(`StreamFilter error: ${filter.error}`);
  };
}

function isInterestingUrl(url) {
  if (url.includes(classesRequestUrl)) {
    return "classesRequest";
  }
  /*if (url.includes(classLibraryRequestUrl)) {
    return "libraryRequest";
    }*/
  return url.includes(classesRequestUrl);
}

async function writeClassesData(json_classes) {
  await browser.storage.local.set({
    classes: json_classes,
    lastSync: Date.now(),
  });
}
