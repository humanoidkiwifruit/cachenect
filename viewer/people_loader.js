const baseConnectUrl = "https://connect.det.wa.edu.au";
async function loadPeople() {
  const class_id = getRequestedClassIdFromUrlParams();
  const { cachenectClassesData = {} } = await browser.storage.local.get(
    "cachenectClassesData",
  ); //Get the data
  console.log("cachenectClassesData: ", cachenectClassesData);
  let teachersList = document.getElementById("teachers-list");
  let studentsList = document.getElementById("students-list");

  for (const teacher of cachenectClassesData[class_id].teachers) {
    teachersList.appendChild(personLi(teacher));
  }

  for (const student of cachenectClassesData[class_id].students) {
    studentsList.appendChild(personLi(student));
  }
}

loadPeople();
document.getElementById("official-connect-link").href =
  baseConnectUrl +
  "/redirect/cls/" +
  getRequestedClassIdFromUrlParams() +
  "/learners";

/**Applies to getting the class id ONLY from the url bar in library.html. Does not work for the official connect site */
function getRequestedClassIdFromUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return params.get("id");
}

function personLi(person_item) {
  let li = document.createElement("li");
  li.innerText = `${person_item.name} - ${person_item.emailAddress} `;
  let copyEmailButton = document.createElement("button");
  copyEmailButton.textContent = "Copy email address";

  copyEmailButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(person_item.emailAddress);
    copyEmailButton.textContent = "Copied!";
    setTimeout(() => {
      copyEmailButton.textContent = "Copy email address";
    }, 1500);
  });

  li.appendChild(copyEmailButton);
  return li;
}
