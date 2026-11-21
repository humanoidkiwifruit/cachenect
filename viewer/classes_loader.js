const baseRedirect = "https://connect.det.wa.edu.au/redirect/cls/";

const prettyNameLookups = {
  announcements: "Notices",
  "class-library": "Library",
  "learning-content": "Content",
  submissions: "Submissions",
  discussions: "Discussions",
  learners: "Learners",
};

async function loadClasses() {
  const classes = (await browser.storage.local.get("classes")).classes;
  const table = document.getElementById("classes-table");

  for (const class_item of classes) {
    const classRow = classTableRow(class_item);
    table.appendChild(classRow);
  }
}

loadClasses();

function classTableRow(class_item) {
  let classTr = document.createElement("tr");
  const idRedirect = baseRedirect + class_item.entityId + "/";

  let nameLinkTd = linkTd(idRedirect, class_item.name);
  classTr.appendChild(nameLinkTd);

  let otherTds = Object.keys(prettyNameLookups).map((name) => {
    return linkTd(idRedirect + name, prettyNameLookups[name]);
  });
  for (let td of otherTds) {
    classTr.appendChild(td);
  }

  return classTr;
}

function linkTd(href, text) {
  let td = document.createElement("td");
  let link = document.createElement("a");
  link.href = href;
  link.innerText = text;
  td.appendChild(link);
  return td;
}
