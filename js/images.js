let editingImageIndex = -1;
let isNewImage = false;
let editImageBackup = null;
let imageNameSearch = "";
let imagesPage = 0;
let imagesTotalPages = 1;
const IMAGES_PAGE_SIZE = 30;

function loadImages() {
  return JSON.parse(localStorage.getItem("images") || "[]");
}

function saveImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

function getImageColors(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml,")) {
    return { line: "", fill: "", strokeWidth: "" };
  }
  const svgPart = dataUrl.substring("data:image/svg+xml,".length);
  const decoded = decodeURIComponent(svgPart);
  const decodeVal = v => v && v.startsWith("%23") ? "#" + v.substring(3) : v;
  const lineMatch = decoded.match(/\bstroke\s*=\s*["']([^"']+)["']/i);
  const fillMatch = decoded.match(/\bfill\s*=\s*["']([^"']+)["']/i);
  const swMatch = decoded.match(/\bstroke-width\s*=\s*["']([^"']+)["']/i);
  return {
    line: lineMatch ? decodeVal(lineMatch[1]) : "",
    fill: fillMatch ? decodeVal(fillMatch[1]) : "",
    strokeWidth: swMatch ? swMatch[1] : ""
  };
}

function updateSvgColor(dataUrl, attr, newColor) {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml,")) return dataUrl;
  const svgPart = dataUrl.substring("data:image/svg+xml,".length);
  const decoded = decodeURIComponent(svgPart);
  const regex = new RegExp(`\\b${attr}\\s*=\\s*["'][^"']*["']`, 'g');
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
  const singleEditor = document.getElementById("singleImageEditor");

  list.innerHTML = "";
  topTile.innerHTML = "";
  filterEl.innerHTML = "";
  singleEditor.innerHTML = "";

  const images = loadImages();

  if (editingImageIndex >= 0) {
    list.classList.add("d-none");
    topTile.classList.add("d-none");
    filterEl.classList.add("d-none");
    singleEditor.classList.remove("d-none");

    const img = images[editingImageIndex];
    const hasData = img.data && img.data.length > 0;
    const colors = getImageColors(img.data);
    const lineVal = colors.line !== "none" ? colors.line : (img._prevStroke || "#000000");
    const fillVal = colors.fill !== "none" ? colors.fill : (img._prevFill || "#ffffff");

    const heading = isNewImage ? "Add Image" : "Edit Image";
    singleEditor.innerHTML = `
      <div class="d-flex align-items-center mb-3">
        <h3 class="mb-0">${heading}</h3>
        <button class="btn btn-outline-secondary ms-auto" onclick="cancelImageEdit()">Back</button>
      </div>
      <div class="card p-3 card-edited">
        <div class="row align-items-center">
          <div class="col-auto" style="width:130px;flex:0 0 auto">
            ${hasData
              ? `<img src="${img.data}" class="date-img">`
              : `<div class="date-img d-flex align-items-center justify-content-center text-secondary border rounded">No image</div>`
            }
            <button class="btn btn-primary btn-sm mt-2 w-100 text-nowrap" onclick="openImageUpload(${editingImageIndex})">Upload</button>
          </div>
          <div class="col">
            <input class="form-control" value="${escapeHtml(img.name)}" onchange="editImageField('name', this.value); checkDuplicateName()" oninput="checkDuplicateName()">
            <div id="imageNameError" class="text-danger mt-1" style="display:none">ERROR: There is already an image with this name.</div>
            <div class="d-flex gap-2 mt-2 align-items-center flex-wrap">
              <button class="btn btn-success editor-btn" onclick="doneImageEdit(${editingImageIndex})">OK</button>
              <label class="form-label mb-0">Line:</label>
              <input type="color" value="${lineVal}" oninput="editImageColor(${editingImageIndex}, 'stroke', this.value)">
              <label class="form-check-label mb-0">
                <input type="checkbox" ${colors.line === 'none' || !colors.line ? 'checked' : ''} onchange="editImageStrokeNone(${editingImageIndex}, this.checked)">
                none
              </label>
              <label class="form-label mb-0">Fill:</label>
              <input type="color" value="${fillVal}" oninput="editImageColor(${editingImageIndex}, 'fill', this.value)">
              <label class="form-check-label mb-0">
                <input type="checkbox" ${colors.fill === 'none' || !colors.fill ? 'checked' : ''} onchange="editImageFillNone(${editingImageIndex}, this.checked)">
                none
              </label>
              <label class="form-label mb-0">Width:</label>
              <input type="number" min="0.5" max="10" step="0.5" value="${colors.strokeWidth || '2'}" style="width:60px" class="form-control form-control-sm d-inline-block" oninput="editImageStrokeWidth(${editingImageIndex}, this.value)">
            </div>
          </div>
            <div class="col-auto d-flex align-items-center">
              <button class="btn btn-secondary editor-btn" onclick="cancelImageEdit()">Cancel</button>
            </div>
        </div>
      `;
    } else {
      const colors = getImageColors(img.data);
      card.innerHTML = `
        <div class="row align-items-center">
          <div class="col-auto" style="width:130px;flex:0 0 auto">
            <img src="${img.data}" class="date-img">
          </div>
          <div class="col">
            <div class="mb-1">${escapeHtml(img.name)}</div>
            <div class="d-flex gap-2 align-items-center flex-wrap">
              <button class="btn btn-primary editor-btn" onclick="startEditImage(${realIndex})" ${editingImageIndex >= 0 ? 'disabled' : ''}>Edit</button>
              ${colors.line ? `<span class="d-flex align-items-center gap-1"><span class="color-swatch" style="background:${colors.line === 'none' ? 'transparent' : colors.line}"></span>Line${colors.line === 'none' ? ': none' : ''}</span>` : ''}
              ${colors.fill ? `<span class="d-flex align-items-center gap-1"><span class="color-swatch" style="background:${colors.fill === 'none' ? 'transparent' : colors.fill}"></span>Fill${colors.fill === 'none' ? ': none' : ''}</span>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
    list.appendChild(card);
  });

  if (imagesTotalPages > 1) {
    const nav = document.createElement("div");
    nav.className = "d-flex justify-content-center align-items-center gap-3 mt-3 mb-2";
    nav.innerHTML = `
      <button class="btn btn-outline-secondary btn-sm" onclick="imagesPage=Math.max(0,imagesPage-1);renderImagesEditor()" ${imagesPage === 0 ? 'disabled' : ''}>Previous</button>
      <span class="text-nowrap">Page ${imagesPage + 1} of ${imagesTotalPages}</span>
      <button class="btn btn-outline-secondary btn-sm" onclick="imagesPage=Math.min(imagesTotalPages-1,imagesPage+1);renderImagesEditor()" ${imagesPage >= imagesTotalPages - 1 ? 'disabled' : ''}>Next</button>
    `;
    list.appendChild(nav);
  }

  topTile.innerHTML = `
    <div class="d-flex gap-2">
      <button class="btn btn-primary editor-btn btn-wide" onclick="addNewImage()">Add Image</button>
      <button class="btn btn-success editor-btn btn-wide ms-auto" onclick="closeImagesEditor()">Done</button>
    </div>
  `;

  filterEl.classList.remove("d-none");
  filterEl.innerHTML = `
    <div class="d-flex gap-2 align-items-center">
      <input class="form-control" type="search" placeholder="Search image names..." value="${escapeHtml(imageNameSearch)}" oninput="setImageNameSearch(this.value)">
      <button class="btn btn-outline-secondary btn-sm" onclick="imageNameSearch='';imagesPage=0;renderImagesEditor()">Clear</button>
    </div>
  `;
  updateNavState();
}

