let categoryNameSearch = "";

function renderCategoriesEditor() {
  const list = document.getElementById("categoriesList");
  const addTile = document.getElementById("addCategoryTile");
  const topTile = document.getElementById("addCategoryTileTop");
  const filterEl = document.getElementById("categoryFilters");

  list.innerHTML = "";
  addTile.innerHTML = "";
  topTile.innerHTML = "";
  filterEl.innerHTML = "";

  const categories = loadCategories();

  const filtered = categories.filter(c => {
    if (categoryNameSearch && !c.name.toLowerCase().includes(categoryNameSearch.toLowerCase())) return false;
    return true;
  });

  const images = loadImages();

  filtered.forEach((c, index) => {
    const realIndex = categories.indexOf(c);

    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    let imageData = "";
    if (c.image) {
      const found = images.find(img => img.name === c.image);
      if (found) imageData = found.data;
    }

    card.innerHTML = `
      <div class="row align-items-center g-2">
        <div class="col-auto">
          ${imageData ? `<img src="${imageData}" class="date-img">`
                     : `<div class="text-secondary">No image</div>`}
        </div>
        <div class="col">
          <div class="row mb-2">
            <div class="col-3 text-end"><label class="form-label mb-0">Name</label></div>
            <div class="col"><input class="form-control" value="${escapeHtml(c.name)}" onchange="updateCategoryName(${realIndex}, this.value)"></div>
          </div>
          <div class="row">
            <div class="col-3 text-end"><label class="form-label mb-0">Image</label></div>
            <div class="col"><select class="form-select" onchange="updateCategoryImage(${realIndex}, this.value)">
              <option value="">-- None --</option>
              ${images.map(img => `<option value="${img.name}" ${img.name === c.image ? "selected" : ""}>${img.name}</option>`).join("")}
            </select></div>
          </div>
        </div>
        <div class="col-auto">
          <button class="btn btn-danger editor-btn" onclick="deleteCategory(${realIndex})">Delete</button>
        </div>
      </div>
    `;

    list.appendChild(card);
  });

  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-primary editor-btn btn-wide" onclick="addNewCategory()">Add Category</button>
      <button class="btn btn-success editor-btn btn-wide ms-auto" onclick="closeCategoriesEditor()">Done</button>
    </div>
  `;

  filterEl.innerHTML = `
    <div class="d-flex gap-2 align-items-center">
      <input class="form-control" type="search" placeholder="Search category names..." style="max-width:260px" value="${escapeHtml(categoryNameSearch)}" oninput="setCategoryNameSearch(this.value)">
    </div>
  `;
}

function setCategoryNameSearch(val) {
  categoryNameSearch = val;
  renderCategoriesEditor();
  const input = document.querySelector('#categoryFilters input[type="search"]');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function updateCategoryName(index, value) {
  const categories = loadCategories();
  categories[index].name = value;
  saveCategories(categories);
}

function updateCategoryImage(index, value) {
  const categories = loadCategories();
  categories[index].image = value || null;
  saveCategories(categories);
  renderCategoriesEditor();
}

function deleteCategory(index) {
  const categories = loadCategories();
  categories.splice(index, 1);
  saveCategories(categories);
  renderCategoriesEditor();
}

function addNewCategory() {
  const categories = loadCategories();
  categories.push({ name: "New Category", image: null });
  saveCategories(categories);
  categoryNameSearch = "";
  renderCategoriesEditor();
}
