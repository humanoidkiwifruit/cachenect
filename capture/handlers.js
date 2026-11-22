export async function handleClassesResponse(rawText) {
  const jsonData = JSON.parse(rawText);
  const jsonClasses = jsonData.items;
  console.log("classes:", jsonClasses);

  const { cachenectClassesData: classesData = {} } =
    await browser.storage.local.get("cachenectClassesData"); //Get the old version of our data

  for (const class_item of jsonClasses) {
    classesData[class_item.entityId] = {
      ...classesData[class_item.entityId],
      name: class_item.name,
      code: class_item.code,
    };
  } //write new info without overwriting any other stuff (like library/content data)

  await browser.storage.local.set({
    classesAPIResponse: jsonClasses,
    cachenectClassesData: classesData,
  }); //Write it again after modification
}

export async function handleLibraryRequest(details, rawText) {
  const referrerUrl = details.documentUrl || details.originUrl;
  console.log(`got library request from referrer ${referrerUrl}`);
}

async function writeLibraryData(json_classes) {
  const jsonData = JSON.parse(rawText);
  const { classLibraryMap = {} } =
    await browser.storage.local.get("classLibraryMap");
  await browser.storage.local.set({
    classesAPIResponse: json_classes,
    lastSync: Date.now(),
  });
}
