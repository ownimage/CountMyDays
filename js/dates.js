function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const dates = loadDates();
  const images = loadImages();

  dates.forEach((d, index) => {
    const item = document.createElement("div");
    item.className = "date-tile";

    const img = images.find(i => i.category === d.category);
    const imgSrc = img ? img.data : "";

    const showYear = d.type === "once";

    item.innerHTML = `
      <!-- LEFT COLUMN: IMAGE -->
      <div class="date-tile-left">
        <img src="${imgSrc}">
      </div>

      <!-- COLUMN 1: TITLE / CATEGORY / TYPE -->
      <div class="date-col-1">

        <label>Title</label>
        <input value="${d.name}"
               onchange="updateDateName(${index}, this.value)">

        <label>Category</label>
        <select onchange="updateDateCategory(${index}, this.value)">
          ${getAllCategories().map(c => `
            <option value="${c}" ${c === d.category ? "selected" : ""}>${c}</option>
          `).join("")}
        </select>

        <label>Type</label>
        <select onchange="updateDateType(${index}, this.value)">
          <option value="annual" ${d.type === "annual" ? "selected" : ""}>Annual</option>
          <option value="once" ${d.type === "once" ? "selected" : ""}>Once</option>
        </select>

      </div>

      <!-- COLUMN 2: DAY / MONTH / YEAR -->
      <div class="date-col-2">

        <div>
          <label>Day</label>
          <input type="number"
                 value="${d.day}"
                 onchange="updateDateDay(${index}, this.value)">
        </div>

        <div>
          <label>Month</label>
          <input type="number"
                 value="${d.month}"
                 onchange="updateDateMonth(${index}, this.value)">
        </div>

        <div style="${showYear ? "" : "display:none;"}">
          <label>Year</label>
          <input type="number"
                 value="${d.year || ""}"
                 onchange="updateDateYear(${index}, this.value)">
        </div>

      </div>

      <!-- COLUMN 3: DELETE BUTTON -->
      <div class="date-col-3">
        <button class="btn-delete" onclick="deleteDate(${index})">Delete</button>
      </div>
    `;

    list.appendChild(item);
  });

  // Add Date + Done buttons
  addTile.innerHTML = `
    <button class="btn btn-add" onclick="addNewDate()">Add Date</button>
    <button class="btn btn-done" onclick="closeDatesEditor()">Done</button>
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
