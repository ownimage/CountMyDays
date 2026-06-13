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

function normaliseImages(raw) {
  if (Array.isArray(raw)) return raw;
  if (raw && typeof raw === "object") return Object.values(raw);
  return [];
}

function ensureDefaults() {
  if (!localStorage.getItem("dates")) {
    saveDates([
      { name: "Christmas", category: "Holiday", type: "annual", month: 12, day: 25 },
      { name: "Cruise", category: "Holiday", type: "once", year: 2026, month: 8, day: 21 }
    ]);
  }

  if (!localStorage.getItem("categories")) {
    saveCategories(["Holiday", "Event", "Birthday"]);
  }

  if (!localStorage.getItem("images")) {
    saveImages(sampleImages);
  }
}

function daysUntil(item) {
  const today = new Date();
  const month = Number(item.month);
  const day = Number(item.day);
  if (!month || !day) return null;

  let target;

  if (item.type === "annual") {
    target = new Date(today.getFullYear(), month - 1, day);
    if (target < today) target = new Date(today.getFullYear() + 1, month - 1, day);
  } else {
    const year = Number(item.year);
    if (!year) return null;
    target = new Date(year, month - 1, day);
    if (target < today) return null;
  }

  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

function renderCountdowns() {
  const container = document.getElementById("countdownContainer");
  container.innerHTML = "";

  const dates = loadDates();
  const images = normaliseImages(loadImages());

  dates.forEach(d => {
    const days = daysUntil(d);
    if (days === null) return;

    const img = images.find(i => i.category === d.category);
    const imgSrc = img ? img.data : "";

    const card = document.createElement("div");
    card.className = "card p-3 mb-3";

    card.innerHTML = `
      <div class="row align-items-center">
        <div class="col-auto">
          <img src="${imgSrc}" class="countdown-img">
        </div>
        <div class="col">
          <h4 class="mb-0">${d.name}</h4>
          <small class="text-secondary">${d.category}</small>
        </div>
        <div class="col-auto text-end">
          <div class="fs-1 fw-bold">${days}</div>
          <div class="text-secondary">days</div>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

function showView(id) {
  ["countdownContainer", "datesEditor", "categoriesEditor", "imagesEditor"]
    .forEach(v => document.getElementById(v).classList.add("d-none"));

  document.getElementById(id).classList.remove("d-none");
}

function openDatesEditor() {
  showView("datesEditor");
  renderDatesEditor();
}

function openCategoriesEditor() {
  showView("categoriesEditor");
  renderCategoriesEditor();
}

function openImagesEditor() {
  showView("imagesEditor");
  renderImagesEditor();
}

function closeDatesEditor() {
  showView("countdownContainer");
  renderCountdowns();
}

function closeCategoriesEditor() {
  showView("countdownContainer");
  renderCountdowns();
}

function closeImagesEditor() {
  showView("countdownContainer");
  renderCountdowns();
}

function exportData() {
  const data = {
    dates: loadDates(),
    categories: loadCategories(),
    images: loadImages()
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "countdowns.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";

  input.onchange = e => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const data = JSON.parse(reader.result);
      if (data.dates) saveDates(data.dates);
      if (data.categories) saveCategories(data.categories);
      if (data.images) saveImages(data.images);
      renderCountdowns();
    };

    reader.readAsText(file);
  };

  input.click();
}

function resetAll() {
  if (!confirm("Reset all data?")) return;
  localStorage.clear();
  ensureDefaults();
  renderCountdowns();
}

ensureDefaults();
renderCountdowns();