function setImageNameSearch(val) {
  imageNameSearch = val;
  imagesPage = 0;
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
  checkDuplicateName();
}

function duplicateImage(index) {
  const images = loadImages();
  if (index < 0 || index >= images.length) return;
  const src = images[index];

  // Strip old parenthetical suffix like " (1)" then check for trailing number
  let baseName = src.name.replace(/\s*\(\d+\)\s*$/, "").trim();
  const trailingNum = baseName.match(/^(.*?)\s+(\d+)$/);

  const existingNames = new Set(images.map(i => i.name));
  let newName;

  if (trailingNum) {
    const namePart = trailingNum[1];
    let num = parseInt(trailingNum[2], 10);
    while (existingNames.has(`${namePart} ${num + 1}`)) num++;
    newName = `${namePart} ${num + 1}`;
  } else {
    let n = 2;
    while (existingNames.has(`${baseName} ${n}`)) n++;
    newName = `${baseName} ${n}`;
  }

  const copy = JSON.parse(JSON.stringify(src));
  copy.name = newName;
  images.push(copy);
  saveImages(images);

  editingImageIndex = images.length - 1;
  isNewImage = false;
  editImageBackup = JSON.parse(JSON.stringify(copy));
  renderImagesEditor();
}

function syncImageRename(oldName, newName) {
  const categories = loadCategories();
  categories.forEach(c => { if (c.image === oldName) c.image = newName; });
  saveCategories(categories);
  const dates = loadDates();
  dates.forEach(d => { if (d.image === oldName) d.image = newName; });
  saveDates(dates);
}

