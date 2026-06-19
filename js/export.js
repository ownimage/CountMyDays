let ew = null;

function exportData() {
  startExportWizard("json");
}

function exportToQR() {
  startExportWizard("qr");
}

function startExportWizard(type) {
  ew = {
    type: type,
    step: "main",
    backStack: [],
    datesCascade: false,
    datesChoice: "all",
    selectedDateIndices: [],
    dateFilterCategory: "",
    dateFilterName: "",
    categoriesCascade: true,
    categoriesChoice: "all",
    selectedCategoryIndices: [],
    imagesChoice: "all",
    selectedImageIndices: []
  };
  document.getElementById("exportWizardModal").classList.remove("d-none");
  renderExportWizard();
}

function cancelExportWizard() {
  ew = null;
  document.getElementById("exportWizardModal").classList.add("d-none");
}

function renderExportWizard() {
  const body = document.getElementById("exportWizardBody");
  const footer = document.getElementById("exportWizardFooter");
  const title = document.getElementById("exportWizardTitle");

  if (ew.step === "main") {
    title.textContent = "Export Wizard";
    body.innerHTML = `
      <p class="mb-3">Choose what to export:</p>
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewScope" id="ewAll" value="all" checked>
        <label class="form-check-label" for="ewAll">Export everything</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="ewScope" id="ewPartial" value="partial">
        <label class="form-check-label" for="ewPartial">Select specific items</label>
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="cancelExportWizard()">Cancel</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Next</button>
    `;
  } else if (ew.step === "dates1") {
    title.textContent = "Export Dates";
    const showCascade = ew.datesChoice === "all" || ew.datesChoice === "specific";
    body.innerHTML = `
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewDatesChoice" id="ewDatesAll" value="all" ${ew.datesChoice === "all" ? "checked" : ""} onchange="toggleDatesCascade()">
        <label class="form-check-label" for="ewDatesAll">All dates</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewDatesChoice" id="ewDatesNone" value="none" ${ew.datesChoice === "none" ? "checked" : ""} onchange="toggleDatesCascade()">
        <label class="form-check-label" for="ewDatesNone">None</label>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="ewDatesChoice" id="ewDatesSpecific" value="specific" ${ew.datesChoice === "specific" ? "checked" : ""} onchange="toggleDatesCascade()">
        <label class="form-check-label" for="ewDatesSpecific">Select specific dates</label>
      </div>
      <div class="form-check" id="ewDatesCascadeWrapper" style="display:${showCascade ? 'block' : 'none'}">
        <input class="form-check-input" type="checkbox" id="ewDatesCascade" ${ew.datesCascade ? "checked" : ""}>
        <label class="form-check-label" for="ewDatesCascade">Cascade: include related categories and images</label>
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="exportWizardBack()">Back</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Next</button>
    `;
  } else if (ew.step === "dates2") {
    title.textContent = "Select Dates";
    const allDates = loadDates();
    const categories = loadCategories();
    const images = loadImages();
    const catNames = [...new Set(allDates.map(d => d.category).filter(Boolean))];
    const filtered = allDates.filter(d => {
      if (ew.dateFilterCategory && d.category !== ew.dateFilterCategory) return false;
      if (ew.dateFilterName && !d.name.toLowerCase().includes(ew.dateFilterName.toLowerCase())) return false;
      return true;
    });
    const withDate = filtered
      .map((d, i) => ({ ...d, index: allDates.indexOf(d), target: targetDate(d) }))
      .sort((a, b) => a.target - b.target);
    body.innerHTML = `
      <div class="d-flex gap-2 align-items-center mb-3">
        <select class="form-select" style="width:auto;min-width:160px" onchange="ew.dateFilterCategory=this.value;renderExportWizard()">
          <option value="">All</option>
          ${catNames.map(c => `<option value="${c}" ${ew.dateFilterCategory === c ? 'selected' : ''}>${escapeHtml(c)}</option>`).join("")}
        </select>
        <input class="form-control" type="search" placeholder="Search date names..." value="${escapeHtml(ew.dateFilterName)}" oninput="ew.dateFilterName=this.value;renderExportWizard()">
      </div>
      ${withDate.map(item => {
        const category = categories.find(c => c.name === item.category);
        const imgName = category ? category.image : null;
        const img = images.find(i => i.name === imgName);
        const imgSrc = img ? img.data : "";
        return `
        <div class="d-flex align-items-center gap-2 mb-2">
          ${imgSrc ? `<img src="${imgSrc}" style="width:32px;height:32px;object-fit:contain">` : `<div style="width:32px;height:32px" class="text-secondary d-flex align-items-center justify-content-center">No img</div>`}
          <div class="form-check mb-0">
            <input class="form-check-input ew-date-cb" type="checkbox" value="${item.index}" data-index="${item.index}" ${ew.selectedDateIndices.includes(item.index) ? "checked" : ""}>
            <label class="form-check-label">${escapeHtml(item.name)} — ${formatDate(item.target)} — ${escapeHtml(item.category || "No category")}</label>
          </div>
        </div>`;
      }).join("")}
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="exportWizardBack()">Back</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Next</button>
    `;
  } else if (ew.step === "categories1") {
    title.textContent = "Export Categories";
    const showCatsCascade = ew.categoriesChoice === "all" || ew.categoriesChoice === "specific";
    body.innerHTML = `
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewCategoriesChoice" id="ewCatsAll" value="all" ${ew.categoriesChoice === "all" ? "checked" : ""} onchange="toggleCategoriesCascade()">
        <label class="form-check-label" for="ewCatsAll">All categories</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewCategoriesChoice" id="ewCatsNone" value="none" ${ew.categoriesChoice === "none" ? "checked" : ""} onchange="toggleCategoriesCascade()">
        <label class="form-check-label" for="ewCatsNone">None</label>
      </div>
      <div class="form-check mb-3">
        <input class="form-check-input" type="radio" name="ewCategoriesChoice" id="ewCatsSpecific" value="specific" ${ew.categoriesChoice === "specific" ? "checked" : ""} onchange="toggleCategoriesCascade()">
        <label class="form-check-label" for="ewCatsSpecific">Select specific categories</label>
      </div>
      <div class="form-check" id="ewCategoriesCascadeWrapper" style="display:${showCatsCascade ? 'block' : 'none'}">
        <input class="form-check-input" type="checkbox" id="ewCategoriesCascade" ${ew.categoriesCascade ? "checked" : ""}>
        <label class="form-check-label" for="ewCategoriesCascade">Cascade: include related images</label>
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="exportWizardBack()">Back</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Next</button>
    `;
  } else if (ew.step === "categories2") {
    title.textContent = "Select Categories";
    const categories = loadCategories();
    body.innerHTML = `
      <p class="mb-2">Choose which categories to export:</p>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="ewCatsToggleAll" onchange="ewCatsToggleAll(this.checked)">
        <label class="form-check-label" for="ewCatsToggleAll"><strong>Select all</strong></label>
      </div>
      ${categories.map((c, i) => `
        <div class="form-check">
          <input class="form-check-input ew-cat-cb" type="checkbox" value="${i}" data-index="${i}" ${ew.selectedCategoryIndices.includes(i) ? "checked" : ""}>
          <label class="form-check-label">${escapeHtml(c.name)}</label>
        </div>
      `).join("")}
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="exportWizardBack()">Back</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Next</button>
    `;
  } else if (ew.step === "images1") {
    title.textContent = "Export Images";
    body.innerHTML = `
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewImagesChoice" id="ewImgsAll" value="all" ${ew.imagesChoice === "all" ? "checked" : ""}>
        <label class="form-check-label" for="ewImgsAll">All images</label>
      </div>
      <div class="form-check mb-2">
        <input class="form-check-input" type="radio" name="ewImagesChoice" id="ewImgsNone" value="none" ${ew.imagesChoice === "none" ? "checked" : ""}>
        <label class="form-check-label" for="ewImgsNone">None</label>
      </div>
      <div class="form-check">
        <input class="form-check-input" type="radio" name="ewImagesChoice" id="ewImgsSpecific" value="specific" ${ew.imagesChoice === "specific" ? "checked" : ""}>
        <label class="form-check-label" for="ewImgsSpecific">Select specific images</label>
      </div>
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="exportWizardBack()">Back</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Next</button>
    `;
  } else if (ew.step === "images2") {
    title.textContent = "Select Images";
    const images = loadImages();
    body.innerHTML = `
      <p class="mb-2">Choose which images to export:</p>
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="ewImgsToggleAll" onchange="ewImgsToggleAll(this.checked)">
        <label class="form-check-label" for="ewImgsToggleAll"><strong>Select all</strong></label>
      </div>
      ${images.map((img, i) => `
        <div class="form-check">
          <input class="form-check-input ew-img-cb" type="checkbox" value="${i}" data-index="${i}" ${ew.selectedImageIndices.includes(i) ? "checked" : ""}>
          <label class="form-check-label">${escapeHtml(img.name)}</label>
        </div>
      `).join("")}
    `;
    footer.innerHTML = `
      <button class="btn btn-secondary editor-btn btn-wide" onclick="exportWizardBack()">Back</button>
      <button class="btn btn-primary editor-btn btn-wide" onclick="exportWizardNext()">Export</button>
    `;
  }
}

