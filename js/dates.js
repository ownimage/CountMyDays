let editingIndex = -1;
let editBuffer = null;
let isNewDate = false;
let categoryFilter = "";
let titleSearch = "";
let deletePendingIndex = -1;

function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const allDates = loadDates();
  const categories = loadCategories();
  const images = loadImages();
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const filtered = allDates
    .map((d, index) => ({ d, index }))
    .filter(({ d }) => {
      if (editingIndex >= 0) return true;
      if (categoryFilter && d.category !== categoryFilter) return false;
      if (titleSearch && !d.name.toLowerCase().includes(titleSearch.toLowerCase())) return false;
      return true;
    });

  filtered.forEach(({ d, index }) => {
    const dateData = (editingIndex === index && editBuffer) ? editBuffer : d;

    const category = dateData.category ? categories.find(c => c.name === dateData.category) : null;
    const imgSrc = (() => {
      if (!category) return "";
      const imageName = category.image || category.name;
      const image = images.find(i => i.name === imageName);
      return image ? image.data : "";
    })();
    const dateImgSrc = dateData.image ? (images.find(i => i.name === dateData.image)?.data || "") : "";

    const card = document.createElement("div");
    card.className = "card p-3 mb-3" + (index === editingIndex ? " card-edited" : "");

    if (editingIndex === index) {
      const showYear = dateData.type === "once";
      const day = dateData.day || 1;
      const month = dateData.month || 1;
      const year = dateData.year || now.getFullYear();

      let dateHtml;
      if (showYear) {
        dateHtml = `<input type="text" class="form-control flatpickr-date" data-index="${index}" data-showyear="true" placeholder="dd/mm/yyyy">`;
      } else {
        dateHtml = `
          <select class="form-select date-day-select" onchange="editBufferField('day', parseInt(this.value))">
            ${Array.from({length: 31}, (_, i) => `<option value="${i+1}" ${i+1 === day ? "selected" : ""}>${i+1}</option>`).join("")}
          </select>
          <select class="form-select date-month-select" onchange="editBufferField('month', parseInt(this.value))">
            ${months.map((m, i) => `<option value="${i+1}" ${i+1 === month ? "selected" : ""}>${m}</option>`).join("")}
          </select>`;
      }

      const catImgMap = {};
      categories.forEach(c => {
        const imageName = c.image || c.name;
        const img = images.find(i => i.name === imageName);
        catImgMap[c.name] = img ? img.data : "";
      });
      const allImgMap = {};
      images.forEach(img => { allImgMap[img.name] = img.data; });

      card.innerHTML = `
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3 d-flex gap-2">
            <div>
              ${imgSrc ? `<img src="${imgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
              <div class="dropdown mt-1">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                  ${dateData.category || "No Category"}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onclick="editBufferField('category', '')"><span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>No Category</a></li>
                  ${categories.slice().sort((a, b) => a.name.localeCompare(b.name)).map(c => `
                    <li><a class="dropdown-item" href="#" onclick="editBufferField('category', '${escapeHtml(c.name)}')">
                      ${catImgMap[c.name] ? `<img src="${catImgMap[c.name]}" style="width:16px;height:16px;object-fit:contain;margin-right:6px">` : `<span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>`}
                      ${escapeHtml(c.name)}
                    </a></li>
                  `).join("")}
                </ul>
              </div>
            </div>
            <div>
              ${dateImgSrc ? `<img src="${dateImgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
              <div class="dropdown mt-1">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                  ${dateData.image || "None"}
                </button>
                <ul class="dropdown-menu">
                  <li><a class="dropdown-item" href="#" onclick="editBufferField('image', '');renderDatesEditor()"><span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>None</a></li>
                  ${images.slice().sort((a, b) => a.name.localeCompare(b.name)).map(img => `
                    <li><a class="dropdown-item" href="#" onclick="editBufferField('image', '${escapeHtml(img.name)}');renderDatesEditor()">
                      ${allImgMap[img.name] ? `<img src="${allImgMap[img.name]}" style="width:16px;height:16px;object-fit:contain;margin-right:6px">` : `<span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>`}
                      ${escapeHtml(img.name)}
                    </a></li>
                  `).join("")}
                </ul>
              </div>
            </div>
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="mb-2">
              <input class="form-control" value="${escapeHtml(dateData.name || "")}" oninput="editBufferField('name', this.value)">
            </div>
            <div class="d-flex mb-1">
              <div class="d-flex flex-nowrap gap-1 flex-fill">${dateHtml}</div>
              <select class="form-select ms-3 type-select" onchange="editBufferField('type', this.value)">
                <option value="annual" ${dateData.type === "annual" ? "selected" : ""}>Annual</option>
                <option value="once" ${dateData.type === "once" ? "selected" : ""}>Once</option>
              </select>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-success editor-btn" onclick="doneEditing()">OK</button>
              <button class="btn btn-secondary editor-btn ms-auto" onclick="cancelEditing()">Cancel</button>
            </div>
          </div>
        </div>
      `;

      list.appendChild(card);
    } else {
      const showYear = dateData.type === "once";
      const day = dateData.day || 1;
      const month = dateData.month || 1;
      const year = dateData.year || now.getFullYear();
      const dateStr = showYear ? `${day} ${months[month-1]} ${year}` : `${day} ${months[month-1]}`;

      card.innerHTML = `
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3 d-flex gap-2">
            <div>
              ${imgSrc ? `<img src="${imgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
              ${dateData.category ? `<div class="mt-1">${escapeHtml(dateData.category)}</div>` : ""}
            </div>
            <div>
              ${dateImgSrc ? `<img src="${dateImgSrc}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
            </div>
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="fw-bold editor-title mb-2">${escapeHtml(dateData.name)}</div>
            <div class="d-flex mb-1">
              <span>${dateStr}</span>
              <span class="ms-3">${dateData.type === "annual" ? "Annual" : "Once"}</span>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary editor-btn" onclick="editDate(${index})" ${editingIndex >= 0 ? 'disabled' : ''}>Edit</button>
              <button class="btn btn-danger editor-btn ms-auto" onclick="confirmDeleteDate(${index})" ${editingIndex >= 0 ? 'disabled' : ''}>Delete</button>
            </div>
          </div>
        </div>
      `;

      list.appendChild(card);
    }
  });

  renderEditorFilters(allDates);

  const topTile = document.getElementById("addDateTileTop");
  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-primary editor-btn btn-wide" onclick="addNewDate()" ${editingIndex >= 0 ? 'disabled' : ''}>Add Date</button>
      <button class="btn btn-success editor-btn btn-wide ms-auto" onclick="closeDatesEditor()" ${editingIndex >= 0 ? 'disabled' : ''}>Done</button>
    </div>
  `;

  addTile.innerHTML = "";

  if (editingIndex >= 0) {
    initSingleFlatpickr(editingIndex);
  }
  updateNavState();
}

function renderEditorFilters(allDates) {
  const el = document.getElementById("editorFilters");
  if (!el) return;
  if (editingIndex >= 0) {
    el.classList.add("d-none");
    return;
  }
  el.classList.remove("d-none");
  const cats = loadCategories().map(c => c.name).filter(Boolean);
  el.innerHTML = `
    <div class="d-flex gap-2 align-items-center">
      <select class="form-select" style="width:auto;min-width:160px" onchange="setCategoryFilter(this.value)">
        <option value="">All</option>
        ${cats.map(c => `<option value="${c}" ${categoryFilter === c ? 'selected' : ''}>${c}</option>`).join("")}
      </select>
      <input class="form-control" type="search" placeholder="Search titles..." value="${escapeHtml(titleSearch)}" oninput="setTitleSearch(this.value)">
      <button class="btn btn-outline-secondary btn-sm" onclick="categoryFilter='';titleSearch='';renderDatesEditor()">Clear</button>
    </div>
  `;
}

function setCategoryFilter(val) {
  categoryFilter = val;
  renderDatesEditor();
}

function setTitleSearch(val) {
  titleSearch = val;
  renderDatesEditor();
  const input = document.querySelector('#editorFilters input[type="search"]');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function editDate(index) {
  const dates = loadDates();
  editBuffer = JSON.parse(JSON.stringify(dates[index]));
  editingIndex = index;
  isNewDate = false;
  renderDatesEditor();
}

function cancelEditing() {
  if (isNewDate) {
    const dates = loadDates();
    dates.splice(editingIndex, 1);
    saveDates(dates);
  }
  editingIndex = -1;
  editBuffer = null;
  isNewDate = false;
  renderDatesEditor();
}

function doneEditing() {
  if (editingIndex >= 0 && editBuffer) {
    const dates = loadDates();
    dates[editingIndex] = editBuffer;
    saveDates(dates);
  }
  editingIndex = -1;
  editBuffer = null;
  isNewDate = false;
  renderDatesEditor();
}

function editBufferField(field, value) {
  if (!editBuffer) return;
  editBuffer[field] = value;
  if (field === "type") {
    if (value === "annual") {
      delete editBuffer.year;
    } else {
      editBuffer.year = new Date().getFullYear();
    }
    renderDatesEditor();
  }
  if (field === "category" || field === "image") {
    renderDatesEditor();
  }
}

function initSingleFlatpickr(index) {
  if (typeof flatpickr === 'undefined') return;
  const input = document.querySelector(`.flatpickr-date[data-index="${index}"]`);
  if (!input) return;
  const showYear = input.dataset.showyear === 'true';
  if (!editBuffer) return;
  const day = editBuffer.day || 1;
  const month = editBuffer.month || 1;
  const year = editBuffer.year || new Date().getFullYear();
  const defaultDate = new Date(year, month - 1, day);

  flatpickr(input, {
    dateFormat: showYear ? 'd/m/Y' : 'd/m',
    defaultDate: defaultDate,
    allowInput: true,
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length > 0 && editBuffer) {
        const sel = selectedDates[0];
        editBuffer.day = sel.getDate();
        editBuffer.month = sel.getMonth() + 1;
        if (showYear) {
          editBuffer.year = sel.getFullYear();
        }
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
  deletePendingIndex = index;
  const modalEl = document.getElementById("deleteConfirmModal");
  document.getElementById("deleteConfirmBtn").onclick = function() {
    doDelete(deletePendingIndex);
    bootstrap.Modal.getInstance(modalEl).hide();
  };
  new bootstrap.Modal(modalEl).show();
}

function doDelete(index) {
  if (editingIndex === index) {
    editingIndex = -1;
    editBuffer = null;
    isNewDate = false;
  }
  const dates = loadDates();
  dates.splice(index, 1);
  saveDates(dates);
  renderDatesEditor();
}

function addNewDate() {
  const dates = loadDates();
  const categories = loadCategories();
  const newDate = {
    name: "New Event",
    category: categories.length > 0 ? categories[0].name : "",
    image: "",
    type: "annual",
    month: 1,
    day: 1
  };
  dates.push(newDate);
  saveDates(dates);
  categoryFilter = "";
  titleSearch = "";
  editBuffer = JSON.parse(JSON.stringify(newDate));
  editingIndex = dates.length - 1;
  isNewDate = true;
  renderDatesEditor();
  const cards = document.querySelectorAll("#editorList .card");
  const lastCard = cards[cards.length - 1];
  if (lastCard) lastCard.scrollIntoView({ behavior: "smooth", block: "center" });
}
