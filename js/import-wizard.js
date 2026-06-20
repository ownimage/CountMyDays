let importWizardState = null;

function startImportWizard(data) {
  (data.images || []).forEach(img => { img.name = (img.name || "").trim(); });
  (data.categories || []).forEach(c => { c.name = (c.name || "").trim(); });
  (data.dates || []).forEach(d => { d.name = (d.name || "").trim(); });

  const existingImages = loadImages();
  const imageStatus = [];
  const imageDecisions = [];
  const conflictImages = [];

  (data.images || []).forEach((img, idx) => {
    const existing = existingImages.find(e => e.name === img.name);
    if (!existing) {
      imageStatus[idx] = "autoImport";
      imageDecisions[idx] = { action: "import" };
    } else if (imagesEqual(img, existing)) {
      imageStatus[idx] = "autoDiscard";
      imageDecisions[idx] = { action: "discard" };
    } else {
      imageStatus[idx] = "conflict";
      conflictImages.push(idx);
      imageDecisions[idx] = null;
    }
  });

  importWizardState = {
    data: data,
    step: "images",
    backStack: [],
    imageStatus: imageStatus,
    imageDecisions: imageDecisions,
    conflictImages: conflictImages,
    conflictIdx: 0,
    renameMap: {}
  };

  document.getElementById("importWizardModal").classList.remove("d-none");
  renderImportWizard();
}

function cancelImportWizard() {
  importWizardState = null;
  document.getElementById("importWizardModal").classList.add("d-none");
}

function imagesEqual(imgA, imgB) {
  if (imgA.data !== imgB.data) return false;
  if (imgA.data && imgA.data.startsWith("data:image/svg+xml,") &&
      imgB.data && imgB.data.startsWith("data:image/svg+xml,")) {
    const ca = getImageColors(imgA.data);
    const cb = getImageColors(imgB.data);
    if (ca.line !== cb.line || ca.fill !== cb.fill) return false;
  }
  return true;
}

function renderImportWizard() {
  const body = document.getElementById("importWizardBody");
  const footer = document.getElementById("importWizardFooter");
  const title = document.getElementById("importWizardTitle");
  const state = importWizardState;
  if (!state) return;

  if (state.step === "images") {
    renderImageStage(body, footer, title);
  } else if (state.step === "categories") {
    renderCategoryStage(body, footer, title);
  } else if (state.step === "complete") {
    renderComplete(body, footer, title);
  }
}

function getImageColorDisplay(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith("data:image/svg+xml,")) return { line: null, fill: null };
  const colors = getImageColors(dataUrl);
  return {
    line: colors.line || null,
    fill: colors.fill || null
  };
}

function renderImageStage(body, footer, title) {
  const state = importWizardState;
  const totalConflicts = state.conflictImages.length;

  if (state.conflictIdx < totalConflicts) {
    const imgIdx = state.conflictImages[state.conflictIdx];
    const importImg = state.data.images[imgIdx];
    const existingImages = loadImages();
    const existingImg = existingImages.find(e => e.name === importImg.name);

    const colorsImport = getImageColorDisplay(importImg.data);
    const colorsExisting = getImageColorDisplay(existingImg ? existingImg.data : "");

    title.textContent = `Image ${state.conflictIdx + 1} of ${totalConflicts}`;

    body.innerHTML = `
      <p class="mb-3">An image with the name "<strong>${escapeHtml(importImg.name)}</strong>" already exists but the content is different. Choose what to do:</p>
      <div class="row mb-3">
        <div class="col-6 text-center">
          <h6>Current Image</h6>
          ${existingImg && existingImg.data ? `<img src="${existingImg.data}" style="max-width:100%;max-height:150px;object-fit:contain" class="border rounded p-1">` : '<div class="text-secondary">No preview</div>'}
          <div class="small mt-1 text-secondary">${colorsExisting.line !== null ? `Line: ${colorsExisting.line}` : ''}${colorsExisting.line !== null && colorsExisting.fill !== null ? ' | ' : ''}${colorsExisting.fill !== null ? `Fill: ${colorsExisting.fill}` : ''}</div>
        </div>
        <div class="col-6 text-center">
          <h6>Imported Image</h6>
          ${importImg.data ? `<img src="${importImg.data}" style="max-width:100%;max-height:150px;object-fit:contain" class="border rounded p-1">` : '<div class="text-secondary">No preview</div>'}
          <div class="small mt-1 text-secondary">${colorsImport.line !== null ? `Line: ${colorsImport.line}` : ''}${colorsImport.line !== null && colorsImport.fill !== null ? ' | ' : ''}${colorsImport.fill !== null ? `Fill: ${colorsImport.fill}` : ''}</div>
        </div>
      </div>
      <div class="mb-2">
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgSkip" value="skip" checked onchange="toggleImageRenameInput()">
          <label class="form-check-label" for="imgSkip">Skip - don't import this image</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgOverwrite" value="overwrite" onchange="toggleImageRenameInput()">
          <label class="form-check-label" for="imgOverwrite">Replace - overwrite the existing image with the imported one</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgKeepBoth" value="keepBoth" onchange="toggleImageRenameInput()">
          <label class="form-check-label" for="imgKeepBoth">Keep Both - import with a different name:
            <input type="text" id="imgNewName" class="form-control form-control-sm d-inline-block" style="width:auto;min-width:180px" value="${escapeHtml(importImg.name)}" disabled onclick="event.stopPropagation()" oninput="validateNewImageName(this)">
          </label>
          <div id="imgNewNameError" class="text-danger small" style="display:none">ERROR: There is already an image with this name.</div>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide btn-lg" onclick="cancelImportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide btn-lg" onclick="resolveImageConflict()">Next</button>
    `;
  } else {
    const imported = state.imageDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;
    const discarded = state.imageDecisions.filter(d => d && d.action === "discard").length;
    const total = state.data.images.length;
    const autoImport = state.imageStatus.filter(s => s === "autoImport").length;
    const autoDiscard = state.imageStatus.filter(s => s === "autoDiscard").length;

    title.textContent = "Image Summary";

    body.innerHTML = `
      <p>Image processing complete.</p>
      <ul>
        <li>${autoImport} new image(s) - will be imported</li>
        <li>${autoDiscard} duplicate(s) - will be skipped</li>
        ${state.conflictImages.length > 0 ? `<li>${state.conflictImages.length} conflict(s) resolved: ${imported - autoImport} to import, ${discarded - autoDiscard} skipped</li>` : ''}
      </ul>
      <p class="text-secondary">Total: ${total} image(s) in import.</p>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide btn-lg" onclick="cancelImportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide btn-lg" onclick="finishImageStage()">Apply &amp; Continue</button>
    `;
  }
}

