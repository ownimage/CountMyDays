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
  } else if (state.step === "dates") {
    renderDateStage(body, footer, title);
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
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgSkip" value="skip" checked onchange="toggleImageRenameInput();toggleImageUseExisting()">
          <label class="form-check-label" for="imgSkip">Skip - don't import this image</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgOverwrite" value="overwrite" onchange="toggleImageRenameInput();toggleImageUseExisting()">
          <label class="form-check-label" for="imgOverwrite">Replace - overwrite the existing image with the imported one</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgKeepBoth" value="keepBoth" onchange="toggleImageRenameInput();toggleImageUseExisting()">
          <label class="form-check-label" for="imgKeepBoth">
            <span style="display:inline-block;min-width:290px">Keep Both - import with a different name:</span>
            <input type="text" id="imgNewName" class="form-control form-control-sm d-inline-block" style="width:auto;min-width:240px" value="${escapeHtml(importImg.name)}" disabled onclick="event.stopPropagation()" oninput="validateNewImageName(this)">
          </label>
          <div class="text-danger small" style="display:none;margin-left:308px" id="imgNewNameError">ERROR: There is already an image with this name.</div>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="imgConflictChoice" id="imgUseExisting" value="useExisting" onchange="toggleImageRenameInput();toggleImageUseExisting()">
          <label class="form-check-label" for="imgUseExisting">
            <span style="display:inline-block;min-width:290px">Use Existing - map import to existing image:</span>
            <span class="dropdown d-inline-block" id="imgExistingDropdown">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" disabled id="imgExistingBtn">
                Select image
              </button>
              <ul class="dropdown-menu" id="imgExistingMenu">
                ${existingImages.filter(e => e.name !== importImg.name).sort((a, b) => a.name.localeCompare(b.name)).map(e => `
                  <li><a class="dropdown-item" href="#" data-name="${escapeHtml(e.name)}" onclick="selectExistingImage(this); return false;">
                    ${e.data ? `<img src="${e.data}" style="width:20px;height:20px;object-fit:contain;margin-right:6px">` : `<span style="display:inline-block;width:20px;height:20px;margin-right:6px"></span>`}
                    ${escapeHtml(e.name)}
                  </a></li>
                `).join("")}
              </ul>
            </span>
          </label>
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

function toggleImageUseExisting() {
  const useExisting = document.getElementById("imgUseExisting");
  const btn = document.getElementById("imgExistingBtn");
  if (useExisting && btn) {
    btn.disabled = !useExisting.checked;
  }
}

function selectExistingImage(link) {
  const name = link.getAttribute("data-name");
  const btn = document.getElementById("imgExistingBtn");
  if (btn) {
    btn.innerHTML = link.innerHTML;
    btn.setAttribute("data-selected", name);
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
    applyImageRename(state.data.images[imgIdx].name, newName);
  } else if (choice.value === "useExisting") {
    const btn = document.getElementById("imgExistingBtn");
    const replaceWith = btn ? btn.getAttribute("data-selected") : "";
    if (!replaceWith) return;
    state.imageDecisions[imgIdx] = { action: "useExisting", replaceWith: replaceWith };
    state.renameMap[imgIdx] = replaceWith;
    applyImageRename(state.data.images[imgIdx].name, replaceWith);
  }

  state.conflictIdx++;
  renderImportWizard();
}

function applyImageRename(oldName, newName) {
  const state = importWizardState;
  (state.data.categories || []).forEach(c => {
    if (c.image === oldName) c.image = newName;
  });
  (state.data.dates || []).forEach(d => {
    if (d.image === oldName) d.image = newName;
  });
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
    } else if (decision.action === "useExisting") {
      renameMap[img.name] = decision.replaceWith;
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
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catSkip" value="skip" checked onchange="toggleCategoryRenameInput();toggleCategoryUseExisting()">
          <label class="form-check-label" for="catSkip">Skip - don't import this category</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catOverwrite" value="overwrite" onchange="toggleCategoryRenameInput();toggleCategoryUseExisting()">
          <label class="form-check-label" for="catOverwrite">Replace - overwrite the existing category with the imported one</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catKeepBoth" value="keepBoth" onchange="toggleCategoryRenameInput();toggleCategoryUseExisting()">
          <label class="form-check-label" for="catKeepBoth">
            <span style="display:inline-block;min-width:290px">Keep Both - import with a different name:</span>
            <input type="text" id="catNewName" class="form-control form-control-sm d-inline-block" style="width:auto;min-width:240px" value="${escapeHtml(importCat.name)}" disabled onclick="event.stopPropagation()" oninput="validateNewCategoryName(this)">
          </label>
          <div class="text-danger small" style="display:none;margin-left:308px" id="catNewNameError">ERROR: There is already a category with this name.</div>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="catConflictChoice" id="catUseExisting" value="useExisting" onchange="toggleCategoryRenameInput();toggleCategoryUseExisting()">
          <label class="form-check-label" for="catUseExisting">
            <span style="display:inline-block;min-width:290px">Use Existing - map import to existing category:</span>
            <span class="dropdown d-inline-block" id="catExistingDropdown">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" disabled id="catExistingBtn">
                Select category
              </button>
              <ul class="dropdown-menu" id="catExistingMenu">
                ${existingCategories.filter(e => e.name !== importCat.name).sort((a, b) => a.name.localeCompare(b.name)).map(e => {
                  const eImg = e.image ? allImages.find(i => i.name === e.image) : null;
                  return `
                  <li><a class="dropdown-item" href="#" data-name="${escapeHtml(e.name)}" onclick="selectExistingCategory(this); return false;">
                    ${eImg ? `<img src="${eImg.data}" style="width:20px;height:20px;object-fit:contain;margin-right:6px">` : `<span style="display:inline-block;width:20px;height:20px;margin-right:6px"></span>`}
                    ${escapeHtml(e.name)}
                  </a></li>`;
                }).join("")}
              </ul>
            </span>
          </label>
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

function toggleCategoryUseExisting() {
  const choice = document.querySelector('input[name="catConflictChoice"]:checked');
  const btn = document.getElementById("catExistingBtn");
  if (btn) btn.disabled = !choice || choice.value !== "useExisting";
}

function selectExistingCategory(el) {
  document.getElementById("catExistingBtn").innerHTML = el.getAttribute("data-name");
  document.getElementById("catExistingBtn").dataset.selected = el.getAttribute("data-name");
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
  } else if (choice.value === "useExisting") {
    const selected = document.getElementById("catExistingBtn").dataset.selected;
    if (!selected) return;
    state.catDecisions[catIdx] = { action: "useExisting", useExisting: selected };
    state.catRenameMap[catIdx] = selected;
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
    } else if (decision.action === "useExisting") {
      catRenameMap[cat.name] = decision.useExisting;
    }
  });

  saveCategories(existingCategories);

  state.catRenameMapGlobal = catRenameMap;

  (state.data.dates || []).forEach(d => {
    if (d.category && catRenameMap[d.category]) d.category = catRenameMap[d.category];
  });

  preprocessDates();
  state.step = "dates";
  renderImportWizard();
}

