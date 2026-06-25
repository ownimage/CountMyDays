let defaultCategories = [];

function loadSampleCategories() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "js/sampleData.json?v=" + (typeof BUILD_NUMBER !== "undefined" ? BUILD_NUMBER : Date.now()), false);
  xhr.send();
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    defaultCategories = data.categories;
  }
}

loadSampleCategories();

if (!localStorage.getItem("categories")) {
  localStorage.setItem("categories", JSON.stringify(defaultCategories));
}