function validateNewImageName(input) {
  const name = input.value.trim();
  const errorEl = document.getElementById("imgNewNameError");
  const existingImages = loadImages();
  const state = importWizardState;
  const imgIdx = state.conflictImages[state.conflictIdx];
  const importName = state.data.images[imgIdx].name;

  const existingConflict = existingImages.some(e => e.name === name && e.name !== importName);

  const otherDecisionsConflict = state.imageDecisions.some((d, i) => {
    if (i === imgIdx || !d) return false;
    if (d.action === "import") return state.data.images[i].name === name;
    if (d.action === "keepBoth") return d.renameTo === name;
    return false;
  });

  const conflict = existingConflict || otherDecisionsConflict;

  if (errorEl) {
    errorEl.style.display = (name && !conflict) ? "none" : "block";
  }
}

function toggleImageRenameInput() {
  const keepBoth = document.getElementById("imgKeepBoth");
  const input = document.getElementById("imgNewName");
  if (keepBoth && input) {
    input.disabled = !keepBoth.checked;
    if (keepBoth.checked) input.focus();
  }
}

function resolveImageConflict() {
  const state = importWizardState;
  const imgIdx = state.conflictImages[state.conflictIdx];
  const choice = document.querySelector('input[name="imgConflictChoice"]:checked');
  if (!choice) return;

  if (choice.value === "skip") {
    state.imageDecisions[imgIdx] = { action: "discard" };
  } else if (choice.value === "overwrite") {
    state.imageDecisions[imgIdx] = { action: "overwrite" };
  } else if (choice.value === "keepBoth") {
    const newName = document.getElementById("imgNewName").value.trim();
    const errorEl = document.getElementById("imgNewNameError");
    if (!newName || (errorEl && errorEl.style.display !== "none")) return;
    state.imageDecisions[imgIdx] = { action: "keepBoth", renameTo: newName };
    state.renameMap[imgIdx] = newName;
  }

  state.conflictIdx++;
  renderImportWizard();
}

function finishImageStage() {
  const state = importWizardState;
  const existingImages = loadImages();
  const renameMap = {};

  state.data.images.forEach((img, idx) => {
    const decision = state.imageDecisions[idx];
    if (!decision) return;

    if (decision.action === "import") {
      const newImg = { name: img.name, data: img.data };
      if (img.lineColor) newImg.lineColor = img.lineColor;
      if (img.fillColor) newImg.fillColor = img.fillColor;
      existingImages.push(newImg);
    } else if (decision.action === "overwrite") {
      const existing = existingImages.find(e => e.name === img.name);
      if (existing) {
        existing.data = img.data;
        if (img.lineColor || img.fillColor) {
          if (img.lineColor) existing.lineColor = img.lineColor;
          if (img.fillColor) existing.fillColor = img.fillColor;
        }
      }
    } else if (decision.action === "keepBoth") {
      const renamed = { name: decision.renameTo, data: img.data };
      if (img.lineColor) renamed.lineColor = img.lineColor;
      if (img.fillColor) renamed.fillColor = img.fillColor;
      existingImages.push(renamed);
      renameMap[img.name] = decision.renameTo;
    }
  });

  saveImages(existingImages);

  state.renameMapGlobal = renameMap;

  (state.data.categories || []).forEach(c => {
    if (c.image && renameMap[c.image]) c.image = renameMap[c.image];
  });
  (state.data.dates || []).forEach(d => {
    if (d.image && renameMap[d.image]) d.image = renameMap[d.image];
  });

  preprocessCategories();
  state.step = "categories";
  renderImportWizard();
}

