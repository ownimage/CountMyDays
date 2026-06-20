let categoryNameSearch = "";
let editingCategoryIndex = -1;
let editCategoryBuffer = null;
let isNewCategory = false;

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
  const images = loadImages();

  const filtered = categories.filter(c => {
    if (editingCategoryIndex >= 0) return true;
    if (categoryNameSearch && !c.name.toLowerCase().includes(categoryNameSearch.toLowerCase())) return false;
    return true;
  }).sort((a, b) => a.name.localeCompare(b.name));

  filtered.forEach((c, index) => {
    const realIndex = categories.indexOf(c);
    const catData = (editingCategoryIndex === realIndex && editCategoryBuffer) ? editCategoryBuffer : c;

    const card = document.createElement("div");
    card.className = "card p-3 mb-3" + (realIndex === editingCategoryIndex ? " card-edited" : "");

    let imageData = "";
    if (catData.image) {
      const found = images.find(img => img.name === catData.image);
      if (found) imageData = found.data;
    }

    if (editingCategoryIndex === realIndex) {
      const imgPreviewMap = {};
      images.forEach(img => { imgPreviewMap[img.name] = img.data; });

      card.innerHTML = `
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3">
            ${imageData ? `<img src="${imageData}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
            <div class="dropdown mt-1">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle w-100" type="button" data-bs-toggle="dropdown">
                ${catData.image || "None"}
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" onclick="editCategoryBufferField('image', '');renderCategoriesEditor()"><span style="display:inline-block;width:16px;height:16px;margin-right:6px"></span>None</a></li>
                ${images.map(img => `
                  <li><a class="dropdown-item" href="#" onclick="editCategoryBufferField('image', '${escapeHtml(img.name)}');renderCategoriesEditor()">
                    <img src="${imgPreviewMap[img.name]}" style="width:16px;height:16px;object-fit:contain;margin-right:6px">
                    ${escapeHtml(img.name)}
                  </a></li>
                `).join("")}
              </ul>
            </div>
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="mb-2">
              <input class="form-control" value="${escapeHtml(catData.name || "")}" oninput="editCategoryBufferField('name', this.value); checkDuplicateCategoryName()" onchange="editCategoryBufferField('name', this.value); checkDuplicateCategoryName()">
              <div id="categoryNameError" class="text-danger mt-1" style="display:none">ERROR: There is already a category with this name.</div>
            </div>
            <div class="d-flex gap-2">
              <button class="btn btn-success editor-btn" onclick="doneCategoryEditing()">OK</button>
              <button class="btn btn-secondary editor-btn ms-auto" onclick="cancelCategoryEditing()">Cancel</button>
            </div>
          </div>
        </div>
      `;
    } else {
      card.innerHTML = `
        <div class="d-flex gap-1">
          <div class="flex-shrink-0 text-center me-3">
            ${imageData ? `<img src="${imageData}" class="date-img">` : `<div class="text-secondary date-img d-flex align-items-center justify-content-center">No image</div>`}
          </div>
          <div class="flex-fill" style="min-width:0">
            <div class="fw-bold editor-title mb-2">${escapeHtml(catData.name)}</div>
            <div class="d-flex gap-2">
              <button class="btn btn-primary editor-btn" onclick="editCategory(${realIndex})" ${editingCategoryIndex >= 0 ? 'disabled' : ''}>Edit</button>
              <button class="btn btn-danger editor-btn ms-auto" onclick="deleteCategory(${realIndex})" ${editingCategoryIndex >= 0 ? 'disabled' : ''}>Delete</button>
            </div>
          </div>
        </div>
      `;
    }

    list.appendChild(card);
  });

  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-primary editor-btn btn-wide" onclick="addNewCategory()" ${editingCategoryIndex >= 0 ? 'disabled' : ''}>Add Category</button>
      <button class="btn btn-success editor-btn btn-wide ms-auto" onclick="closeCategoriesEditor()" ${editingCategoryIndex >= 0 ? 'disabled' : ''}>Done</button>
    </div>
  `;

  if (editingCategoryIndex >= 0) {
    filterEl.classList.add("d-none");
  } else {
    filterEl.classList.remove("d-none");
    filterEl.innerHTML = `
      <div class="d-flex gap-2 align-items-center">
        <input class="form-control" type="search" placeholder="Search category names..." value="${escapeHtml(categoryNameSearch)}" oninput="setCategoryNameSearch(this.value)">
      </div>
    `;
  }
  updateNavState();
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

function editCategory(index) {
  const categories = loadCategories();
  editCategoryBuffer = JSON.parse(JSON.stringify(categories[index]));
  editingCategoryIndex = index;
  isNewCategory = false;
  renderCategoriesEditor();
  checkDuplicateCategoryName();
}

function checkDuplicateCategoryName() {
  const categories = loadCategories();
  const input = document.querySelector('#categoriesList .card-edited input.form-control');
  if (!input) return;
  const trimmed = input.value.trim();
  const hasDuplicate = categories.some((c, i) => i !== editingCategoryIndex && c.name === trimmed);
  const errorEl = document.getElementById("categoryNameError");
  const okBtn = document.querySelector('#categoriesList .btn-success.editor-btn');
  if (errorEl) errorEl.style.display = hasDuplicate ? "block" : "none";
  if (okBtn) okBtn.disabled = hasDuplicate;
}

function doneCategoryEditing() {
  if (editingCategoryIndex >= 0 && editCategoryBuffer) {
    if (!editCategoryBuffer.image) editCategoryBuffer.image = null;
    editCategoryBuffer.name = (editCategoryBuffer.name || "").trim();
    const categories = loadCategories();
    if (categories.some((c, i) => i !== editingCategoryIndex && c.name === editCategoryBuffer.name)) return;
    categories[editingCategoryIndex] = editCategoryBuffer;
    saveCategories(categories);
  }
  editingCategoryIndex = -1;
  editCategoryBuffer = null;
  isNewCategory = false;
  renderCategoriesEditor();
}

function cancelCategoryEditing() {
  if (isNewCategory && editingCategoryIndex >= 0) {
    const categories = loadCategories();
    categories.splice(editingCategoryIndex, 1);
    saveCategories(categories);
  }
  editingCategoryIndex = -1;
  editCategoryBuffer = null;
  isNewCategory = false;
  renderCategoriesEditor();
}

function editCategoryBufferField(field, value) {
  if (!editCategoryBuffer) return;
  editCategoryBuffer[field] = value;
}

function deleteCategory(index) {
  if (editingCategoryIndex === index) {
    editingCategoryIndex = -1;
    editCategoryBuffer = null;
    isNewCategory = false;
  }
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
  editCategoryBuffer = JSON.parse(JSON.stringify(categories[categories.length - 1]));
  editingCategoryIndex = categories.length - 1;
  isNewCategory = true;
  renderCategoriesEditor();
  const cards = document.querySelectorAll("#categoriesList .card");
  const lastCard = cards[cards.length - 1];
  if (lastCard) lastCard.scrollIntoView({ behavior: "smooth", block: "center" });
  checkDuplicateCategoryName();
}
