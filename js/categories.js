function loadCategories() {
  return JSON.parse(localStorage.getItem("categories") || "[]");
}

function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function renderCategoriesEditor() {
  const list = document.getElementById("categoriesList");
  const addTile = document.getElementById("addCategoryTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const categories = loadCategories();
  const images = loadImages();

  categories.forEach((c, index) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">

        <div class="col">
          <label class="form-label">Category Name</label>
          <input class="form-control"
                 value="${c.name}"
                 onchange="updateCategoryName(${index}, this.value)">

          <label class="form-label mt-2">Image</label>
          <select class="form-select"
                  onchange="updateCategoryImage(${index}, this.value)">
            <option value="">-- No Image Selected --</option>
            ${images.map(img => `
              <option value="${img.name}" ${img.name === c.image ? "selected" : ""}>
                ${img.name}
              </option>
            `).join("")}
          </select>
        </div>

        <div class="col-auto">
          <button class="btn btn-danger" onclick="deleteCategory(${index})">Delete</button>
        </div>

      </div>
    `;

    list.appendChild(card);
  });

  addTile.innerHTML = `
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-success" onclick="addNewCategory()">Add Category</button>
      <button class="btn btn-primary" onclick="closeCategoriesEditor()">Done</button>
    </div>
  `;
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
}

function deleteCategory(index) {
  const categories = loadCategories();
  categories.splice(index, 1);
  saveCategories(categories);
  renderCategoriesEditor();
}

function addNewCategory() {
  const categories = loadCategories();

  categories.push({
    name: "New Category",
    image: null
  });

  saveCategories(categories);
  renderCategoriesEditor();
}
