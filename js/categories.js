/* -------------------------
   CATEGORIES EDITOR
------------------------- */

function renderCategoriesEditor() {
  const container = document.getElementById("categoryListContainer");
  const addTile = document.getElementById("addCategoryTile");

  container.innerHTML = "";
  addTile.innerHTML = "";

  const categories = getAllCategories();

  /* -------------------------
     RENDER CATEGORY LIST
  ------------------------- */

  categories.forEach((cat, index) => {
    const row = document.createElement("div");
    row.className = "category-item";

    const safeId = `cat_${index}`;

    row.innerHTML = `
      <div class="field-row">
        <label>Name:</label>
        <input id="${safeId}" type="text" value="${cat}">
      </div>

      <div class="editor-buttons">
        <button class="btn btn-save btn-disabled" id="${safeId}_save" onclick="saveCategory('${safeId}', '${cat}')" disabled>Save</button>
        <button class="btn btn-delete" onclick="deleteCategory('${cat}')">Delete</button>
      </div>
    `;

    container.appendChild(row);

    /* Enable save button only when changed */
    const input = document.getElementById(safeId);
    const saveBtn = document.getElementById(`${safeId}_save`);

    input.addEventListener("input", () => {
      if (input.value.trim() !== cat) {
        saveBtn.classList.remove("btn-disabled");
        saveBtn.disabled = false;
      } else {
        saveBtn.classList.add("btn-disabled");
        saveBtn.disabled = true;
      }
    });
  });

  /* -------------------------
     ADD CATEGORY TILE
  ------------------------- */

  const add = document.createElement("div");
  add.className = "add-item";

  add.innerHTML = `
    <h3>Add Category</h3>

    <div class="field-row">
      <label>Name:</label>
      <input id="newCategoryName" type="text">
    </div>

    <button class="btn btn-add" onclick="addCategory()">Add Category</button>
  `;

  addTile.appendChild(add);
}

/* -------------------------
   ADD CATEGORY
------------------------- */

function addCategory() {
  const name = document.getElementById("newCategoryName").value.trim();
  if (!name) {
    alert("Please enter a category name");
    return;
  }

  const categories = getAllCategories();
  if (categories.includes(name)) {
    alert("Category already exists");
    return;
  }

  // No need to store categories separately — they are derived from events
  // But we add a dummy event to force category existence? No.
  // Instead: categories come from defaultCategories + event categories.
  // So we simply add it to defaultCategories.
  defaultCategories.push(name);

  renderCategoriesEditor();
}

/* -------------------------
   SAVE (RENAME) CATEGORY
------------------------- */

function saveCategory(inputId, oldName) {
  const newName = document.getElementById(inputId).value.trim();
  if (!newName) {
    alert("Category name cannot be empty");
    return;
  }

  const dates = loadDates();

  // Update all events using this category
  dates.forEach(event => {
    if (event.category === oldName) {
      event.category = newName;
    }
  });

  saveDates(dates);

  // Update default categories
  const idx = defaultCategories.indexOf(oldName);
  if (idx !== -1) defaultCategories[idx] = newName;

  renderCategoriesEditor();
}

/* -------------------------
   DELETE CATEGORY
------------------------- */

function deleteCategory(name) {
  if (!confirm(`Delete category "${name}"?\nEvents using this category will be set to "Event".`)) {
    return;
  }

  const dates = loadDates();

  dates.forEach(event => {
    if (event.category === name) {
      event.category = "Event"; // fallback category
    }
  });

  saveDates(dates);

  // Remove from default categories
  const idx = defaultCategories.indexOf(name);
  if (idx !== -1) defaultCategories.splice(idx, 1);

  renderCategoriesEditor();
}
