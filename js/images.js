let editingImageIndex = -1;
let isNewImage = false;
let editImageBackup = null;
let imageNameSearch = "";

function loadImages() {
  return JSON.parse(localStorage.getItem("images") || "[]");
}

function saveImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

function getImageColors(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml,")) {
    return { line: "", fill: "" };
  }
  const svgPart = dataUrl.substring("data:image/svg+xml,".length);
  const decoded = decodeURIComponent(svgPart);
  const decodeVal = v => v && v.startsWith("%23") ? "#" + v.substring(3) : v;
  const lineMatch = decoded.match(/\bstroke\s*=\s*["']([^"']+)["']/i);
  const fillMatch = decoded.match(/\bfill\s*=\s*["']([^"']+)["']/i);
  return {
    line: lineMatch ? decodeVal(lineMatch[1]) : "",
    fill: fillMatch ? decodeVal(fillMatch[1]) : ""
  };
}

function updateSvgColor(dataUrl, attr, newColor) {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml,")) return dataUrl;
  const svgPart = dataUrl.substring("data:image/svg+xml,".length);
  const decoded = decodeURIComponent(svgPart);
  const regex = new RegExp(`\\b${attr}\\s*=\\s*["'][^"']*["']`);
  const encoded = newColor && newColor.startsWith("#")
    ? newColor
    : newColor || "none";
  const updated = decoded.replace(regex, (m) => {
    const quote = m.includes('"') ? '"' : "'";
    return `${attr}=${quote}${encoded}${quote}`;
  });
  return "data:image/svg+xml," + encodeURIComponent(updated);
}

