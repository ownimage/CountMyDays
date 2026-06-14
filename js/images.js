function safeImages() {
  const raw = loadImages();
  let arr = [];

  if (Array.isArray(raw)) {
    arr = raw;
  } else if (raw && typeof raw === "object") {
    arr = Object.values(raw);
  }

  arr = arr.filter(img => img && typeof img === "object");

  arr = arr.map(img => ({
    category: img.category || "Holiday",
    data: img.data || ""
  }));

  return arr;
}

function renderImagesEditor() {
  const list = document.getElementById("imagesList");
  const addTile = document.getElementById("addImageTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const images = safeImages();
  const categories = loadCategories();

  images.forEach((img, index) => {
    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    const preview = img.data
      ? `<img src="${img.data}" class="date-img">`
      : `<div class="text-secondary">No image</div>`;

    card.innerHTML = `
      <div class="row align-items-center">

        <div class="col-auto">
          ${preview}
        </div>

        <div class="col-4">
          <label class="form-label">Category</label>
          <select class="form-select"
                  onchange="updateImageCategory(${index}, this.value)">
            ${categories.map(c => `
              <option value="${c}" ${c === img.category ? "selected" : ""}>${c}</option>
            `).join("")}
          </select>
        </div>

        <div class="col-4">
          <label class="form-label">Replace Image</label>
          <input type="file"
                 accept="image/*"
                 class="form-control"
                 onchange="replaceImage(${index}, this.files[0])">
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

function updateImageCategory(index, value) {
  const images = safeImages();
  images[index].category = value;
  saveImages(images);
}

function replaceImage(index, file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const images = safeImages();
    images[index].data = reader.result;
    saveImages(images);
    renderImagesEditor();
  };
  reader.readAsDataURL(file);
}

function deleteImage(index) {
  const images = safeImages();
  images.splice(index, 1);
  saveImages(images);
  renderImagesEditor();
}

function addNewImage() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const images = safeImages();
      images.push({
        category: "Holiday",
        data: reader.result
      });
      saveImages(images);
      renderImagesEditor();
    };

    reader.readAsDataURL(file);
  };

  input.click();
}