function datesEqual(a, b) {
  if (a.type !== b.type) return false;
  if (a.day !== b.day) return false;
  if (a.month !== b.month) return false;
  if (a.type === "once" && a.year !== b.year) return false;
  if ((a.category || "") !== (b.category || "")) return false;
  if ((a.image || "") !== (b.image || "")) return false;
  return true;
}

function formatDateShort(d) {
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  if (d.type === "once") {
    return `${d.day} ${months[(d.month||1)-1]} ${d.year}`;
  }
  return `${d.day} ${months[(d.month||1)-1]}`;
}

function preprocessDates() {
  const state = importWizardState;
  const existingDates = loadDates();
  const dateStatus = [];
  const dateDecisions = [];
  const dateConflicts = [];

  (state.data.dates || []).forEach((d, idx) => {
    const existing = existingDates.filter(e => e.name === d.name);
    if (existing.length === 0) {
      dateStatus[idx] = "autoImport";
      dateDecisions[idx] = { action: "import" };
    } else if (existing.some(e => datesEqual(d, e))) {
      dateStatus[idx] = "autoDiscard";
      dateDecisions[idx] = { action: "discard" };
    } else {
      dateStatus[idx] = "conflict";
      dateConflicts.push(idx);
      dateDecisions[idx] = null;
    }
  });

  state.dateStatus = dateStatus;
  state.dateDecisions = dateDecisions;
  state.dateConflicts = dateConflicts;
  state.dateConflictIdx = 0;
  state.dateRenameMap = {};
}

