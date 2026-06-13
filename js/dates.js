function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const dates = loadDates();
  const images = loadImages();

  dates.forEach((d, index) => {
    const item = document.createElement("div");
    item.className = "date-item";

    const img = images.find(i => i.category === d.category);
    const imgSrc = img ? img.data : "";

    item.innerHTML = `
      <div class="date-image">
        <img src="${imgSrc}" class="date-thumb">
      </div>

      <input class="edit-name" value="${d.name}"
             onchange="updateDateName(${index}, this.value)">

      <select class="edit-category" onchange="updateDateCategory(${index}, this.value)">
        ${getAllCategories().map(c => `
          <option value="${c}" ${c === d.category ? "selected" : ""}>${c}</option>
        `).join("")}
      </select>

      <select class="edit-type" onchange="updateDateType(${index}, this.value)">
        <option value="annual" ${d.type === "annual" ? "selected" : ""}>Annual</option>
        <option value="once" ${d.type === "once" ? "selected" : ""}>Once</option>
      </select>

      <input type="number" class="edit-year" value="${d.year || ""}"
             onchange="updateDateYear(${index}, this.value)">
      <input type="number" class="edit-month" value="${d.month}"
             onchange="updateDateMonth(${index}, this.value)">
      <input type="number" class="edit-day" value="${d.day}"
             onchange="updateDateDay(${index}, this.value)}">

      <button class="btn btn-delete" onclick="deleteDate(${index})">Delete</button>
    `;

    list.appendChild(item);
  });

  addTile.innerHTML = `
    <button class="btn btn-add" onclick="addNewDate()">Add Date</button>
  `;
}

/* -------------------------
   UPDATE FUNCTIONS
------------------------- */

function updateDateName(index, value) {
  const dates = loadDates();
  dates[index].name = value;
  saveDates(dates);
}

function updateDateCategory(index, value) {
  const dates = loadDates();
  dates[index].category = value;
  saveDates(dates);
  renderDatesEditor(); // refresh to update image
}

function updateDateType(index, value) {
  const dates = loadDates();
  dates[index].type = value;
  saveDates(dates);
  renderDatesEditor();
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