function ewReadForm() {
  if (ew.step === "main") {
    const sel = document.querySelector('input[name="ewScope"]:checked');
    if (sel) ew.scope = sel.value;
  } else if (ew.step === "dates1") {
    ew.datesCascade = document.getElementById("ewDatesCascade").checked;
    const sel = document.querySelector('input[name="ewDatesChoice"]:checked');
    if (sel) ew.datesChoice = sel.value;
  } else if (ew.step === "dates2") {
    const cbs = document.querySelectorAll(".ew-date-cb:checked");
    ew.selectedDateIndices = Array.from(cbs).map(cb => parseInt(cb.value));
  } else if (ew.step === "categories1") {
    const sel = document.querySelector('input[name="ewCategoriesChoice"]:checked');
    if (sel) ew.categoriesChoice = sel.value;
    ew.categoriesCascade = document.getElementById("ewCategoriesCascade").checked;
  } else if (ew.step === "categories2") {
    const cbs = document.querySelectorAll(".ew-cat-cb:checked");
    ew.selectedCategoryIndices = Array.from(cbs).map(cb => parseInt(cb.value));
  } else if (ew.step === "images1") {
    const sel = document.querySelector('input[name="ewImagesChoice"]:checked');
    if (sel) ew.imagesChoice = sel.value;
  } else if (ew.step === "images2") {
    const cbs = document.querySelectorAll(".ew-img-cb:checked");
    ew.selectedImageIndices = Array.from(cbs).map(cb => parseInt(cb.value));
  }
}

