const baseConnectUrl = "https://connect.det.wa.edu.au";
async function loadLibrary() {
  const class_id = getRequestedClassIdFromUrlParams();
  const { cachenectClassesData = {} } = await browser.storage.local.get(
    "cachenectClassesData",
  ); //Get the data
  console.log("cachenectClassesData: ", cachenectClassesData);

  document.getElementById("class-info").innerText =
    `${cachenectClassesData[class_id].name} - id (${class_id}) - Library`;
  let libraryList = document.getElementById("library-list");
  for (const libraryItem of cachenectClassesData[class_id].library) {
    let li = document.createElement("li");
    let link = document.createElement("a");
    link.innerText = libraryItem.name;
    if (libraryItem.nodeType === "FILEITEM") {
      //Is a file rather than a folder
      link.href = baseConnectUrl + libraryItem.fileItem.trackedAttachmentUrl;
    } else {
      li.style.fontWeight = "bold";
    }
    li.appendChild(link);
    libraryList.appendChild(li);
  }
}

loadLibrary();
document.getElementById("official-connect-link").href =
  baseConnectUrl +
  "/redirect/cls/" +
  getRequestedClassIdFromUrlParams() +
  "/class-library";

/**Applies to getting the class id ONLY from the url bar in library.html. Does not work for the official connect site */
function getRequestedClassIdFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