function renderDateStage(body, footer, title) {
  const state = importWizardState;
  const totalConflicts = state.dateConflicts.length;

  if (state.dateConflictIdx < totalConflicts) {
    const dIdx = state.dateConflicts[state.dateConflictIdx];
    const importDate = state.data.dates[dIdx];
    const existingDates = loadDates();
    const existingSameName = existingDates.filter(e => e.name === importDate.name);
    const images = loadImages();
    const categories = loadCategories();

    const existingPick = existingSameName[0];

    function catImg(name) {
      const cat = categories.find(c => c.name === name);
      if (!cat || !cat.image) return null;
      const img = images.find(i => i.name === cat.image);
      return img ? img.data : null;
    }
    function dateImg(name) {
      if (!name) return null;
      const img = images.find(i => i.name === name);
      return img ? img.data : null;
    }

    title.textContent = `Date ${state.dateConflictIdx + 1} of ${totalConflicts}`;

    body.innerHTML = `
      <p class="mb-3">A date with the title "<strong>${escapeHtml(importDate.name)}</strong>" already exists but the details are different. Choose what to do:</p>
      <div class="row mb-3">
        <div class="col-6 text-center">
          <h6>Current Date</h6>
          <div class="fw-bold mb-1">${escapeHtml(existingPick ? existingPick.name : '')}</div>
          <div>${existingPick ? formatDateShort(existingPick) : ''}</div>
          ${existingPick ? `<div class="small text-secondary">${existingPick.type}</div>` : ''}
          <div class="d-flex justify-content-center gap-2 mt-2">
            <div>
              ${catImg(existingPick.category) ? `<img src="${catImg(existingPick.category)}" style="width:32px;height:32px;object-fit:contain" class="border rounded p-1">` : '<div style="width:32px;height:32px" class="border rounded d-flex align-items-center justify-content-center text-secondary small">No cat</div>'}
              <div class="small mt-1 text-secondary">${escapeHtml(existingPick.category || 'None')}</div>
            </div>
            <div>
              ${dateImg(existingPick.image) ? `<img src="${dateImg(existingPick.image)}" style="width:32px;height:32px;object-fit:contain" class="border rounded p-1">` : '<div style="width:32px;height:32px" class="border rounded d-flex align-items-center justify-content-center text-secondary small">No img</div>'}
            </div>
          </div>
        </div>
        <div class="col-6 text-center">
          <h6>Imported Date</h6>
          <div class="fw-bold mb-1">${escapeHtml(importDate.name)}</div>
          <div>${formatDateShort(importDate)}</div>
          <div class="small text-secondary">${importDate.type}</div>
          <div class="d-flex justify-content-center gap-2 mt-2">
            <div>
              ${catImg(importDate.category) ? `<img src="${catImg(importDate.category)}" style="width:32px;height:32px;object-fit:contain" class="border rounded p-1">` : '<div style="width:32px;height:32px" class="border rounded d-flex align-items-center justify-content-center text-secondary small">No cat</div>'}
              <div class="small mt-1 text-secondary">${escapeHtml(importDate.category || 'None')}</div>
            </div>
            <div>
              ${dateImg(importDate.image) ? `<img src="${dateImg(importDate.image)}" style="width:32px;height:32px;object-fit:contain" class="border rounded p-1">` : '<div style="width:32px;height:32px" class="border rounded d-flex align-items-center justify-content-center text-secondary small">No img</div>'}
            </div>
          </div>
        </div>
      </div>
      <div class="mb-2">
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="dateConflictChoice" id="dateSkip" value="skip" checked onchange="toggleDateRenameInput();toggleDateUseExisting()">
          <label class="form-check-label" for="dateSkip">Skip - don't import this date</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="dateConflictChoice" id="dateOverwrite" value="overwrite" onchange="toggleDateRenameInput();toggleDateUseExisting()">
          <label class="form-check-label" for="dateOverwrite">Replace - overwrite the existing date with the imported one</label>
        </div>
        <div class="form-check mb-2">
          <input class="form-check-input" type="radio" name="dateConflictChoice" id="dateKeepBoth" value="keepBoth" onchange="toggleDateRenameInput();toggleDateUseExisting()">
          <label class="form-check-label" for="dateKeepBoth">
            <span style="display:inline-block;min-width:290px">Keep Both - import with a different name:</span>
            <input type="text" id="dateNewName" class="form-control form-control-sm d-inline-block" style="width:auto;min-width:240px" value="${escapeHtml(importDate.name)}" disabled onclick="event.stopPropagation()" oninput="validateNewDateName(this)">
          </label>
          <div class="text-danger small" style="display:none;margin-left:308px" id="dateNewNameError">ERROR: There is already a date with this name.</div>
        </div>
        <div class="form-check">
          <input class="form-check-input" type="radio" name="dateConflictChoice" id="dateUseExisting" value="useExisting" onchange="toggleDateRenameInput();toggleDateUseExisting()">
          <label class="form-check-label" for="dateUseExisting">
            <span style="display:inline-block;min-width:290px">Use Existing - skip import, keep existing:</span>
            <span class="dropdown d-inline-block" id="dateExistingDropdown">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" disabled id="dateExistingBtn">
                Select date
              </button>
              <ul class="dropdown-menu" id="dateExistingMenu">
                ${existingDates.slice().sort((a, b) => a.name.localeCompare(b.name)).map(e => {
                  const eCatImg = catImg(e.category);
                  const eDateImg = dateImg(e.image);
                  return `
                  <li><a class="dropdown-item" href="#" data-name="${escapeHtml(e.name)}" onclick="selectExistingDate(this); return false;">
                    <span style="display:inline-flex;align-items:center;gap:4px">
                      ${eCatImg ? `<img src="${eCatImg}" style="width:20px;height:20px;object-fit:contain">` : '<span style="display:inline-block;width:20px;height:20px"></span>'}
                      ${eDateImg ? `<img src="${eDateImg}" style="width:20px;height:20px;object-fit:contain">` : '<span style="display:inline-block;width:20px;height:20px"></span>'}
                      <span>${escapeHtml(e.name)}</span>
                      <span class="text-muted small">${formatDateShort(e)}</span>
                      <span class="text-muted small">${escapeHtml(e.category || '')}</span>
                    </span>
                  </a></li>`;
                }).join("")}
              </ul>
            </span>
          </label>
        </div>
      </div>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide btn-lg" onclick="cancelImportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide btn-lg" onclick="resolveDateConflict()">Next</button>
    `;
  } else {
    const imported = state.dateDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;
    const discarded = state.dateDecisions.filter(d => d && d.action === "discard").length;
    const total = (state.data.dates || []).length;
    const autoImport = state.dateStatus.filter(s => s === "autoImport").length;
    const autoDiscard = state.dateStatus.filter(s => s === "autoDiscard").length;

    title.textContent = "Date Summary";

    body.innerHTML = `
      <p>Date processing complete.</p>
      <ul>
        <li>${autoImport} new date(s) - will be imported</li>
        <li>${autoDiscard} duplicate(s) - will be skipped</li>
        ${state.dateConflicts.length > 0 ? `<li>${state.dateConflicts.length} conflict(s) resolved</li>` : ''}
      </ul>
      <p class="text-secondary">Total: ${total} date(s) in import.</p>
    `;

    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide btn-lg" onclick="cancelImportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide btn-lg" onclick="finishDateStage()">Apply &amp; Continue</button>
    `;
  }
}

function toggleDateRenameInput() {
  const keepBoth = document.getElementById("dateKeepBoth");
  const input = document.getElementById("dateNewName");
  if (keepBoth && input) {
    input.disabled = !keepBoth.checked;
    if (keepBoth.checked) input.focus();
  }
}

function toggleDateUseExisting() {
  const choice = document.querySelector('input[name="dateConflictChoice"]:checked');
  const btn = document.getElementById("dateExistingBtn");
  if (btn) btn.disabled = !choice || choice.value !== "useExisting";
}

function selectExistingDate(el) {
  document.getElementById("dateExistingBtn").innerHTML = el.getAttribute("data-name");
  document.getElementById("dateExistingBtn").dataset.selected = el.getAttribute("data-name");
}

function validateNewDateName(input) {
  const name = input.value.trim();
  const errorEl = document.getElementById("dateNewNameError");
  const existingDates = loadDates();
  const state = importWizardState;
  const dIdx = state.dateConflicts[state.dateConflictIdx];
  const importName = state.data.dates[dIdx].name;

  const existingConflict = existingDates.some(e => e.name === name && e.name !== importName);

  const otherDecisionsConflict = state.dateDecisions.some((d, i) => {
    if (i === dIdx || !d) return false;
    if (d.action === "import") return state.data.dates[i].name === name;
    if (d.action === "keepBoth") return d.renameTo === name;
    return false;
  });

  const conflict = existingConflict || otherDecisionsConflict;

  if (errorEl) {
    errorEl.style.display = (name && !conflict) ? "none" : "block";
  }
}

function resolveDateConflict() {
  const state = importWizardState;
  const dIdx = state.dateConflicts[state.dateConflictIdx];
  const choice = document.querySelector('input[name="dateConflictChoice"]:checked');
  if (!choice) return;

  if (choice.value === "skip") {
    state.dateDecisions[dIdx] = { action: "discard" };
  } else if (choice.value === "overwrite") {
    state.dateDecisions[dIdx] = { action: "overwrite" };
  } else if (choice.value === "keepBoth") {
    const newName = document.getElementById("dateNewName").value.trim();
    const errorEl = document.getElementById("dateNewNameError");
    if (!newName || (errorEl && errorEl.style.display !== "none")) return;
    state.dateDecisions[dIdx] = { action: "keepBoth", renameTo: newName };
  } else if (choice.value === "useExisting") {
    const btn = document.getElementById("dateExistingBtn");
    const selected = btn ? btn.getAttribute("data-selected") : "";
    if (!selected) return;
    state.dateDecisions[dIdx] = { action: "discard" };
  }

  state.dateConflictIdx++;
  renderImportWizard();
}

function finishDateStage() {
  const state = importWizardState;
  const existingDates = loadDates();

  (state.data.dates || []).forEach((d, idx) => {
    const decision = state.dateDecisions[idx];
    if (!decision) return;

    if (decision.action === "import") {
      existingDates.push({ ...d });
    } else if (decision.action === "overwrite") {
      const existing = existingDates.find(e => e.name === d.name);
      if (existing) {
        existing.type = d.type;
        existing.day = d.day;
        existing.month = d.month;
        if (d.type === "once") existing.year = d.year;
        existing.category = d.category || null;
        existing.image = d.image || null;
      }
    } else if (decision.action === "keepBoth") {
      const copy = { ...d, name: decision.renameTo };
      existingDates.push(copy);
    }
  });

  saveDates(existingDates);

  state.step = "complete";
  renderImportWizard();
}

function renderComplete(body, footer, title) {
  const state = importWizardState;
  const totalImages = state.data.images.length;
  const importedImages = state.imageDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;
  const totalCats = (state.data.categories || []).length;
  const importedCats = state.catDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;
  const totalDates = (state.data.dates || []).length;
  const importedDates = state.dateDecisions.filter(d => d && (d.action === "import" || d.action === "overwrite" || d.action === "keepBoth")).length;

  title.textContent = "Import Complete";

  body.innerHTML = `
    <p>Import complete!</p>
    <ul>
      <li>${importedImages} of ${totalImages} image(s) imported</li>
      <li>${importedCats} of ${totalCats} categor(ies) imported</li>
      <li>${importedDates} of ${totalDates} date(s) imported</li>
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