function getNextStep() {
  if (ew.step === "main") {
    return ew.scope === "partial" ? "dates1" : null;
  }
  if (ew.step === "dates1") {
    return ew.datesChoice === "specific" ? "dates2" : "categories1";
  }
  if (ew.step === "dates2") return "categories1";
  if (ew.step === "categories1") {
    return ew.categoriesChoice === "specific" ? "categories2" : "images1";
  }
  if (ew.step === "categories2") return "images1";
  if (ew.step === "images1") {
    return ew.imagesChoice === "specific" ? "images2" : null;
  }
  if (ew.step === "images2") return null;
  return null;
}

function exportWizardNext() {
  ewReadForm();
  const next = getNextStep();
  if (next) {
    ew.backStack.push(ew.step);
    ew.step = next;
    renderExportWizard();
  } else {
    finishExportWizard();
  }
}

function exportWizardBack() {
  if (ew.backStack.length > 0) {
    ew.step = ew.backStack.pop();
    renderExportWizard();
  }
}

function toggleDatesCascade() {
  const wrapper = document.getElementById("ewDatesCascadeWrapper");
  const all = document.getElementById("ewDatesAll");
  const specific = document.getElementById("ewDatesSpecific");
  if (!wrapper || !all || !specific) return;
  wrapper.style.display = (all.checked || specific.checked) ? "block" : "none";
}

function toggleCategoriesCascade() {
  const wrapper = document.getElementById("ewCategoriesCascadeWrapper");
  const all = document.getElementById("ewCatsAll");
  const specific = document.getElementById("ewCatsSpecific");
  if (!wrapper || !all || !specific) return;
  wrapper.style.display = (all.checked || specific.checked) ? "block" : "none";
}

function ewDatesToggleAll(checked) {
  document.querySelectorAll(".ew-date-cb").forEach(cb => cb.checked = checked);
}

function ewCatsToggleAll(checked) {
  document.querySelectorAll(".ew-cat-cb").forEach(cb => cb.checked = checked);
}

function ewImgsToggleAll(checked) {
  document.querySelectorAll(".ew-img-cb").forEach(cb => cb.checked = checked);
}

