const baseConnectUrl = "https://connect.det.wa.edu.au";
async function loadNotices() {
  const class_id = getRequestedClassIdFromUrlParams();
  const { cachenectClassesData = {} } = await browser.storage.local.get(
    "cachenectClassesData",
  ); //Get the data
  console.log("cachenectClassesData: ", cachenectClassesData);

  let noticesTable = document.getElementById("notices-table");
  for (const noticeItem of cachenectClassesData[class_id].notices) {
    let tr = document.createElement("tr");
    let td = document.createElement("td");
    let details = document.createElement("details");
    let summary = document.createElement("summary");
    summary.innerText = noticeItem.title;
    let fullText = document.createElement("p");
    fullText.innerHTML = noticeItem.content;
    fullText.classList.add("full-text-p");
    details.appendChild(summary);
    details.appendChild(fullText);
    td.appendChild(details);

    tr.appendChild(td);
    noticesTable.appendChild(tr);
  }
}

loadNotices();

document.getElementById("official-connect-link").href =
  baseConnectUrl +
  "/redirect/cls/" +
  getRequestedClassIdFromUrlParams() +
  "/announcements";

/**Applies to getting the class id ONLY from the url bar in library.html. Does not work for the official connect site */
function getRequestedClassIdFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}
