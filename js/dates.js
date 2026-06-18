let editingIndex = -1;

function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const dates = loadDates();
  const categories = loadCategories();
  const images = loadImages();
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  dates.forEach((d, index) => {
    const category = categories.find(c => c.name === d.category) || categories[0];
    let imageName = category ? category.image : null;
    if (category && !imageName) {
      imageName = category.name;
    }
    const image = images.find(i => i.name === imageName);
    const imgSrc = image ? image.data : "";

    const card = document.createElement("div");
    card.className = "card p-3 mb-3" + (index === editingIndex ? " card-edited" : "");

    if (editingIndex === index) {
      const showYear = d.type === "once";
      const day = d.day || 1;
      const month = d.month || 1;
      const year = d.year || now.getFullYear();

      let dateHtml;
      if (showYear) {
        dateHtml = `<input type="text" class="form-control flatpickr-date" data-index="${index}" data-showyear="true" placeholder="dd/mm/yyyy">`;
      } else {
        dateHtml = `
          <select class="form-select date-day-select" onchange="updateDateField(${index}, 'day', parseInt(this.value))">
            ${Array.from({length: 31}, (_, i) => `<option value="${i+1}" ${i+1 === day ? "selected" : ""}>${i+1}</option>`).join("")}
          </select>
          <select class="form-select date-month-select" onchange="updateDateField(${index}, 'month', parseInt(this.value))">
            ${months.map((m, i) => `<option value="${i+1}" ${i+1 === month ? "selected" : ""}>${m}</option>`).join("")}
          </select>`;
      }

      card.innerHTML = `
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3">
            ${imgSrc ? `<img src="${imgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
            <select class="form-select mt-1" onchange="updateDateField(${index}, 'category', this.value)">${categories.map(c => `<option value="${c.name}" ${c.name === (d.category || (categories[0] ? categories[0].name : "")) ? "selected" : ""}>${c.name}</option>`).join("")}</select>
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="mb-2">
              <input class="form-control" value="${escapeHtml(d.name || "")}" oninput="updateDateField(${index}, 'name', this.value)">
            </div>
            <div class="d-flex mb-1">
              <div class="d-flex flex-nowrap gap-1 flex-fill">${dateHtml}</div>
              <select class="form-select ms-3 type-select" onchange="updateDateField(${index}, 'type', this.value)">
                <option value="annual" ${d.type === "annual" ? "selected" : ""}>Annual</option>
                <option value="once" ${d.type === "once" ? "selected" : ""}>Once</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary editor-btn" onclick="doneEditing()">OK</button>
              <button class="btn btn-secondary editor-btn ms-auto" onclick="cancelEditing()">Cancel</button>
            </div>
          </div>
        </div>
      `;

      list.appendChild(card);
    } else {
      const showYear = d.type === "once";
      const day = d.day || 1;
      const month = d.month || 1;
      const year = d.year || now.getFullYear();
      const dateStr = showYear ? `${day} ${months[month-1]} ${year}` : `${day} ${months[month-1]}`;

      card.innerHTML = `
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3">
            ${imgSrc ? `<img src="${imgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
            <div class="mt-1">${escapeHtml(d.category)}</div>
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="fw-bold editor-title mb-2">${escapeHtml(d.name)}</div>
            <div class="d-flex mb-1">
              <span>${dateStr}</span>
              <span class="ms-3">${d.type === "annual" ? "Annual" : "Once"}</span>
            </div>
            <div class="d-flex gap-2">
              ${editingIndex >= 0 ? '' : `<button class="btn btn-primary editor-btn" onclick="editDate(${index})">Edit</button>`}
              <button class="btn btn-danger editor-btn ${editingIndex >= 0 ? '' : 'ms-auto'}" onclick="confirmDeleteDate(${index})">Delete</button>
            </div>
          </div>
        </div>
      `;

      list.appendChild(card);
    }
  });

  const topTile = document.getElementById("addDateTileTop");
  topTile.innerHTML = `
    <button class="btn btn-success editor-btn" onclick="addNewDate()">Add Date</button>
    <button class="btn btn-primary editor-btn" onclick="closeDatesEditor()">Done</button>
  `;

  addTile.innerHTML = `
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-success editor-btn" onclick="addNewDate()">Add Date</button>
      <button class="btn btn-primary editor-btn" onclick="closeDatesEditor()">Done</button>
    </div>
  `;

  if (editingIndex >= 0) {
    initSingleFlatpickr(editingIndex);
  }
}

function editDate(index) {
  editingIndex = index;
  renderDatesEditor();
}

function cancelEditing() {
  editingIndex = -1;
  renderDatesEditor();
}

function doneEditing() {
  editingIndex = -1;
  renderDatesEditor();
}

function initSingleFlatpickr(index) {
  if (typeof flatpickr === 'undefined') return;
  const input = document.querySelector(`.flatpickr-date[data-index="${index}"]`);
  if (!input) return;
  const showYear = input.dataset.showyear === 'true';
  const dates = loadDates();
  const d = dates[index];
  if (!d) return;
  const day = d.day || 1;
  const month = d.month || 1;
  const year = d.year || new Date().getFullYear();
  const defaultDate = new Date(year, month - 1, day);

  flatpickr(input, {
    dateFormat: showYear ? 'd/m/Y' : 'd/m',
    defaultDate: defaultDate,
    allowInput: true,
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length > 0) {
        const sel = selectedDates[0];
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
}

function updateDateField(index, field, value) {
  const dates = loadDates();
  dates[index][field] = value;
  if (field === "type") {
    if (value === "annual") {
      delete dates[index].year;
    } else {
      dates[index].year = new Date().getFullYear();
    }
  }
  saveDates(dates);
  if (field === "type" || field === "category") {
    renderDatesEditor();
  }
}

function confirmDeleteDate(index) {
  if (confirm("Delete this date?")) {
    if (editingIndex === index) editingIndex = -1;
    const dates = loadDates();
    dates.splice(index, 1);
    saveDates(dates);
    renderDatesEditor();
  }
}

function addNewDate() {
  const dates = loadDates();
  const categories = loadCategories();
  dates.push({
    name: "New Event",
    category: categories.length > 0 ? categories[0].name : "",
    type: "annual",
    month: 1,
    day: 1
  });
  saveDates(dates);
  editingIndex = dates.length - 1;
  renderDatesEditor();
}
