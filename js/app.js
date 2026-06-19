// -------------------------------
// app.js - Full replacement
// Includes: storage, rendering, editors, export/import JSON, QR export/import (iPhone-safe)
// Requires: lz-string, html5-qrcode, qrcodejs loaded in index.html before this file
// -------------------------------

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
// JSON IMPORT
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
        hideAllEditors();
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
// UI UTILITIES
// -------------------------------

function hideAllEditors() {
  document.getElementById("countdownContainer").classList.remove("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("imagesEditor").classList.add("d-none");
  document.getElementById("settingsPage").classList.add("d-none");
}

// -------------------------------
// DATE CALCULATION
// -------------------------------

function targetDate(d) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let year = now.getFullYear();

  if (d.type === "once") {
    year = d.year;
  }

  const target = new Date(year, d.month - 1, d.day);

  if (d.type === "annual" && target < today) {
    target.setFullYear(target.getFullYear() + 1);
  }

  return target;
}

function daysUntil(d) {
  const target = targetDate(d);
  const diff = target - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// -------------------------------
// RENDER COUNTDOWNS
// -------------------------------

function renderCountdowns() {
  const container = document.getElementById("countdownContainer");
  if (!container) return;
  container.innerHTML = "";

  const dates = loadDates();
  const categories = loadCategories();
  const images = loadImages();

  const maxCountdowns = parseInt(localStorage.getItem("maxCountdowns") || "10", 10);
  const showAll = container.dataset.showAll === "true" || maxCountdowns === 0;

  const withDays = dates
    .map(d => ({ ...d, days: daysUntil(d) }))
    .sort((a, b) => a.days - b.days);

  const todayEvents = withDays.filter(d => d.days === 0);
  const futureEvents = withDays.filter(d => d.days > 0);

  function renderCard(d) {
    const category = categories.find(c => c.name === d.category);
    const imageName = category ? category.image : null;
    const image = images.find(i => i.name === imageName);
    const imgSrc = image ? image.data : "";

    const card = document.createElement("div");
    card.className = "card countdown-card mb-2";

    const eventDate = targetDate(d);
    const format = localStorage.getItem("countdownFormat") || "days";
    const weeks = Math.floor(d.days / 7);
    const remainDays = d.days % 7;

    let displayText;
    if (format === "weeksAndDays") {
      displayText = `${weeks} week${weeks !== 1 ? "s" : ""}`;
      if (remainDays > 0) displayText += ` ${remainDays} day${remainDays !== 1 ? "s" : ""}`;
    } else {
      displayText = `${d.days} day${d.days !== 1 ? "s" : ""}`;
    }

    card.innerHTML = `
      <div class="row align-items-center">
        <div class="col-auto text-center">
          ${imgSrc ? `<img src="${imgSrc}" class="countdown-img d-block mx-auto">` : `<div class="text-secondary">No image</div>`}
          <div class="mt-1">${escapeHtml(d.category)}</div>
        </div>
        <div class="col">
          <h4 class="mb-1">${escapeHtml(d.name)}</h4>
          <div>${formatDate(eventDate)}</div>
        </div>
        <div class="col-auto text-end">
          <div class="h4 mb-0">${displayText}</div>
        </div>
      </div>
    `;

    container.appendChild(card);
  }

  if (todayEvents.length > 0) {
    const heading = document.createElement("h2");
    heading.className = "mb-3";
    heading.textContent = "Today!";
    container.appendChild(heading);
    todayEvents.forEach(renderCard);
  }

  if (futureEvents.length > 0) {
    const visible = showAll ? futureEvents : futureEvents.slice(0, maxCountdowns);

    const heading = document.createElement("h2");
    heading.className = "mb-3";
    heading.textContent = "Counting the days to:";
    container.appendChild(heading);
    visible.forEach(renderCard);

    if (!showAll && futureEvents.length > maxCountdowns) {
      const more = document.createElement("div");
      more.className = "text-center mt-2";
      const moreBtn = document.createElement("a");
      moreBtn.href = "#";
      moreBtn.className = "btn btn-outline-primary btn-sm";
      moreBtn.textContent = `+ ${futureEvents.length - maxCountdowns} more`;
      moreBtn.onclick = e => {
        e.preventDefault();
        container.dataset.showAll = "true";
        renderCountdowns();
      };
      more.appendChild(moreBtn);
      container.appendChild(more);
    }
  }
}

// small helper to avoid accidental HTML injection
function escapeHtml(str) {
  if (!str && str !== 0) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// -------------------------------
// EDITOR NAVIGATION
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

// -------------------------------
// SIMPLE EDITOR RENDERS (placeholders)
// -------------------------------

function renderDatesEditor() {
  const el = document.getElementById("datesEditor");
  if (!el) return;
  const dates = loadDates();
  el.innerHTML = `<h2 class="mb-3">Edit Dates</h2><div id="editorList"></div><div class="mt-3"><button class="btn btn-primary" onclick="addSampleDate()">Add Sample Date</button> <button class="btn btn-secondary" onclick="closeDatesEditor()">Done</button></div>`;
  const list = document.getElementById("editorList");
  list.innerHTML = dates.map((d, i) => `<div class="mb-2"><strong>${escapeHtml(d.name)}</strong> — ${escapeHtml(d.category)} — ${d.type}</div>`).join("");
}

function renderImagesEditor() {
  const el = document.getElementById("imagesEditor");
  if (!el) return;
  const images = loadImages();
  el.innerHTML = `<h2 class="mb-3">Edit Images</h2><div id="imagesList"></div><div class="mt-3"><button class="btn btn-primary" onclick="addSampleImage()">Add Sample Image</button> <button class="btn btn-secondary" onclick="closeImagesEditor()">Done</button></div>`;
  const list = document.getElementById("imagesList");
  list.innerHTML = images.map((i, idx) => `<div class="mb-2">${escapeHtml(i.name)}</div>`).join("");
}

function closeDatesEditor() {
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  editingIndex = -1;
  editBuffer = null;
  isNewDate = false;
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
  editingImageIndex = -1;
  isNewImage = false;
  renderCountdowns();
}

// -------------------------------
// SAMPLE DATA HELPERS (for quick testing)
// -------------------------------

function addSampleDate() {
  const dates = loadDates();
  dates.push({ name: "Sample Event", category: "General", type: "annual", month: 12, day: 25 });
  saveDates(dates);
  renderDatesEditor();
}

function addSampleCategory() {
  const categories = loadCategories();
  categories.push({ name: "General", image: "" });
  saveCategories(categories);
  renderCategoriesEditor();
}

function addSampleImage() {
  const images = loadImages();
  images.push({ name: "Sample", data: "" });
  saveImages(images);
  renderImagesEditor();
}

// -------------------------------
// QR EXPORT
// -------------------------------

function exportToQR() {
  const modal = document.getElementById("qrExportModal");
  const list = document.getElementById("qrList");
  if (!modal || !list) {
    alert("QR export UI not found.");
    return;
  }
  list.innerHTML = "";

  const data = {
    dates: loadDates(),
    categories: loadCategories(),
    images: loadImages()
  };

  const json = JSON.stringify(data);
  const compressed = LZString.compressToEncodedURIComponent(json);

  // chunk size tuned for reliability
  const chunkSize = 400;
  const chunks = [];
  for (let i = 0; i < compressed.length; i += chunkSize) {
    chunks.push(compressed.substring(i, i + chunkSize));
  }

  chunks.forEach((chunk, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-4 text-center";

    // white quiet zone container
    const qrBox = document.createElement("div");
    qrBox.style.background = "white";
    qrBox.style.padding = "20px";
    qrBox.style.display = "inline-block";
    qrBox.style.borderRadius = "8px";

    const qrDiv = document.createElement("div");
    qrBox.appendChild(qrDiv);
    wrapper.appendChild(qrBox);

    // generate QR
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

function closeQRExportModal() {
  const modal = document.getElementById("qrExportModal");
  if (modal) modal.classList.add("d-none");
}

// -------------------------------
// QR IMPORT (cameraId approach, QR-only, iPhone-safe)
// -------------------------------

// -------------------------------
// QR IMPORT (iOS-safe manual fallback using jsQR)
// -------------------------------

let qrImportState = {
  total: null,
  chunks: {},
  reader: null,
  manual: {
    stream: null,
    video: null,
    canvas: null,
    rafId: null
  }
};

function isiOS() {
  return /iP(hone|od|ad)/i.test(navigator.userAgent);
}

function startQRImport() {
  const modal = document.getElementById("qrImportModal");
  const status = document.getElementById("qrImportStatus");
  const readerEl = document.getElementById("qrReader");

  if (!modal || !status || !readerEl) {
    alert("QR import UI not found.");
    return;
  }

  modal.classList.remove("d-none");
  status.innerText = "Preparing camera…";

  qrImportState = { total: null, chunks: {}, reader: null, manual: { stream: null, video: null, canvas: null, rafId: null } };

  // If iPhone, use manual jsQR fallback to avoid native barcode UI
  if (isiOS()) {
    startManualQRImport();
  } else {
    startHtml5QrcodeImport(); // non-iOS: use existing html5-qrcode flow
  }
}

/* ---------- html5-qrcode path (non-iOS) ---------- */
async function startHtml5QrcodeImport() {
  const status = document.getElementById("qrImportStatus");
  const readerEl = document.getElementById("qrReader");

  // compute qrbox
  const width = Math.max(300, Math.min(420, readerEl.clientWidth || 360));
  const qrbox = Math.floor(width * 0.9);

  const reader = new Html5Qrcode("qrReader");
  qrImportState.reader = reader;

  // try to pick cameraId first
  let cameraIdToUse = null;
  try {
    const devices = await Html5Qrcode.getCameras();
    if (devices && devices.length) {
      const rear = devices.find(d => /back|rear|environment|wide/i.test(d.label));
      cameraIdToUse = (rear && rear.id) || devices[0].id;
    }
  } catch (e) {
    cameraIdToUse = null;
  }

  const config = {
    fps: 10,
    qrbox: qrbox,
    formatsToSupport: [ Html5QrcodeSupportedFormats.QR_CODE ],
    experimentalFeatures: { useBarCodeDetectorIfSupported: false }
  };

  const cameraArg = cameraIdToUse || { facingMode: "environment" };
  status.innerText = "Starting camera…";

  reader.start(
    cameraArg,
    config,
    decoded => {
      handleDecodedString(decoded);
    },
    error => {
      // non-fatal scan errors
      status.innerText = "Scanning…";
    }
  ).catch(err => {
    status.innerText = "Camera start failed: " + (err && err.message ? err.message : String(err));
    // fallback to facingMode if cameraId failed
    if (cameraIdToUse) {
      setTimeout(() => {
        reader.start({ facingMode: "environment" }, config, decoded => handleDecodedString(decoded), () => { status.innerText = "Scanning…"; })
          .catch(e => status.innerText = "Camera start failed (fallback): " + (e && e.message ? e.message : String(e)));
      }, 300);
    }
  });
}

/* ---------- Manual jsQR path (iOS) ---------- */
async function startManualQRImport() {
  const status = document.getElementById("qrImportStatus");
  const readerEl = document.getElementById("qrReader");

  status.innerText = "Starting camera (manual mode)…";

  // create video element
  const video = document.createElement("video");
  video.setAttribute("playsinline", "true"); // important for iOS
  video.style.width = "100%";
  video.style.height = "100%";
  readerEl.innerHTML = "";
  readerEl.appendChild(video);

  // create canvas for frame capture (offscreen)
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    qrImportState.manual.stream = stream;
    video.srcObject = stream;

    await video.play();

    // set canvas size to video size
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    qrImportState.manual.video = video;
    qrImportState.manual.canvas = canvas;

    status.innerText = "Scanning… (align QR inside the white box)";

    // scanning loop
    const scanLoop = () => {
      try {
        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          // draw current frame
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          // get image data
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

          // decode with jsQR
          const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" });

          if (code && code.data) {
            handleDecodedString(code.data);
          }
        }
      } catch (e) {
        // ignore per-frame errors
        console.warn("scan frame error", e);
      }
      qrImportState.manual.rafId = requestAnimationFrame(scanLoop);
    };

    qrImportState.manual.rafId = requestAnimationFrame(scanLoop);
  } catch (err) {
    status.innerText = "Camera access failed: " + (err && err.message ? err.message : String(err));
  }
}

function stopManualScanner() {
  const m = qrImportState.manual;
  if (m.rafId) {
    cancelAnimationFrame(m.rafId);
    m.rafId = null;
  }
  if (m.video) {
    try { m.video.pause(); } catch (e) {}
    if (m.video.srcObject) {
      const tracks = m.video.srcObject.getTracks();
      tracks.forEach(t => t.stop());
    }
    m.video.remove();
    m.video = null;
  }
  if (m.stream) {
    try {
      m.stream.getTracks().forEach(t => t.stop());
    } catch (e) {}
    m.stream = null;
  }
  if (m.canvas) {
    m.canvas = null;
  }
}

/* ---------- Shared decode handler ---------- */
function handleDecodedString(decoded) {
  const status = document.getElementById("qrImportStatus");

  // Only accept the JSON chunk objects we exported.
  let obj = null;
  try {
    obj = JSON.parse(decoded);
  } catch (e) {
    // not JSON — likely a 1D barcode or other QR content; ignore
    status.innerText = "Ignored non-matching code";
    return;
  }

  // Validate expected chunk object shape
  if (!obj || typeof obj.index !== "number" || typeof obj.total !== "number" || typeof obj.chunk !== "string") {
    status.innerText = "Ignored non-matching JSON";
    return;
  }

  const { index, total, chunk } = obj;

  if (qrImportState.total === null) {
    qrImportState.total = total;
  }

  qrImportState.chunks[index] = chunk;

  status.innerText = `Scanned ${Object.keys(qrImportState.chunks).length} of ${total}`;

  if (Object.keys(qrImportState.chunks).length === total) {
    // stop both possible scanners
    if (qrImportState.reader) {
      qrImportState.reader.stop().catch(()=>{});
      qrImportState.reader = null;
    }
    stopManualScanner();
    finishQRImport();
  }
}

function finishQRImport() {
  const modal = document.getElementById("qrImportModal");
  if (modal) modal.classList.add("d-none");

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
  if (modal) modal.classList.add("d-none");

  if (qrImportState.reader) {
    qrImportState.reader.stop().catch(()=>{});
    qrImportState.reader = null;
  }
  stopManualScanner();
}

// -------------------------------
// INITIAL LOAD
// -------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "darkly";
  applyTheme(savedTheme);
  renderCountdowns();
});
