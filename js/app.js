// -------------------------------
// STORAGE HELPERS
// -------------------------------

function loadDates() {
  return JSON.parse(localStorage.getItem("dates") || "[]");
}

function saveDates(dates) {
  localStorage.setItem("dates", JSON.stringify(dates));
}

function loadCategories() {
  return JSON.parse(localStorage.getItem("categories") || "[]");
}

function saveCategories(categories) {
  localStorage.setItem("categories", JSON.stringify(categories));
}

function loadImages() {
  return JSON.parse(localStorage.getItem("images") || "[]");
}

function saveImages(images) {
  localStorage.setItem("images", JSON.stringify(images));
}

// -------------------------------
// JSON EXPORT
// -------------------------------

function exportData() {
  const data = {
    dates: loadDates(),
    categories: loadCategories(),
    images: loadImages()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "countmydays-export.json";
  a.click();

  URL.revokeObjectURL(url);
}

// -------------------------------
// JSON IMPORT (with proper refresh)
// -------------------------------

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = evt => {
      try {
        const json = JSON.parse(evt.target.result);

        if (!json.dates || !json.categories || !json.images) {
          alert("Invalid JSON file — missing required fields.");
          return;
        }

        saveDates(json.dates);
        saveCategories(json.categories);
        saveImages(json.images);

        alert("Import complete!");

        // Close all editors
        document.getElementById("datesEditor").classList.add("d-none");
        document.getElementById("categoriesEditor").classList.add("d-none");
        document.getElementById("imagesEditor").classList.add("d-none");
        document.getElementById("settingsPage").classList.add("d-none");

        // Show main view
        document.getElementById("countdownContainer").classList.remove("d-none");

        // Refresh UI
        renderCountdowns();

      } catch (err) {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

// -------------------------------
// THEMES
// -------------------------------

const themes = {
  dark: {
    menuBg: "#000000",
    menuText: "#ffffff",
    pageBg: "#181a1b",
    tileBg: "#242628"
  },
  light: {
    menuBg: "#ffffff",
    menuText: "#000000",
    pageBg: "#f3f4f6",
    tileBg: "#ffffff"
  },
  midnight: {
    menuBg: "#001f3f",
    menuText: "#ffffff",
    pageBg: "#001529",
    tileBg: "#003366"
  },
  highContrast: {
    menuBg: "#000000",
    menuText: "#ffff00",
    pageBg: "#000000",
    tileBg: "#ffffff"
  }
};

function applyTheme(name) {
  const t = themes[name];
  if (!t) return;

  document.documentElement.style.setProperty("--menu-bg", t.menuBg);
  document.documentElement.style.setProperty("--menu-text", t.menuText);
  document.documentElement.style.setProperty("--page-bg", t.pageBg);
  document.documentElement.style.setProperty("--tile-bg", t.tileBg);

  localStorage.setItem("theme", name);
}

function changeTheme(name) {
  applyTheme(name);
}

// -------------------------------
// SETTINGS PAGE
// -------------------------------

function openSettings() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("imagesEditor").classList.add("d-none");

  document.getElementById("settingsPage").classList.remove("d-none");

  const saved = localStorage.getItem("theme") || "dark";
  document.getElementById("themeSelector").value = saved;
}

function closeSettings() {
  document.getElementById("settingsPage").classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  renderCountdowns();
}

// -------------------------------
// DATE CALCULATION
// -------------------------------

function daysUntil(d) {
  const now = new Date();
  const year = d.type === "once" ? d.year : now.getFullYear();

  const target = new Date(year, d.month - 1, d.day);

  if (d.type === "annual" && target < now) {
    target.setFullYear(target.getFullYear() + 1);
  }

  const diff = target - now;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// -------------------------------
// MAIN COUNTDOWN RENDERING
// -------------------------------

function renderCountdowns() {
  const container = document.getElementById("countdownContainer");
  container.innerHTML = "";

  const dates = loadDates();
  const categories = loadCategories();
  const images = loadImages();

  const sorted = dates
    .map(d => ({ ...d, days: daysUntil(d) }))
    .sort((a, b) => a.days - b.days);

  sorted.forEach(d => {
    const category = categories.find(c => c.name === d.category);
    const imageName = category ? category.image : null;
    const image = images.find(i => i.name === imageName);

    const imgSrc = image ? image.data : "";

    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">

        <div class="col-auto">
          ${imgSrc ? `<img src="${imgSrc}" class="countdown-img">`
                   : `<div class="text-secondary">No image</div>`}
        </div>

        <div class="col">
          <h4 class="mb-0">${d.name}</h4>
          <small class="text-secondary">${d.category}</small>
        </div>

        <div class="col-auto text-end">
          <div class="fs-1 fw-bold">${d.days}</div>
          <div class="text-secondary">days</div>
        </div>

      </div>
    `;

    container.appendChild(card);
  });
}

// -------------------------------
// EDITOR SWITCHING
// -------------------------------

function openDatesEditor() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.remove("d-none");
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("imagesEditor").classList.add("d-none");
  document.getElementById("settingsPage").classList.add("d-none");

  renderDatesEditor();
}

function openCategoriesEditor() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.remove("d-none");
  document.getElementById("imagesEditor").classList.add("d-none");
  document.getElementById("settingsPage").classList.add("d-none");

  renderCategoriesEditor();
}

function openImagesEditor() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("imagesEditor").classList.remove("d-none");
  document.getElementById("settingsPage").classList.add("d-none");

  renderImagesEditor();
}

function closeDatesEditor() {
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  renderCountdowns();
}

function closeCategoriesEditor() {
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  renderCountdowns();
}

function closeImagesEditor() {
  document.getElementById("imagesEditor").classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  renderCountdowns();
}

// -------------------------------
// INITIAL LOAD
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "dark";
  applyTheme(savedTheme);
  renderCountdowns();
});

// -------------------------------
// QR EXPORT
// -------------------------------

function exportToQR() {
  const modal = document.getElementById("qrExportModal");
  const list = document.getElementById("qrList");
  list.innerHTML = "";

  const data = {
    dates: loadDates(),
    categories: loadCategories(),
    images: loadImages()
  };

  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);

  // Split into chunks of ~800 chars (safe for QR)
  const chunkSize = 800;
  const chunks = [];
  for (let i = 0; i < compressed.length; i += chunkSize) {
    chunks.push(compressed.substring(i, i + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4 text-center";

    const qrDiv = document.createElement("div");
    wrapper.appendChild(qrDiv);

    new QRCode(qrDiv, {
      text: JSON.stringify({ index, total: chunks.length, chunk }),
      width: 220,
      height: 220
    });

    const label = document.createElement("div");
    label.className = "mt-2 text-secondary";
    label.innerText = `QR ${index + 1} of ${chunks.length}`;
    wrapper.appendChild(label);

    list.appendChild(wrapper);
  });

  modal.classList.remove("d-none");
}

function closeQRExportModal() {
  document.getElementById("qrExportModal").classList.add("d-none");
}



// -------------------------------
// QR IMPORT
// -------------------------------

let qrImportState = {
  total: null,
  chunks: {},
  reader: null
};

function startQRImport() {
  const modal = document.getElementById("qrImportModal");
  const status = document.getElementById("qrImportStatus");
  modal.classList.remove("d-none");

  qrImportState = { total: null, chunks: {}, reader: null };

  const reader = new Html5Qrcode("qrReader");
  qrImportState.reader = reader;

  reader.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    decoded => {
      try {
        const obj = JSON.parse(decoded);
        const { index, total, chunk } = obj;

        if (qrImportState.total === null) {
          qrImportState.total = total;
        }

        qrImportState.chunks[index] = chunk;

        status.innerText = `Scanned ${Object.keys(qrImportState.chunks).length} of ${total}`;

        if (Object.keys(qrImportState.chunks).length === total) {
          reader.stop();
          finishQRImport();
        }
      } catch (e) {
        console.warn("Invalid QR scan");
      }
    }
  );
}

function finishQRImport() {
  const modal = document.getElementById("qrImportModal");
  modal.classList.add("d-none");

  const ordered = [];
  for (let i = 0; i < qrImportState.total; i++) {
    ordered.push(qrImportState.chunks[i]);
  }

  const compressed = ordered.join("");
  const json = LZString.decompressFromEncodedURIComponent(compressed);

  try {
    const data = JSON.parse(json);

    saveDates(data.dates);
    saveCategories(data.categories);
    saveImages(data.images);

    alert("QR import complete!");

    renderCountdowns();
  } catch (err) {
    alert("Failed to import QR data.");
  }
}

function cancelQRImport() {
  const modal = document.getElementById("qrImportModal");
  modal.classList.add("d-none");

  if (qrImportState.reader) {
    qrImportState.reader.stop();
  }
}
