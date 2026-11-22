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
  const referrerClassId = getEndingNumber(referrerUrl);
  console.log(`referrer class id: ${referrerClassId}`);
  let classesData = await getCachenectClassData();
  classesData[referrerClassId].library = JSON.parse(rawText).items;
  await browser.storage.local.set({
    cachenectClassesData: classesData,
  });
}

function getEndingNumber(str) {
  const match = str.match(/\d+$/);
  return match ? Number(match[0]) : null;
}

async function getCachenectClassData() {
  const { cachenectClassesData: classesData = {} } =
    await browser.storage.local.get("cachenectClassesData"); //Get the old version of our data
  return classesData;
}
