function renderCategoriesEditor() {
  const list = document.getElementById("categoriesList");
  const addTile = document.getElementById("addCategoryTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const categories = loadCategories();

  categories.forEach((c, index) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">

        <!-- CATEGORY NAME -->
        <div class="col">
          <label class="form-label">Category</label>
          <input class="form-control"
                 value="${c}"
                 onchange="updateCategory(${index}, this.value)">
        </div>

        <!-- DELETE BUTTON -->
        <div class="col-auto">
          <button class="btn btn-danger"
                  onclick="deleteCategory(${index})">
            Delete
          </button>
        </div>

      </div>
    `;

    list.appendChild(card);
  });

  // ADD CATEGORY + DONE BUTTON
  addTile.innerHTML = `
    <button class="btn btn-success btn-add" onclick="addNewCategory()">Add Category</button>
    <button class="btn btn-primary" onclick="closeCategoriesEditor()">Done</button>
  `;
}

/* ---------------------------------------------------------
   UPDATE FUNCTIONS
--------------------------------------------------------- */

function updateCategory(index, value) {
  const categories = loadCategories();
  categories[index] = value;
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
  categories.push("New Category");
  saveCategories(categories);
  renderCategoriesEditor();
}
