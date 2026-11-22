async function loadLibrary() {
  const params = new URLSearchParams(window.location.search);
  const class_id = params.get("id");
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
    if (Object.hasOwn(libraryItem, "fileItem")) {
      //link.innerText = link.innerText + " - FILE"
      link.href =
        "https://connect.det.wa.edu.au" +
        libraryItem.fileItem.trackedAttachmentUrl;
    } else {
      li.style.fontWeight = "bold";
    }
    li.appendChild(link);
    libraryList.appendChild(li);
  }
}

loadLibrary();
