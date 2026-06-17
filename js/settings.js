// -------------------------------
// settings.js - Theme, settings page, font size
// -------------------------------

const themeConfig = {
  darkly: { css: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/darkly/bootstrap.min.css", bsTheme: "dark" },
  flatly: { css: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/flatly/bootstrap.min.css", bsTheme: "light" },
  zephyr: { css: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/zephyr/bootstrap.min.css", bsTheme: "light" },
  superhero: { css: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/superhero/bootstrap.min.css", bsTheme: "dark" },
  quartz: { css: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css", bsTheme: "light" },
  cyborg: { css: "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist/cyborg/bootstrap.min.css", bsTheme: "dark" }
};

function applyTheme(name) {
  const config = themeConfig[name] || themeConfig.darkly;
  const link = document.getElementById("bootstrap-theme-css");
  if (link) link.href = config.css;
  document.documentElement.setAttribute("data-bs-theme", config.bsTheme);
  localStorage.setItem("theme", name);
}

function changeTheme(name) {
  applyTheme(name);
}

function getAvailableThemes() {
  return Object.keys(themeConfig);
}

// -------------------------------
// FONT SIZE
// -------------------------------

function changeFontSize(value) {
  localStorage.setItem("fontSize", value);
  document.body.classList.remove("font-size-normal", "font-size-large", "font-size-xlarge", "font-size-jumbo");
  if (value !== "normal") {
    document.body.classList.add("font-size-" + value);
  }
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

  const savedTheme = localStorage.getItem("theme") || "darkly";
  const themeSel = document.getElementById("themeSelector");
  if (themeSel) themeSel.value = savedTheme;

  const savedFormat = localStorage.getItem("countdownFormat") || "days";
  const formatSel = document.getElementById("formatSelector");
  if (formatSel) formatSel.value = savedFormat;

  const savedFontSize = localStorage.getItem("fontSize") || "xlarge";
  const fontSizeSel = document.getElementById("fontSizeSelector");
  if (fontSizeSel) fontSizeSel.value = savedFontSize;

  const autoHide = localStorage.getItem("autoHideMenu") === "true";
  const autoHideCb = document.getElementById("autoHideMenu");
  if (autoHideCb) autoHideCb.checked = autoHide;

  const savedMax = localStorage.getItem("maxCountdowns") || "10";
  const maxSel = document.getElementById("maxCountdownsSelector");
  if (maxSel) maxSel.value = savedMax;
}

function changeFormat(value) {
  localStorage.setItem("countdownFormat", value);
}

function closeSettings() {
  document.getElementById("settingsPage").classList.add("d-none");
  document.getElementById("countdownContainer").classList.remove("d-none");
  delete document.getElementById("countdownContainer").dataset.showAll;
  renderCountdowns();
}

// -------------------------------
// AUTO-HIDE MENU
// -------------------------------

let autoHideTimer = null;

function showNav() {
  const nav = document.getElementById("mainNav");
  if (nav) nav.classList.remove("nav-hidden");
}

function hideNav() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  if (document.getElementById("settingsPage").classList.contains("d-none") &&
      document.getElementById("datesEditor").classList.contains("d-none") &&
      document.getElementById("categoriesEditor").classList.contains("d-none") &&
      document.getElementById("imagesEditor").classList.contains("d-none")) {
    nav.classList.add("nav-hidden");
  }
}

function resetAutoHideTimer() {
  const enabled = localStorage.getItem("autoHideMenu") === "true";
  if (!enabled) return;
  showNav();
  clearTimeout(autoHideTimer);
  autoHideTimer = setTimeout(hideNav, 4000);
}

function changeMaxCountdowns(value) {
  localStorage.setItem("maxCountdowns", value);
}

function changeAutoHideMenu(enabled) {
  localStorage.setItem("autoHideMenu", enabled);
  document.body.classList.toggle("auto-hide-menu", enabled);
  if (enabled) {
    resetAutoHideTimer();
  } else {
    clearTimeout(autoHideTimer);
    document.getElementById("mainNav").classList.remove("nav-hidden");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const savedFontSize = localStorage.getItem("fontSize") || "xlarge";
  if (savedFontSize !== "normal") {
    document.body.classList.add("font-size-" + savedFontSize);
  }

  const autoHide = localStorage.getItem("autoHideMenu") === "true";
  if (autoHide) {
    document.body.classList.add("auto-hide-menu");
    resetAutoHideTimer();
    ["pointerdown", "touchstart", "click"].forEach(evt => {
      document.addEventListener(evt, resetAutoHideTimer, { passive: true });
    });
    window.addEventListener("scroll", resetAutoHideTimer, { passive: true });
  }
});