function renderImagesEditor() {
  const list = document.getElementById("imagesList");
  const topTile = document.getElementById("addImageTileTop");
  const filterEl = document.getElementById("imageFilters");

  list.innerHTML = "";
  topTile.innerHTML = "";
  filterEl.innerHTML = "";

  const images = loadImages();

  const filtered = images.filter(img => {
    if (editingImageIndex >= 0) return true;
    if (imageNameSearch && !img.name.toLowerCase().includes(imageNameSearch.toLowerCase())) return false;
    return true;
  });

  filtered.forEach((img, index) => {
    const realIndex = images.indexOf(img);
    const card = document.createElement("div");
    card.className = "card p-3 mb-3" + (realIndex === editingImageIndex ? " card-edited" : "");

    if (editingImageIndex === realIndex) {
      const hasData = img.data && img.data.length > 0;
      const colors = getImageColors(img.data);
      const lineVal = colors.line !== "none" ? colors.line : (img._prevStroke || "#000000");
      const fillVal = colors.fill !== "none" ? colors.fill : (img._prevFill || "#ffffff");
      card.innerHTML = `
        <div class="row align-items-center">
          <div class="col-auto">
            ${hasData
              ? `<img src="${img.data}" class="date-img">`
              : `<div class="date-img d-flex align-items-center justify-content-center text-secondary border rounded">No image</div>`
            }
            <button class="btn btn-outline-primary btn-sm mt-2 w-100" onclick="openImageUpload(${realIndex})">${hasData ? "Change" : "Upload"}</button>
          </div>
          <div class="col">
            <label class="form-label">Name</label>
            <input class="form-control" value="${escapeHtml(img.name)}" onchange="editImageField('name', this.value)">
            <div class="d-flex gap-3 mt-2 align-items-center flex-wrap">
              <label class="form-label mb-0">Line:</label>
              <input type="color" value="${lineVal}" oninput="editImageColor(${realIndex}, 'stroke', this.value)">
              <label class="form-check-label mb-0">
                <input type="checkbox" ${colors.line === 'none' || !colors.line ? 'checked' : ''} onchange="editImageStrokeNone(${realIndex}, this.checked)">
                none
              </label>
              <label class="form-label mb-0">Fill:</label>
              <input type="color" value="${fillVal}" oninput="editImageColor(${realIndex}, 'fill', this.value)">
              <label class="form-check-label mb-0">
                <input type="checkbox" ${colors.fill === 'none' || !colors.fill ? 'checked' : ''} onchange="editImageFillNone(${realIndex}, this.checked)">
                none
              </label>
            </div>
          </div>
          <div class="col-auto d-flex gap-2">
            <button class="btn btn-success editor-btn" onclick="doneImageEdit(${realIndex})">OK</button>
            <button class="btn btn-secondary editor-btn" onclick="cancelImageEdit()">Cancel</button>
          </div>
        </div>
      `;
    } else {
      const colors = getImageColors(img.data);
      card.innerHTML = `
        <div class="row align-items-center">
          <div class="col-auto">
            <img src="${img.data}" class="date-img">
          </div>
          <div class="col">
            <div class="mb-1"><strong>Name:</strong> ${escapeHtml(img.name)}</div>
            <div class="d-flex gap-2 align-items-center flex-wrap">
              <button class="btn btn-primary editor-btn" onclick="startEditImage(${realIndex})">Edit</button>
              ${colors.line ? `<span class="d-flex align-items-center gap-1"><span class="color-swatch" style="background:${colors.line === 'none' ? 'transparent' : colors.line}"></span>Line${colors.line === 'none' ? ': none' : ''}</span>` : ''}
              ${colors.fill ? `<span class="d-flex align-items-center gap-1"><span class="color-swatch" style="background:${colors.fill === 'none' ? 'transparent' : colors.fill}"></span>Fill${colors.fill === 'none' ? ': none' : ''}</span>` : ''}
            </div>
          </div>
          <div class="col-auto">
            <button class="btn btn-danger editor-btn" onclick="deleteImage(${realIndex})">Delete</button>
          </div>
        </div>
      `;
    }

    list.appendChild(card);
  });

  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-primary editor-btn btn-wide" onclick="addNewImage()" ${editingImageIndex >= 0 ? 'disabled' : ''}>Add Image</button>
      <button class="btn btn-success editor-btn btn-wide ms-auto" onclick="closeImagesEditor()" ${editingImageIndex >= 0 ? 'disabled' : ''}>Done</button>
    </div>
  `;

  if (editingImageIndex >= 0) {
    filterEl.classList.add("d-none");
  } else {
    filterEl.classList.remove("d-none");
    filterEl.innerHTML = `
      <div class="d-flex gap-2 align-items-center">
        <input class="form-control" type="search" placeholder="Search image names..." value="${escapeHtml(imageNameSearch)}" oninput="setImageNameSearch(this.value)">
      </div>
    `;
  }
  updateNavState();
}

function setImageNameSearch(val) {
  imageNameSearch = val;
  renderImagesEditor();
  const input = document.querySelector('#imageFilters input[type="search"]');
  if (input) {
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }
}

function startEditImage(index) {
  const images = loadImages();
  editImageBackup = JSON.parse(JSON.stringify(images[index]));
  editingImageIndex = index;
  isNewImage = false;
  renderImagesEditor();
}

function editImageField(field, value) {
  const images = loadImages();
  if (editingImageIndex < 0 || editingImageIndex >= images.length) return;
  images[editingImageIndex][field] = value;
  saveImages(images);
}

function editImageColor(index, attr, value) {
  const images = loadImages();
  if (index < 0 || index >= images.length) return;
  const img = images[index];
  img.data = updateSvgColor(img.data, attr, value);
  img.lineColor = attr === 'stroke' ? value : img.lineColor;
  img.fillColor = attr === 'fill' ? value : img.fillColor;
  saveImages(images);
  renderImagesEditor();
}

function editImageFillNone(index, checked) {
  const images = loadImages();
  if (index < 0 || index >= images.length) return;
  const img = images[index];
  if (checked) {
    const colors = getImageColors(img.data);
    img._prevFill = colors.fill && colors.fill !== "none" ? colors.fill : null;
    img.data = updateSvgColor(img.data, "fill", "none");
    img.fillColor = "none";
  } else {
    const restore = img._prevFill || "#000000";
    img.data = updateSvgColor(img.data, "fill", restore);
    img.fillColor = restore;
  }
  saveImages(images);
  renderImagesEditor();
}

function editImageStrokeNone(index, checked) {
  const images = loadImages();
  if (index < 0 || index >= images.length) return;
  const img = images[index];
  if (checked) {
    const colors = getImageColors(img.data);
    img._prevStroke = colors.line && colors.line !== "none" ? colors.line : null;
    img.data = updateSvgColor(img.data, "stroke", "none");
    img.lineColor = "none";
  } else {
    const restore = img._prevStroke || "#000000";
    img.data = updateSvgColor(img.data, "stroke", restore);
    img.lineColor = restore;
  }
  saveImages(images);
  renderImagesEditor();
}

function normalizeSvgForEditing(svgText) {
  svgText = svgText.replace(/<\?xml[^>]*\?>/g, "").replace(/<!--[\s\S]*?-->/g, "");
  const rootHasStroke = /<svg[^>]*\bstroke\s*=/i.test(svgText);
  const rootHasFill = /<svg[^>]*\bfill\s*=/i.test(svgText);
  const firstStroke = svgText.match(/\bstroke\s*=\s*["']([^"']+)["']/i);
  const firstFill = svgText.match(/\bfill\s*=\s*["']([^"']+)["']/i);
  if (!rootHasStroke) {
    const val = firstStroke ? firstStroke[1] : "currentColor";
    svgText = svgText.replace(/<svg/i, `<svg stroke="${val}"`);
  }
  if (!rootHasFill) {
    const val = firstFill ? firstFill[1] : "none";
    svgText = svgText.replace(/<svg/i, `<svg fill="${val}"`);
  }
  return svgText;
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
      if (file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")) {
        const svgText = normalizeSvgForEditing(evt.target.result);
        images[index].data = "data:image/svg+xml," + encodeURIComponent(svgText);
      } else {
        images[index].data = evt.target.result;
      }
      saveImages(images);
      renderImagesEditor();
    };
    if (file.type === "image/svg+xml" || (file.name && file.name.toLowerCase().endsWith(".svg"))) {
      reader.readAsText(file);
    } else {
      reader.readAsDataURL(file);
    }
  };
  input.click();
}

function addNewImage() {
  const images = loadImages();
  const name = "New Image " + (images.length + 1);
  images.push({ name, data: "" });
  saveImages(images);
  imageNameSearch = "";
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
  editImageBackup = null;
  renderImagesEditor();
}

function cancelImageEdit() {
  if (editingImageIndex >= 0) {
    const images = loadImages();
    if (isNewImage) {
      images.splice(editingImageIndex, 1);
    } else if (editImageBackup) {
      images[editingImageIndex] = editImageBackup;
    }
    saveImages(images);
  }
  editingImageIndex = -1;
  isNewImage = false;
  editImageBackup = null;
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
