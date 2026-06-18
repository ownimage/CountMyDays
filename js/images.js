let editingImageIndex = -1;
let isNewImage = false;

function loadImages() {
  return JSON.parse(localStorage.getItem("images") || "[]");
}

function saveImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

function renderImagesEditor() {
  const list = document.getElementById("imagesList");
  const topTile = document.getElementById("addImageTileTop");

  list.innerHTML = "";
  topTile.innerHTML = "";

  const images = loadImages();

  images.forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3" + (index === editingImageIndex ? " card-edited" : "");

    if (editingImageIndex === index) {
      const hasData = img.data && img.data.length > 0;
      card.innerHTML = `
        <div class="row align-items-center">
          <div class="col-auto">
            ${hasData
              ? `<img src="${img.data}" class="date-img">`
              : `<div class="date-img d-flex align-items-center justify-content-center text-secondary border rounded">No image</div>`
            }
            <button class="btn btn-outline-primary btn-sm mt-2 w-100" onclick="openImageUpload(${index})">${hasData ? "Change" : "Upload"}</button>
          </div>
          <div class="col">
            <label class="form-label">Image Name</label>
            <input class="form-control" value="${img.name}" onchange="editImageField('name', this.value)">
          </div>
          <div class="col-auto d-flex gap-2">
            <button class="btn btn-success editor-btn" onclick="doneImageEdit(${index})">OK</button>
            <button class="btn btn-secondary editor-btn" onclick="cancelImageEdit()">Cancel</button>
          </div>
        </div>
      `;
    } else {
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
            <button class="btn btn-danger editor-btn" onclick="deleteImage(${index})">Delete</button>
          </div>
        </div>
      `;
    }

    list.appendChild(card);
  });

  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-success editor-btn" onclick="addNewImage()" ${editingImageIndex >= 0 ? 'disabled' : ''}>Add Image</button>
      <button class="btn btn-primary editor-btn ms-auto" onclick="closeImagesEditor()" ${editingImageIndex >= 0 ? 'disabled' : ''}>Done</button>
    </div>
  `;
}

function editImageField(field, value) {
  const images = loadImages();
  if (editingImageIndex < 0 || editingImageIndex >= images.length) return;
  images[editingImageIndex][field] = value;
  saveImages(images);
}

function openImageUpload(index) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = evt => {
      const images = loadImages();
      if (index < 0 || index >= images.length) return;
      images[index].data = evt.target.result;
      saveImages(images);
      renderImagesEditor();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function addNewImage() {
  const images = loadImages();
  const name = "New Image " + (images.length + 1);
  images.push({ name, data: "" });
  saveImages(images);
  editingImageIndex = images.length - 1;
  isNewImage = true;
  renderImagesEditor();
  const cards = document.querySelectorAll("#imagesList .card");
  const lastCard = cards[cards.length - 1];
  if (lastCard) lastCard.scrollIntoView({ behavior: "smooth", block: "center" });
}

function doneImageEdit(index) {
  editingImageIndex = -1;
  isNewImage = false;
  renderImagesEditor();
}

function cancelImageEdit() {
  if (isNewImage && editingImageIndex >= 0) {
    const images = loadImages();
    images.splice(editingImageIndex, 1);
    saveImages(images);
  }
  editingImageIndex = -1;
  isNewImage = false;
  renderImagesEditor();
}

function renameImage(index, newName) {
  const images = loadImages();
  const oldName = images[index].name;

  images[index].name = newName;
  saveImages(images);

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

  const categories = loadCategories();
  categories.forEach(c => {
    if (c.image === removed) c.image = null;
  });
  saveCategories(categories);

  renderImagesEditor();
}
