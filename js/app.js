/* ---------------------------------------------------------
   STORAGE INITIALISATION
--------------------------------------------------------- */

const defaultDates = [
  { name: "Christmas", category: "Holiday", month: 12, day: 25, type: "annual" },
  { name: "Cruise", category: "Holiday", year: 2026, month: 8, day: 21, type: "once" }
];

const defaultCategories = ["Holiday", "Birthday", "Anniversary", "Event"];

function initStorage() {
  if (!localStorage.getItem("countdownDates")) {
    localStorage.setItem("countdownDates", JSON.stringify(defaultDates));
  }

  if (!localStorage.getItem("countdownImages")) {
    if (typeof sampleImages !== "undefined") {
      const cartoonSet = sampleImages.cartoon;
      const avatarSet = sampleImages.avatars;

      const initialImages = [
        { name: "Birthday", category: "Birthday", data: cartoonSet.birthday },
        { name: "Holiday", category: "Holiday", data: cartoonSet.holiday },
        { name: "Anniversary", category: "Anniversary", data: cartoonSet.anniversary },
        { name: "Event", category: "Event", data: cartoonSet.event },
        { name: "Person", category: "Avatar", data: avatarSet.cartoonMale }
      ];

      localStorage.setItem("countdownImages", JSON.stringify(initialImages));
    } else {
      localStorage.setItem("countdownImages", JSON.stringify([]));
    }
  }
}

function loadDates() {
  return JSON.parse(localStorage.getItem("countdownDates")) || [];
}

function saveDates(dates) {
  localStorage.setItem("countdownDates", JSON.stringify(dates));
}

function loadImages() {
  return JSON.parse(localStorage.getItem("countdownImages")) || [];
}

function saveImages(images) {
  localStorage.setItem("countdownImages", JSON.stringify(images));
}

function getAllCategories() {
  const dates = loadDates();
  const categories = new Set(defaultCategories);

  dates.forEach(d => {
    if (d.category && d.category.trim() !== "") {
      categories.add(d.category.trim());
    }
  });

  return Array.from(categories);
}

/* ---------------------------------------------------------
   VIEW SWITCHING
--------------------------------------------------------- */

function hideAll() {
  document.getElementById("countdownContainer").style.display = "none";
  document.getElementById("datesEditor").style.display = "none";
  document.getElementById("categoriesEditor").style.display = "none";
  document.getElementById("imagesEditor").style.display = "none";
}

function openDatesEditor() {
  hideAll();
  document.getElementById("datesEditor").style.display = "block";
  renderDatesEditor();
}

function closeDatesEditor() {
  renderCountdowns();
}

function openCategoriesEditor() {
  hideAll();
  document.getElementById("categoriesEditor").style.display = "block";
  renderCategoriesEditor();
}

function closeCategoriesEditor() {
  renderCountdowns();
}

function openImagesEditor() {
  hideAll();
  document.getElementById("imagesEditor").style.display = "block";
  renderImagesEditor();
}

function closeImagesEditor() {
  renderCountdowns();
}

/* ---------------------------------------------------------
   COUNTDOWN CALCULATION
--------------------------------------------------------- */

function daysUntil(item) {
  const today = new Date();
  let target;

  if (item.type === "annual") {
    target = new Date(today.getFullYear(), item.month - 1, item.day);
    if (target < today) {
      target = new Date(today.getFullYear() + 1, item.month - 1, item.day);
    }
  } else {
    target = new Date(item.year, item.month - 1, item.day);
    if (target < today) return null;
  }

  const diff = target - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/* ---------------------------------------------------------
   COUNTDOWN RENDERING (FULL-WIDTH TILES)
--------------------------------------------------------- */

function renderCountdowns() {
  hideAll();
  const container = document.getElementById("countdownContainer");
  container.style.display = "block";
  container.innerHTML = "";

  let dates = loadDates();
  const images = loadImages();

  dates = dates
    .map(item => ({ ...item, daysRemaining: daysUntil(item) }))
    .filter(item => item.daysRemaining !== null);

  dates.sort((a, b) => a.daysRemaining - b.daysRemaining);

  dates.forEach(item => {
    const box = document.createElement("div");
    box.className = "count-tile";

    const img = images.find(i => i.category === item.category);
    const imgSrc = img ? img.data : "";

    const label = item.type === "annual"
      ? `${item.name} (${item.category})`
      : `${item.name} (${item.category}, ${item.year})`;

    box.innerHTML = `
      <div class="tile-left">
        <img src="${imgSrc}" class="tile-icon">
      </div>

      <div class="tile-middle">
        <div class="tile-title">${label}</div>
      </div>

      <div class="tile-right">
        <div class="tile-days">${item.daysRemaining}</div>
      </div>
    `;

    container.appendChild(box);
  });
}

/* ---------------------------------------------------------
   CLICK-TO-OPEN MENUS
--------------------------------------------------------- */

document.querySelectorAll(".menu-item").forEach(item => {
  item.addEventListener("click", e => {
    e.stopPropagation();

    document.querySelectorAll(".menu-item").forEach(i => {
      if (i !== item) i.classList.remove("active");
    });

    item.classList.toggle("active");
  });
});

document.addEventListener("click", () => {
  document.querySelectorAll(".menu-item").forEach(i => i.classList.remove("active"));
});

/* ---------------------------------------------------------
   INITIALISE APP
--------------------------------------------------------- */

initStorage();
renderCountdowns();
