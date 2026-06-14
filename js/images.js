function loadImages() {
  return JSON.parse(localStorage.getItem("images") || "[]");
}

function saveImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

function renderImagesEditor() {
  const list = document.getElementById("imagesList");
  const addTile = document.getElementById("addImageTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const images = loadImages();

  images.forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">

        <div class="col-auto">
          <img src="${img.data}" class="date-img">
        </div>

        <div class="col">
          <label class="form-label">Image Name</label>
          <input class="form-control"
                 value="${img.name}"
                 onchange="renameImage(${index}, this.value)">
        </div>

        <div class="col-auto">
          <button class="btn btn-danger" onclick="deleteImage(${index})">Delete</button>
        </div>

      </div>
    `;

    list.appendChild(card);
  });

  addTile.innerHTML = `
    <div class="d-flex justify-content-end gap-2 mt-4">
      <button class="btn btn-success" onclick="addNewImage()">Add Image</button>
      <button class="btn btn-primary" onclick="closeImagesEditor()">Done</button>
    </div>
  `;
}

function renameImage(index, newName) {
  const images = loadImages();
  const oldName = images[index].name;

  images[index].name = newName;
  saveImages(images);

  // Update categories that reference this image
  const categories = loadCategories();
  categories.forEach(c => {
    if (c.image === oldName) c.image = newName;
  });
  saveCategories(categories);

  renderImagesEditor();
}

function deleteImage(index) {
  const images = loadImages();
  const removed = images[index].name;

  images.splice(index, 1);
  saveImages(images);

  // Fix categories that referenced this image
  const categories = loadCategories();
  categories.forEach(c => {
    if (c.image === removed) c.image = null;
  });
  saveCategories(categories);

  renderImagesEditor();
}

function addNewImage() {
  const images = loadImages();

  const name = "New Image " + (images.length + 1);

  images.push({
    name,
    data: "" // user will upload later
  });

  saveImages(images);
  renderImagesEditor();
}
