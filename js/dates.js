let flatpickrInstances = [];

function destroyDatePickers() {
  flatpickrInstances.forEach(fp => fp.destroy());
  flatpickrInstances = [];
}

function renderDatesEditor() {
  destroyDatePickers();

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

    const day = d.day || 1;
    const month = d.month || 1;
    const year = d.year || new Date().getFullYear();

    let dateHtml = `
      <input type="text" class="form-control flatpickr-date"
             data-index="${index}"
             data-showyear="${showYear}"
             placeholder="${showYear ? 'dd/mm/yyyy' : 'dd/mm'}">`;

    card.innerHTML = `
      <div class="row align-items-center g-2">

        <div class="col-auto">
          ${imgSrc ? `<img src="${imgSrc}" class="date-img">`
                   : `<div class="text-secondary">No image</div>`}
        </div>

        <div class="col">
          <div class="row mb-2">
            <div class="col-3 text-end"><label class="form-label mb-0">Title</label></div>
            <div class="col"><input class="form-control" value="${d.name || ""}" onchange="updateDateField(${index}, 'name', this.value)"></div>
          </div>
          <div class="row">
            <div class="col-3 text-end"><label class="form-label mb-0">Category</label></div>
            <div class="col"><select class="form-select" onchange="updateDateField(${index}, 'category', this.value)">${categories.map(c => `<option value="${c.name}" ${c.name === d.category ? "selected" : ""}>${c.name}</option>`).join("")}</select></div>
          </div>
        </div>

        <div class="col-auto">
          <div class="d-flex align-items-center gap-2">
            <label class="form-label mb-0 text-nowrap">Type</label>
            <select class="form-select type-select"
                    onchange="updateDateField(${index}, 'type', this.value)">
              <option value="annual" ${d.type === "annual" ? "selected" : ""}>Annual</option>
              <option value="once" ${d.type === "once" ? "selected" : ""}>Once</option>
            </select>
            <label class="form-label mb-0 text-nowrap ms-2">Date</label>
            ${dateHtml}
          </div>
        </div>

        <div class="col-auto">
          <button class="btn btn-danger" onclick="deleteDate(${index})">Delete</button>
        </div>

      </div>
    `;

    list.appendChild(card);
  });

  initFlatpickrDates();

  const topTile = document.getElementById("addDateTileTop");
  topTile.innerHTML = `
    <button class="btn btn-success" onclick="addNewDate()">Add Date</button>
    <button class="btn btn-primary" onclick="closeDatesEditor()">Done</button>
  `;

  addTile.innerHTML = `
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-success" onclick="addNewDate()">Add Date</button>
      <button class="btn btn-primary" onclick="closeDatesEditor()">Done</button>
    </div>
  `;
}

function initFlatpickrDates() {
  if (typeof flatpickr === 'undefined') return;
  document.querySelectorAll('.flatpickr-date').forEach(input => {
    const showYear = input.dataset.showyear === 'true';
    const dates = loadDates();
    const idx = parseInt(input.dataset.index);
    const d = dates[idx];
    if (!d) return;
    const day = d.day || 1;
    const month = d.month || 1;
    const year = d.year || new Date().getFullYear();
    const defaultDate = new Date(year, month - 1, day);

    const fp = flatpickr(input, {
      dateFormat: showYear ? 'd/m/Y' : 'd/m',
      defaultDate: defaultDate,
      allowInput: true,
      onChange: function(selectedDates, dateStr, instance) {
        if (selectedDates.length > 0) {
          const sel = selectedDates[0];
          const index = parseInt(instance.element.dataset.index);
          const dates = loadDates();
          dates[index].day = sel.getDate();
          dates[index].month = sel.getMonth() + 1;
          if (showYear) {
            dates[index].year = sel.getFullYear();
          }
          saveDates(dates);
        }
      }
    });
    flatpickrInstances.push(fp);
  });
}

function updateDateField(index, field, value) {
  const dates = loadDates();
  dates[index][field] = value;
  saveDates(dates);
  renderDatesEditor();
}

function updateDateFieldSilent(index, field, value) {
  const dates = loadDates();
  dates[index][field] = value;
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
    category: "",   // user must choose
    type: "annual",
    month: 1,
    day: 1
  });
  saveDates(dates);
  renderDatesEditor();
}