function editImageField(field, value) {
  const images = loadImages();
  if (editingImageIndex < 0 || editingImageIndex >= images.length) return;
  const trimmed = value.trim();
  if (field === 'name') {
    const oldName = images[editingImageIndex].name;
    if (oldName !== trimmed) {
      images[editingImageIndex].name = trimmed;
      saveImages(images);
      syncImageRename(oldName, trimmed);
      renderImagesEditor();
      return;
    }
  }
  images[editingImageIndex][field] = trimmed;
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
  const editedCard = document.querySelector('#singleImageEditor .card.card-edited');
  if (editedCard) {
    const imgEl = editedCard.querySelector('img.date-img');
    if (imgEl) imgEl.src = img.data;
  }
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
  const editedCard = document.querySelector('#singleImageEditor .card.card-edited');
  if (editedCard) {
    const imgEl = editedCard.querySelector('img.date-img');
    if (imgEl) imgEl.src = img.data;
  }
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
  const editedCard = document.querySelector('#singleImageEditor .card.card-edited');
  if (editedCard) {
    const imgEl = editedCard.querySelector('img.date-img');
    if (imgEl) imgEl.src = img.data;
  }
}

function editImageStrokeWidth(index, value) {
  const images = loadImages();
  if (index < 0 || index >= images.length) return;
  const img = images[index];
  if (!img.data || !img.data.startsWith("data:image/svg+xml,")) return;
  const svgPart = img.data.substring("data:image/svg+xml,".length);
  const decoded = decodeURIComponent(svgPart);
  if (/\bstroke-width\s*=/i.test(decoded)) {
    img.data = updateSvgColor(img.data, "stroke-width", value || "2");
  } else {
    const updated = decoded.replace(/^<svg/i, `<svg stroke-width="${value || "2"}"`);
    img.data = "data:image/svg+xml," + encodeURIComponent(updated);
  }
  img.strokeWidth = value;
  saveImages(images);
  const editedCard = document.querySelector('#singleImageEditor .card.card-edited');
  if (editedCard) {
    const imgEl = editedCard.querySelector('img.date-img');
    if (imgEl) imgEl.src = img.data;
  }
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
  const editorEl = document.getElementById("imagesEditor");
  if (editorEl) editorEl.scrollIntoView({ behavior: "smooth", block: "start" });
  checkDuplicateName();
}

function checkDuplicateName() {
  const images = loadImages();
  const input = document.querySelector('#singleImageEditor .card-edited input.form-control');
  if (!input) return;
  const trimmed = input.value.trim();
  const hasDuplicate = images.some((img, i) => i !== editingImageIndex && img.name === trimmed);
  const errorEl = document.getElementById("imageNameError");
  const okBtn = document.querySelector('#singleImageEditor .btn-success.editor-btn');
  if (errorEl) errorEl.style.display = hasDuplicate ? "block" : "none";
  if (okBtn) okBtn.disabled = hasDuplicate;
}

function doneImageEdit(index) {
  const images = loadImages();
  if (images.some((img, i) => i !== index && img.name === images[index].name)) return;
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
  syncImageRename(oldName, newName);
  renderImagesEditor();
}

function confirmDeleteImage(index) {
  const images = loadImages();
  const name = images[index].name;
  const categories = loadCategories();
  const dates = loadDates();
  const usedByCategories = categories.filter(c => c.image === name);
  const usedByDates = dates.filter(d => d.image === name);

  if (usedByCategories.length === 0 && usedByDates.length === 0) {
    deleteImage(index);
    return;
  }

  const parts = [];
  if (usedByCategories.length) parts.push(`${usedByCategories.length} categor${usedByCategories.length === 1 ? 'y' : 'ies'}`);
  if (usedByDates.length) parts.push(`${usedByDates.length} date${usedByDates.length === 1 ? '' : 's'}`);

  const modalEl = document.getElementById("deleteConfirmModal");
  document.getElementById("deleteConfirmMessage").innerHTML =
    `Delete image "<strong>${escapeHtml(name)}</strong>"?<br><br>` +
    `<span class="text-warning">This image is used by ${parts.join(" and ")}. The references will be cleared.</span>`;
  document.getElementById("deleteConfirmBtn").onclick = function() {
    bootstrap.Modal.getInstance(modalEl).hide();
    deleteImage(index);
  };
  new bootstrap.Modal(modalEl).show();
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

  const dates = loadDates();
  dates.forEach(d => {
    if (d.image === removed) d.image = null;
  });
  saveDates(dates);

  renderImagesEditor();
}
