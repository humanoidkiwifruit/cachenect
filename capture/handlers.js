export async function handleClassesResponse(rawText) {
  const jsonData = JSON.parse(rawText);
  const jsonClasses = jsonData.items;
  console.log("classes:", jsonClasses);

  await writeClassesData(jsonClasses);
}
async function writeClassesData(json_classes) {
  await browser.storage.local.set({
    classes: json_classes,
    lastSync: Date.now(),
  });
}
