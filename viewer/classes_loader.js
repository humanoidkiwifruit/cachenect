const baseRedirect = "https://connect.det.wa.edu.au/redirect/cls/";

const prettyNameLookups = {
  // "slug": "Pretty Name"
  announcements: "Notices",
  "class-library": "Library",
  "learning-content": "Content",
  submissions: "Submissions",
  discussions: "Discussions",
  learners: "Learners",
};

/**Load the class data into the table */
async function loadClasses() {
  const { cachenectClassesData = {} } = await browser.storage.local.get(
    "cachenectClassesData",
  ); //Get the data
  console.log("cachenectClassesData: ", cachenectClassesData);

  const table = document.getElementById("classes-table");
  table.innerHTML = ""; //Get and clear the table

  for (const [class_id, class_data] of Object.entries(cachenectClassesData)) {
    const classRow = classTableRow(class_id, class_data);
    table.appendChild(classRow); //Create a row for every class
  }
}

loadClasses();

document.getElementById("clear-btn").addEventListener("click", () => {
  browser.storage.local.clear();
  loadClasses();
});

function classTableRow(class_id, class_data) {
  let classTr = document.createElement("tr");
  const idRedirect = baseRedirect + class_id + "/";

  let nameLinkTd = linkTd(
    idRedirect,
    class_data.name + " - id (" + class_id + ")",
  );
  classTr.appendChild(nameLinkTd);
  nameLinkTd.classList.add("class-pretty-name");

  let cachenectLibraryLinkTd = linkTd(
    `/viewer/library.html?id=${class_id}`,
    "Library",
    false,
  );
  classTr.appendChild(cachenectLibraryLinkTd);

  let cachenectPeopleLinkTd = linkTd(
    `/viewer/teachersandlearners.html?id=${class_id}`,
    "Teachers and Learners",
    false,
  );
  classTr.appendChild(cachenectPeopleLinkTd);

  let connectLinkTds = Object.keys(prettyNameLookups).map((name) => {
    return linkTd(idRedirect + name, prettyNameLookups[name]);
  });
  for (let td of connectLinkTds) {
    classTr.appendChild(td);
  }

  return classTr;
}

function linkTd(href, text, isOfficialConnect = true) {
  let td = document.createElement("td");
  td.classList.add("link-td");
  let link = document.createElement("a");
  link.href = href;
  link.innerText = text;
  if (isOfficialConnect) {
    link.style.color = "green";
  }
  td.appendChild(link);
  return td;
}
