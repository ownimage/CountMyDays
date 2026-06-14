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
