async function loadClasses() {
  const classes = (await browser.storage.local.get("classes")).classes;
  const container = document.getElementById("classes-list");

  for (const class_item of classes) {
    let class_link = document.createElement("a");
    let class_pg = document.createElement("p");

    class_pg.textContent = class_item.name;
    class_link.href = "https://connect.det.wa.edu.au/redirect/cls/" + class_item.entityId
    class_link.appendChild(class_pg)
    container.appendChild(class_link)

  }
}
loadClasses()