function preprocessCategories() {
  const state = importWizardState;
  const existingCategories = loadCategories();
  const catStatus = [];
  const catDecisions = [];
  const catConflicts = [];

  (state.data.categories || []).forEach((cat, idx) => {
    const existing = existingCategories.find(e => e.name === cat.name);
    if (!existing) {
      catStatus[idx] = "autoImport";
      catDecisions[idx] = { action: "import" };
    } else if (existing.image === cat.image) {
      catStatus[idx] = "autoDiscard";
      catDecisions[idx] = { action: "discard" };
    } else {
      catStatus[idx] = "conflict";
      catConflicts.push(idx);
      catDecisions[idx] = null;
    }
  });

  state.catStatus = catStatus;
  state.catDecisions = catDecisions;
  state.catConflicts = catConflicts;
  state.catConflictIdx = 0;
  state.catRenameMap = {};
}

function renderCategoryStage(body, footer, title) {
  const state = importWizardState;
  const totalConflicts = state.catConflicts.length;

  if (state.catConflictIdx < totalConflicts) {
    const catIdx = state.catConflicts[state.catConflictIdx];
    const importCat = state.data.categories[catIdx];
    const existingCategories = loadCategories();
    const existingCat = existingCategories.find(e => e.name === importCat.name);
    const allImages = loadImages();

    const existingImg = existingCat && existingCat.image ? allImages.find(i => i.name === existingCat.image) : null;
    const importImg = importCat.image ? allImages.find(i => i.name === importCat.image) : null;

    title.textContent = `Category ${state.catConflictIdx + 1} of ${totalConflicts}`;

    body.innerHTML = `
      <p class="mb-3">A category with the name "<strong>${escapeHtml(importCat.name)}</strong>" already exists with a different image. Choose what to do:</p>
      <div class="row mb-3">
        <div class="col-6 text-center">
          <h6>Current Category</h6>
          <div class="fw-bold mb-1">${escapeHtml(existingCat ? existingCat.name : '')}</div>
          ${existingImg ? `<img src="${existingImg.data}" style="max-width:100%;max-height:100px;object-fit:contain" class="border rounded p-1">` : '<div class="text-secondary">No image</div>'}
          <div class="small mt-1 text-secondary">Image: ${existingCat && existingCat.image ? escapeHtml(existingCat.image) : 'None'}</div>
        </div>
        <div class="col-6 text-center">
          <h6>Imported Category</h6>
          <div class="fw-bold mb-1">${escapeHtml(importCat.name)}</div>
          ${importImg ? `<img src="${importImg.data}" style="max-width:100%;max-height:100px;object-fit:contain" class="border rounded p-1">` : '<div class="text-secondary">No image</div>'}
          <div class="small mt-1 text-secondary">Image: ${importCat.image ? escapeHtml(importCat.image) : 'None'}</div>
        </div>
      </div>
      <div class="mb-2">
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catSkip" value="skip" checked onchange="toggleCategoryRenameInput()">
          <label class="form-check-label" for="catSkip">Skip - don't import this category</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catOverwrite" value="overwrite" onchange="toggleCategoryRenameInput()">
          <label class="form-check-label" for="catOverwrite">Replace - overwrite the existing category with the imported one</label>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catKeepBoth" value="keepBoth" onchange="toggleCategoryRenameInput()">
          <label class="form-check-label" for="catKeepBoth">Keep Both - import with a different name:
            <input type="text" id="catNewName" class="form-control form-control-sm d-inline-block" style="width:auto;min-width:180px" value="${escapeHtml(importCat.name)}" disabled onclick="event.stopPropagation()" oninput="validateNewCategoryName(this)">
          </label>
          <div id="catNewNameError" class="text-danger small" style="display:none">ERROR: There is already a category with this name.</div>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide btn-lg" onclick="cancelImportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide btn-lg" onclick="resolveCategoryConflict()">Next</button>
    `;
  } else {
    const imported = state.catDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;
    const discarded = state.catDecisions.filter(d => d && d.action === "discard").length;
    const total = (state.data.categories || []).length;
    const autoImport = state.catStatus.filter(s => s === "autoImport").length;
    const autoDiscard = state.catStatus.filter(s => s === "autoDiscard").length;

    title.textContent = "Category Summary";

    body.innerHTML = `
      <p>Category processing complete.</p>
      <ul>
        <li>${autoImport} new categor(ies) - will be imported</li>
        <li>${autoDiscard} duplicate(s) - will be skipped</li>
        ${state.catConflicts.length > 0 ? `<li>${state.catConflicts.length} conflict(s) resolved: ${imported - autoImport} to import, ${discarded - autoDiscard} skipped</li>` : ''}
      </ul>
      <p class="text-secondary">Total: ${total} categor(ies) in import.</p>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide btn-lg" onclick="cancelImportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide btn-lg" onclick="finishCategoryStage()">Apply &amp; Continue</button>
    `;
  }
}

