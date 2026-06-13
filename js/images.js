/* -------------------------
   IMAGES EDITOR
------------------------- */

function renderImagesEditor() {
  const addTile = document.getElementById("addImageTile");
  const list = document.getElementById("imageList");

  addTile.innerHTML = "";
  list.innerHTML = "";

  /* -------------------------
     ADD IMAGE TILE
  ------------------------- */

  const add = document.createElement("div");
  add.className = "add-item";

  add.innerHTML = `
    <h3>Upload Image</h3>

    <div class="field-row">
      <label>Name:</label>
      <input id="newImageName" type="text">
    </div>

    <div class="field-row">
      <label>File:</label>
      <input id="newImageFile" type="file" accept="image/*">
    </div>

    <button class="btn btn-add" onclick="addImage()">Add Image</button>
  `;

  addTile.appendChild(add);

  /* -------------------------
     RENDER EXISTING IMAGES
  ------------------------- */

  const images = loadImages();

  images.forEach((img, index) => {
    const row = document.createElement("div");
    row.className = "image-item";

    const safeId = `img_${index}`;

    row.innerHTML = `
      <div class="image-row">

        <img src="${img.data}" class="image-thumb">

        <input id="${safeId}_name" class="image-name" type="text" value="${img.name}">

        <div class="image-buttons">
          <button class="btn btn-save btn-disabled" id="${safeId}_save" onclick="saveImageName(${index}, '${safeId}')" disabled>Save</button>
          <button class="btn btn-delete" onclick="deleteImage(${index})">Delete</button>
        </div>

      </div>
    `;

    list.appendChild(row);

    /* Enable save button only when name changes */
    const nameInput = document.getElementById(`${safeId}_name`);
    const saveBtn = document.getElementById(`${safeId}_save`);

    nameInput.addEventListener("input", () => {
      if (nameInput.value.trim() !== img.name) {
        saveBtn.classList.remove("btn-disabled");
        saveBtn.disabled = false;
      } else {
        saveBtn.classList.add("btn-disabled");
        saveBtn.disabled = true;
      }
    });
  });
}

/* -------------------------
   ADD IMAGE
------------------------- */

function addImage() {
  const name = document.getElementById("newImageName").value.trim();
  const fileInput = document.getElementById("newImageFile");
  const file = fileInput.files[0];

  if (!name || !file) {
    alert("Please enter a name and choose an image file");
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    const base64 = e.target.result;

    const images = loadImages();

    images.push({
      id: "img_" + Date.now(),
      name,
      data: base64
    });

    saveImages(images);
    renderImagesEditor();
  };

  reader.readAsDataURL(file);
}

/* -------------------------
   SAVE IMAGE NAME
------------------------- */

function saveImageName(index, safeId) {
  const images = loadImages();
  const newName = document.getElementById(`${safeId}_name`).value.trim();

  if (!newName) {
    alert("Name cannot be empty");
    return;
  }

  images[index].name = newName;
  saveImages(images);

  renderImagesEditor();
}

/* -------------------------
   DELETE IMAGE
------------------------- */

function deleteImage(index) {
  if (!confirm("Delete this image?")) return;

  const images = loadImages();
  images.splice(index, 1);
  saveImages(images);

  renderImagesEditor();
}
