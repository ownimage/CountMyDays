let defaultImages = [];

function loadSampleImages() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "js/sampleData.json?v=" + (typeof BUILD_NUMBER !== "undefined" ? BUILD_NUMBER : Date.now()), false);
  xhr.send();
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    defaultImages = data.images;
  }
}

loadSampleImages();

if (!localStorage.getItem("images")) {
  localStorage.setItem("images", JSON.stringify(defaultImages));
}
