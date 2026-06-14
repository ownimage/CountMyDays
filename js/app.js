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

  renderDatesEditor();
}

function openCategoriesEditor() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.remove("d-none");
  document.getElementById("imagesEditor").classList.add("d-none");

  renderCategoriesEditor();
}

function openImagesEditor() {
  document.getElementById("countdownContainer").classList.add("d-none");
  document.getElementById("datesEditor").classList.add("d-none");
  document.getElementById("categoriesEditor").classList.add("d-none");
  document.getElementById("imagesEditor").classList.remove("d-none");

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
  renderCountdowns();
});
