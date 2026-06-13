function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const dates = loadDates();
  const rawImages = loadImages();

  // Normalise images so we always have an array
  let images = [];
  if (Array.isArray(rawImages)) {
    images = rawImages;
  } else if (rawImages && typeof rawImages === "object") {
    images = Object.values(rawImages);
  }

  dates.forEach((d, index) => {
    const img = images.find(i => i.category === d.category);
    const imgSrc = img ? img.data : "";
    const showYear = d.type === "once";

    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">
        <div class="col-auto">
          <img src="${imgSrc}" class="date-img">
        </div>
        <!-- rest of your existing innerHTML stays the same -->
    `;

    list.appendChild(card);
  });

  addTile.innerHTML = `
    <button class="btn btn-success btn-add" onclick="addNewDate()">Add Date</button>
    <button class="btn btn-primary" onclick="closeDatesEditor()">Done</button>
  `;
}


/* ---------------------------------------------------------
   UPDATE FUNCTIONS
--------------------------------------------------------- */

function updateDateName(index, value) {
  const dates = loadDates();
  dates[index].name = value;
  saveDates(dates);
}

function updateDateCategory(index, value) {
  const dates = loadDates();
  dates[index].category = value;
  saveDates(dates);
  renderDatesEditor(); // refresh to update image + layout
}

function updateDateType(index, value) {
  const dates = loadDates();
  dates[index].type = value;
  saveDates(dates);
  renderDatesEditor(); // refresh to show/hide year
}

function updateDateYear(index, value) {
  const dates = loadDates();
  dates[index].year = Number(value);
  saveDates(dates);
}

function updateDateMonth(index, value) {
  const dates = loadDates();
  dates[index].month = Number(value);
  saveDates(dates);
}

function updateDateDay(index, value) {
  const dates = loadDates();
  dates[index].day = Number(value);
  saveDates(dates);
}

function deleteDate(index) {
  const dates = loadDates();
  dates.splice(index, 1);
  saveDates(dates);
  renderDatesEditor();
}

function addNewDate() {
  const dates = loadDates();
  dates.push({
    name: "New Event",
    category: "Event",
    type: "annual",
    month: 1,
    day: 1
  });
  saveDates(dates);
  renderDatesEditor();
}