function toggleCategoryRenameInput() {
  const keepBoth = document.getElementById("catKeepBoth");
  const input = document.getElementById("catNewName");
  if (keepBoth && input) {
    input.disabled = !keepBoth.checked;
    if (keepBoth.checked) input.focus();
  }
}

function validateNewCategoryName(input) {
  const name = input.value.trim();
  const errorEl = document.getElementById("catNewNameError");
  const existingCategories = loadCategories();
  const state = importWizardState;
  const catIdx = state.catConflicts[state.catConflictIdx];
  const importName = state.data.categories[catIdx].name;

  const existingConflict = existingCategories.some(e => e.name === name && e.name !== importName);

  const otherDecisionsConflict = state.catDecisions.some((d, i) => {
    if (i === catIdx || !d) return false;
    if (d.action === "import") return state.data.categories[i].name === name;
    if (d.action === "keepBoth") return d.renameTo === name;
    return false;
  });

  const conflict = existingConflict || otherDecisionsConflict;

  if (errorEl) {
    errorEl.style.display = (name && !conflict) ? "none" : "block";
  }
}

function resolveCategoryConflict() {
  const state = importWizardState;
  const catIdx = state.catConflicts[state.catConflictIdx];
  const choice = document.querySelector('input[name="catConflictChoice"]:checked');
  if (!choice) return;

  if (choice.value === "skip") {
    state.catDecisions[catIdx] = { action: "discard" };
  } else if (choice.value === "overwrite") {
    state.catDecisions[catIdx] = { action: "overwrite" };
  } else if (choice.value === "keepBoth") {
    const newName = document.getElementById("catNewName").value.trim();
    const errorEl = document.getElementById("catNewNameError");
    if (!newName || (errorEl && errorEl.style.display !== "none")) return;
    state.catDecisions[catIdx] = { action: "keepBoth", renameTo: newName };
    state.catRenameMap[catIdx] = newName;
  }

  state.catConflictIdx++;
  renderImportWizard();
}

function finishCategoryStage() {
  const state = importWizardState;
  const existingCategories = loadCategories();
  const catRenameMap = {};

  (state.data.categories || []).forEach((cat, idx) => {
    const decision = state.catDecisions[idx];
    if (!decision) return;

    if (decision.action === "import") {
      existingCategories.push({ name: cat.name, image: cat.image || null });
    } else if (decision.action === "overwrite") {
      const existing = existingCategories.find(e => e.name === cat.name);
      if (existing) {
        existing.image = cat.image || null;
      }
    } else if (decision.action === "keepBoth") {
      existingCategories.push({ name: decision.renameTo, image: cat.image || null });
      catRenameMap[cat.name] = decision.renameTo;
    }
  });

  saveCategories(existingCategories);

  state.catRenameMapGlobal = catRenameMap;

  (state.data.dates || []).forEach(d => {
    if (d.category && catRenameMap[d.category]) d.category = catRenameMap[d.category];
  });

  state.step = "complete";
  renderImportWizard();
}

function renderComplete(body, footer, title) {
  const state = importWizardState;
  const totalImages = state.data.images.length;
  const importedImages = state.imageDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;
  const totalCats = (state.data.categories || []).length;
  const importedCats = state.catDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;

  title.textContent = "Import Complete";

  body.innerHTML = `
    <p>Import complete!</p>
    <ul>
      <li>${importedImages} of ${totalImages} image(s) imported</li>
      <li>${importedCats} of ${totalCats} categor(ies) imported</li>
    </ul>
  `;

  footer.innerHTML = `
    <button class="btn btn-success editor-btn btn-wide btn-lg" onclick="closeImportWizard()">Close</button>
  `;
}

function closeImportWizard() {
  importWizardState = null;
  document.getElementById("importWizardModal").classList.add("d-none");
  hideAllEditors();
  renderCountdowns();
}
