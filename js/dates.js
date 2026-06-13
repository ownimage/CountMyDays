/* -------------------------
   DATES EDITOR
------------------------- */

function renderDatesEditor() {
  const list = document.getElementById("editorList");
  const addTile = document.getElementById("addDateTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const dates = loadDates();
  const categories = getAllCategories();

  /* -------------------------
     RENDER EXISTING DATES
  ------------------------- */

  dates.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "editor-item";

    const label = item.type === "annual"
      ? `${item.name} — ${item.category} — ${item.month}/${item.day} — annual`
      : `${item.name} — ${item.category} — ${item.year}/${item.month}/${item.day} — once`;

    row.innerHTML = `
      <div class="editor-name">${label}</div>

      <div class="editor-buttons">
        <button class="btn btn-edit" onclick="editDate(${index})">Edit</button>
        <button class="btn btn-delete" onclick="deleteDate(${index})">Delete</button>
      </div>

      <div id="editFields${index}" style="display:none; margin-top:10px;">

        <div class="field-row">
          <label>Name:</label>
          <input id="editName${index}" type="text" value="${item.name}">
        </div>

        <div class="field-row">
          <label>Category:</label>
          <input id="editCategory${index}" list="categoryList" value="${item.category}">
        </div>

        <div class="field-row">
          <label>Type:</label>
          <select id="editType${index}" onchange="updateEditTypeUI(${index})">
            <option value="annual" ${item.type === "annual" ? "selected" : ""}>Annual</option>
            <option value="once" ${item.type === "once" ? "selected" : ""}>One-off</option>
          </select>
        </div>

        <div id="editYearRow${index}" class="field-row" style="display:${item.type === "once" ? "flex" : "none"};">
          <label>Year:</label>
          <input id="editYear${index}" type="number" value="${item.year || ""}">
        </div>

        <div class="field-row">
          <label>Month:</label>
          <input id="editMonth${index}" type="number" value="${item.month}">
        </div>

        <div class="field-row">
          <label>Day:</label>
          <input id="editDay${index}" type="number" value="${item.day}">
        </div>

        <div class="editor-buttons">
          <button class="btn btn-save" onclick="saveDateEdit(${index})">Save</button>
          <button class="btn btn-cancel" onclick="cancelDateEdit(${index})">Cancel</button>
        </div>
      </div>
    `;

    list.appendChild(row);
  });

  /* -------------------------
     ADD NEW DATE TILE
  ------------------------- */

  const add = document.createElement("div");
  add.className = "add-item";

  add.innerHTML = `
    <h3>Add New Event</h3>

    <div class="field-row">
      <label>Name:</label>
      <input id="newName" type="text">
    </div>

    <div class="field-row">
      <label>Category:</label>
      <input id="newCategory" list="categoryList">
    </div>

    <datalist id="categoryList">
      ${categories.map(c => `<option value="${c}"></option>`).join("")}
    </datalist>

    <div class="field-row">
      <label>Type:</label>
      <select id="newType" onchange="updateNewTypeUI()">
        <option value="annual">Annual</option>
        <option value="once">One-off</option>
      </select>
    </div>

    <div id="newYearRow" class="field-row" style="display:none;">
      <label>Year:</label>
      <input id="newYear" type="number" min="1900" max="3000">
    </div>

    <div class="field-row">
      <label>Month:</label>
      <input id="newMonth" type="number" min="1" max="12">
    </div>

    <div class="field-row">
      <label>Day:</label>
      <input id="newDay" type="number" min="1" max="31">
    </div>

    <button class="btn btn-add" onclick="addDate()">Add Event</button>
  `;

  addTile.appendChild(add);
}

/* -------------------------
   EDIT EXISTING DATE
------------------------- */

function editDate(index) {
  document.getElementById(`editFields${index}`).style.display = "block";
}

function cancelDateEdit(index) {
  document.getElementById(`editFields${index}`).style.display = "none";
}

function updateEditTypeUI(index) {
  const type = document.getElementById(`editType${index}`).value;
  document.getElementById(`editYearRow${index}`).style.display =
    type === "once" ? "flex" : "none";
}

function saveDateEdit(index) {
  const dates = loadDates();

  const name = document.getElementById(`editName${index}`).value.trim();
  const category = document.getElementById(`editCategory${index}`).value.trim();
  const type = document.getElementById(`editType${index}`).value;
  const month = parseInt(document.getElementById(`editMonth${index}`).value);
  const day = parseInt(document.getElementById(`editDay${index}`).value);

  if (!name || !category || !month || !day) {
    alert("Please fill all fields");
    return;
  }

  if (type === "annual") {
    dates[index] = { name, category, month, day, type };
  } else {
    const year = parseInt(document.getElementById(`editYear${index}`).value);
    if (!year) {
      alert("Please enter a year for one-off events");
      return;
    }
    dates[index] = { name, category, year, month, day, type };
  }

  saveDates(dates);
  renderDatesEditor();
}

/* -------------------------
   DELETE DATE
------------------------- */

function deleteDate(index) {
  const dates = loadDates();
  dates.splice(index, 1);
  saveDates(dates);
  renderDatesEditor();
}

/* -------------------------
   ADD NEW DATE
------------------------- */

function updateNewTypeUI() {
  const type = document.getElementById("newType").value;
  document.getElementById("newYearRow").style.display =
    type === "once" ? "flex" : "none";
}

function addDate() {
  const name = document.getElementById("newName").value.trim();
  const category = document.getElementById("newCategory").value.trim();
  const type = document.getElementById("newType").value;
  const month = parseInt(document.getElementById("newMonth").value);
  const day = parseInt(document.getElementById("newDay").value);

  if (!name || !category || !month || !day) {
    alert("Please fill all fields");
    return;
  }

  let newItem;

  if (type === "annual") {
    newItem = { name, category, month, day, type };
  } else {
    const year = parseInt(document.getElementById("newYear").value);
    if (!year) {
      alert("Please enter a year for one-off events");
      return;
    }
    newItem = { name, category, year, month, day, type };
  }

  const dates = loadDates();
  dates.push(newItem);
  saveDates(dates);

  renderDatesEditor();
}
