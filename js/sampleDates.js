let defaultDates = [];

function loadSampleDates() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "js/sampleData.json?v=" + (typeof BUILD_NUMBER !== "undefined" ? BUILD_NUMBER : Date.now()), false);
  xhr.send();
  if (xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    defaultDates = data.dates;
  }
}

loadSampleDates();

if (!localStorage.getItem("dates")) {
  localStorage.setItem("dates", JSON.stringify(defaultDates));
}
