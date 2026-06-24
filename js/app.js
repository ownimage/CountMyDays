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

        startImportWizard(json);

      } catch (err) {
        alert("Invalid JSON file.");
      }
    };

    reader.readAsText(file);
  };

  input.click();
}

function importSampleData() {
  const cacheBuster = typeof BUILD_NUMBER !== "undefined" ? BUILD_NUMBER : Date.now();

  showSpinner();
  fetch("js/sampleData.json?v=" + cacheBuster)
    .then(res => {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(json => {
      hideSpinner();
      if (!json.dates || !json.categories || !json.images) {
        alert("Sample data file is missing required fields.");
        return;
      }
      startImportWizard(json);
    })
    .catch(err => {
      hideSpinner();
      alert("Failed to load sample data: " + err.message);
    });
}

function showSpinner() {
  let el = document.getElementById("spinnerOverlay");
  if (!el) {
    el = document.createElement("div");
    el.id = "spinnerOverlay";
    el.className = "d-none";
    el.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:99999;";
    el.innerHTML = '<div class="spinner-border text-light" style="width:3rem;height:3rem" role="status"><span class="visually-hidden">Loading…</span></div>';
    document.body.appendChild(el);
  }
  el.classList.remove("d-none");
}

function hideSpinner() {
  const el = document.getElementById("spinnerOverlay");
  if (el) el.classList.add("d-none");
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

function updateNavState() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  const editing = (
    (typeof editingIndex !== 'undefined' && editingIndex >= 0) ||
    (typeof editingCategoryIndex !== 'undefined' && editingCategoryIndex >= 0) ||
    (typeof editingImageIndex !== 'undefined' && editingImageIndex >= 0)
  );
  nav.classList.toggle("nav-inactive", editing);
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
    const dateImg = d.image ? images.find(i => i.name === d.image) : null;
    const dateImgSrc = dateImg ? dateImg.data : "";

    const card = document.createElement("div");
    card.className = "card countdown-card mb-2";

    const eventDate = targetDate(d);
    const format = localStorage.getItem("countdownFormat") || "days";
    const weeks = Math.floor(d.days / 7);
    const remainDays = d.days % 7;

    let displayLine1, displayLine2;
    if (format === "weeksAndDays") {
      displayLine1 = `${weeks} week${weeks !== 1 ? "s" : ""}`;
      displayLine2 = remainDays > 0 ? `${remainDays} day${remainDays !== 1 ? "s" : ""}` : "";
    } else {
      displayLine1 = `${d.days}`;
      displayLine2 = `day${d.days !== 1 ? "s" : ""}`;
    }

    card.innerHTML = `
      <div class="row align-items-center">
        <div class="col-auto text-center">
          <div class="d-flex gap-1">
            <div>
              ${imgSrc ? `<img src="${imgSrc}" class="countdown-img d-block mx-auto">` : `<div class="countdown-img d-flex align-items-center justify-content-center text-secondary">No img</div>`}
              <div class="mt-1">${escapeHtml(d.category)}</div>
            </div>
            <div>
              ${dateImgSrc ? `<img src="${dateImgSrc}" class="countdown-img d-block mx-auto">` : `<div class="countdown-img"></div>`}
            </div>
          </div>
        </div>
        <div class="col">
          <h4 class="mb-1">${escapeHtml(d.name)}</h4>
          <div>${formatDate(eventDate)}</div>
        </div>
        <div class="col-auto text-center">
          <div class="h4 mb-0">${displayLine1}</div>
          ${displayLine2 ? `<div class="h4 mb-0">${displayLine2}</div>` : ""}
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
    const days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const now = new Date();
    heading.textContent = `From ${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()} :`;
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
  updateNavState();
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
    startImportWizard(data);
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

// -------------------------------
// PWA PULL-TO-REFRESH
// -------------------------------

(function() {
  if (!("serviceWorker" in navigator)) return;

  const THRESHOLD = 80;
  let startY = 0;
  let pulling = false;
  let pullDist = 0;

  const indicator = document.createElement("div");
  indicator.id = "pwa-pull-indicator";
  indicator.style.cssText =
    "position:fixed;top:0;left:0;right:0;z-index:9999;display:flex;" +
    "align-items:center;justify-content:center;height:0;overflow:hidden;" +
    "background:var(--bs-body-bg);transition:height 0.1s;color:var(--bs-body-color)";
  indicator.textContent = "\u21E9 Pull to refresh";
  document.body.appendChild(indicator);

  const spinner = document.createElement("div");
  spinner.id = "pwa-pull-spinner";
  spinner.style.cssText =
    "position:fixed;top:30%;left:50%;transform:translate(-50%,-50%);z-index:10000;" +
    "display:none;width:40px;height:40px;border:4px solid var(--bs-border-color);" +
    "border-top-color:var(--bs-primary);border-radius:50%;animation:pwa-spin 0.6s linear infinite";
  document.body.appendChild(spinner);

  const style = document.createElement("style");
  style.textContent =
    "@keyframes pwa-spin{to{transform:translate(-50%,-50%) rotate(360deg)}}";
  document.head.appendChild(style);

  function adjustIcon(dist) {
    const angle = Math.min(dist, THRESHOLD) / THRESHOLD;
    const deg = Math.round(angle * 180);
    indicator.innerHTML = dist >= THRESHOLD
      ? "\u21E9 Release to refresh"
      : "\u21E9 Pull to refresh";
    indicator.style.height = Math.min(dist, 50) + "px";
  }

  document.addEventListener("touchstart", e => {
    if (window.scrollY !== 0) return;
    const t = e.touches[0];
    startY = t.clientY;
    pulling = true;
    pullDist = 0;
  }, { passive: true });

  document.addEventListener("touchmove", e => {
    if (!pulling) return;
    const t = e.touches[0];
    const dy = t.clientY - startY;
    if (dy <= 0) { pullDist = 0; return; }
    pullDist = dy;
    adjustIcon(dy);
  }, { passive: true });

  document.addEventListener("touchend", () => {
    if (!pulling) return;
    pulling = false;
    indicator.style.height = "0";
    if (pullDist >= THRESHOLD) {
      spinner.style.display = "block";
      setTimeout(() => { location.reload(); }, 400);
    }
    pullDist = 0;
  }, { passive: true });
})();
