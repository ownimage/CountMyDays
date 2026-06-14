function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const dates = loadDates();
  const categories = loadCategories();
  const images = loadImages();

  dates.forEach((d, index) => {
    const category = categories.find(c => c.name === d.category);
    const imageName = category ? category.image : null;
    const image = images.find(i => i.name === imageName);
    const imgSrc = image ? image.data : "";

    const showYear = d.type === "once";

    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">

        <div class="col-auto">
          ${imgSrc ? `<img src="${imgSrc}" class="date-img">`
                   : `<div class="text-secondary">No image</div>`}
        </div>

        <div class="col-4">
          <label class="form-label">Title</label>
          <input class="form-control"
                 value="${d.name || ""}"
                 onchange="updateDateField(${index}, 'name', this.value)">

          <label class="form-label mt-2">Category</label>
          <select class="form-select"
                  onchange="updateDateField(${index}, 'category', this.value)">
            ${categories.map(c => `
              <option value="${c.name}" ${c.name === d.category ? "selected" : ""}>
                ${c.name}
              </option>
            `).join("")}
          </select>

          <label class="form-label mt-2">Type</label>
          <select class="form-select"
                  onchange="updateDateField(${index}, 'type', this.value)">
            <option value="annual" ${d.type === "annual" ? "selected" : ""}>Annual</option>
            <option value="once" ${d.type === "once" ? "selected" : ""}>Once</option>
          </select>
        </div>

        <div class="col-4">
          <label class="form-label">Day</label>
          <input type="number" min="1" max="31"
                 class="form-control"
                 value="${d.day || ""}"
                 onchange="updateDateField(${index}, 'day', Number(this.value))">

          <label class="form-label mt-2">Month</label>
          <input type="number" min="1" max="12"
                 class="form-control"
                 value="${d.month || ""}"
                 onchange="updateDateField(${index}, 'month', Number(this.value))">

          ${showYear ? `
            <label class="form-label mt-2">Year</label>
            <input type="number"
                   class="form-control"
                   value="${d.year || ""}"
                   onchange="updateDateField(${index}, 'year', Number(this.value))">
          ` : ""}
        </div>

        <div class="col-auto">
          <button class="btn btn-danger" onclick="deleteDate(${index})">Delete</button>
        </div>

      </div>
    `;

    list.appendChild(card);
  });

  addTile.innerHTML = `
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-success" onclick="addNewDate()">Add Date</button>
      <button class="btn btn-primary" onclick="closeDatesEditor()">Done</button>
    </div>
  `;
}

function updateDateField(index, field, value) {
  const dates = loadDates();
  dates[index][field] = value;
  saveDates(dates);
  renderDatesEditor(); // refresh image when category changes
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
    category: "",   // user must choose
    type: "annual",
    month: 1,
    day: 1
  });
  saveDates(dates);
  renderDatesEditor();
}