function finishExportWizard() {
  ewReadForm();
  const data = buildExportData();
  document.getElementById("exportWizardModal").classList.add("d-none");
  if (ew.type === "json") {
    doJSONExport(data);
  } else {
    doQRExport(data);
  }
  ew = null;
}

function buildExportData() {
  if (!ew || ew.scope === "all") {
    return {
      dates: loadDates(),
      categories: loadCategories(),
      images: loadImages()
    };
  }

  let resultDates = [];
  let resultCategories = [];
  let resultImages = [];

  if (ew.datesChoice === "all") {
    resultDates = loadDates();
  } else if (ew.datesChoice === "specific") {
    const allDates = loadDates();
    resultDates = ew.selectedDateIndices.map(i => allDates[i]).filter(Boolean);
  }

  if (ew.datesCascade && resultDates.length > 0) {
    const allCats = loadCategories();
    const allImgs = loadImages();
    const usedCatNames = new Set(resultDates.map(d => d.category).filter(Boolean));
    resultCategories = allCats.filter(c => usedCatNames.has(c.name));
    const usedImgNames = new Set(resultCategories.map(c => c.image).filter(Boolean));
    resultImages = allImgs.filter(i => usedImgNames.has(i.name));
  }

  if (ew.categoriesChoice === "all") {
    const allCats = loadCategories();
    const existingNames = new Set(resultCategories.map(c => c.name));
    allCats.forEach(c => { if (!existingNames.has(c.name)) { resultCategories.push(c); existingNames.add(c.name); } });
  } else if (ew.categoriesChoice === "specific") {
    const allCats = loadCategories();
    const existingNames = new Set(resultCategories.map(c => c.name));
    ew.selectedCategoryIndices.forEach(i => {
      const c = allCats[i];
      if (c && !existingNames.has(c.name)) { resultCategories.push(c); existingNames.add(c.name); }
    });
  }

  if (ew.categoriesCascade && resultCategories.length > 0) {
    const allImgs = loadImages();
    const usedImgNames = new Set(resultCategories.map(c => c.image).filter(Boolean));
    const existingImgNames = new Set(resultImages.map(i => i.name));
    allImgs.forEach(img => { if (usedImgNames.has(img.name) && !existingImgNames.has(img.name)) { resultImages.push(img); } });
  }

  if (ew.imagesChoice === "all") {
    const allImgs = loadImages();
    const existingNames = new Set(resultImages.map(i => i.name));
    allImgs.forEach(img => { if (!existingNames.has(img.name)) { resultImages.push(img); existingNames.add(img.name); } });
  } else if (ew.imagesChoice === "specific") {
    const allImgs = loadImages();
    const existingNames = new Set(resultImages.map(i => i.name));
    ew.selectedImageIndices.forEach(i => {
      const img = allImgs[i];
      if (img && !existingNames.has(img.name)) { resultImages.push(img); existingNames.add(img.name); }
    });
  }

  return { dates: resultDates, categories: resultCategories, images: resultImages };
}

function doJSONExport(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "countmydays-export.json";
  a.click();
  URL.revokeObjectURL(url);
}

function doQRExport(data) {
  const modal = document.getElementById("qrExportModal");
  const list = document.getElementById("qrList");
  if (!modal || !list) {
    alert("QR export UI not found.");
    return;
  }
  list.innerHTML = "";
  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);
  const chunkSize = 400;
  const chunks = [];
  for (let i = 0; i < compressed.length; i += chunkSize) {
    chunks.push(compressed.substring(i, i + chunkSize));
  }
  chunks.forEach((chunk, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4 text-center";
    const qrBox = document.createElement("div");
    qrBox.style.background = "white";
    qrBox.style.padding = "20px";
    qrBox.style.display = "inline-block";
    qrBox.style.borderRadius = "8px";
    const qrDiv = document.createElement("div");
    qrBox.appendChild(qrDiv);
    wrapper.appendChild(qrBox);
    new QRCode(qrDiv, {
      text: JSON.stringify({ index, total: chunks.length, chunk }),
      width: 220,
      height: 220,
      margin: 16
    });
    const label = document.createElement("div");
    label.className = "mt-2 text-secondary";
    label.innerText = `QR ${index + 1} of ${chunks.length}`;
    wrapper.appendChild(label);
    list.appendChild(wrapper);
  });
  modal.classList.remove("d-none");
}
