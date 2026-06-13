/* -------------------------
   IMAGE EDITOR RENDERING
------------------------- */

function renderImagesEditor() {
  const list = document.getElementById("imageList");
  const addTile = document.getElementById("addImageTile");

  list.innerHTML = "";
  addTile.innerHTML = "";

  const images = loadImages();

  images.forEach((img, index) => {
    const item = document.createElement("div");
    item.className = "image-item";

    item.innerHTML = `
      <div class="image-row">
        <img class="image-thumb" src="${img.data}">
        <div class="image-name">${img.name}</div>
        <div class="image-buttons">
          <button class="btn btn-delete" onclick="deleteImage(${index})">Delete</button>
        </div>
      </div>
    `;

    list.appendChild(item);
  });

  addTile.innerHTML = `
    <button class="btn btn-add" onclick="addNewImage()">Add Image</button>
  `;
}

function deleteImage(index) {
  const images = loadImages();
  images.splice(index, 1);
  saveImages(images);
  renderImagesEditor();
}

function addNewImage() {
  alert("Manual image upload coming soon.");
}
