const themeConfig = (() => {
  const bw = "https://cdn.jsdelivr.net/npm/bootswatch@5.3.3/dist";
  return {
    brite:     { css: `${bw}/brite/bootstrap.min.css`,     bsTheme: "light" },
    cerulean:  { css: `${bw}/cerulean/bootstrap.min.css`,   bsTheme: "light" },
    cosmo:     { css: `${bw}/cosmo/bootstrap.min.css`,      bsTheme: "light" },
    cyborg:    { css: `${bw}/cyborg/bootstrap.min.css`,     bsTheme: "dark" },
    darkly:    { css: `${bw}/darkly/bootstrap.min.css`,     bsTheme: "dark" },
    flatly:    { css: `${bw}/flatly/bootstrap.min.css`,     bsTheme: "light" },
    journal:   { css: `${bw}/journal/bootstrap.min.css`,    bsTheme: "light" },
    litera:    { css: `${bw}/litera/bootstrap.min.css`,     bsTheme: "light" },
    lumen:     { css: `${bw}/lumen/bootstrap.min.css`,      bsTheme: "light" },
    lux:       { css: `${bw}/lux/bootstrap.min.css`,        bsTheme: "light" },
    materia:   { css: `${bw}/materia/bootstrap.min.css`,    bsTheme: "light" },
    minty:     { css: `${bw}/minty/bootstrap.min.css`,      bsTheme: "light" },
    morph:     { css: `${bw}/morph/bootstrap.min.css`,      bsTheme: "light" },
    pulse:     { css: `${bw}/pulse/bootstrap.min.css`,      bsTheme: "light" },
    quartz:    { css: `${bw}/quartz/bootstrap.min.css`,     bsTheme: "light" },
    sandstone: { css: `${bw}/sandstone/bootstrap.min.css`,  bsTheme: "light" },
    simplex:   { css: `${bw}/simplex/bootstrap.min.css`,    bsTheme: "light" },
    sketchy:   { css: `${bw}/sketchy/bootstrap.min.css`,    bsTheme: "light" },
    slate:     { css: `${bw}/slate/bootstrap.min.css`,      bsTheme: "dark" },
    solar:     { css: `${bw}/solar/bootstrap.min.css`,       bsTheme: "dark" },
    spacelab:  { css: `${bw}/spacelab/bootstrap.min.css`,   bsTheme: "light" },
    superhero: { css: `${bw}/superhero/bootstrap.min.css`,  bsTheme: "dark" },
    united:    { css: `${bw}/united/bootstrap.min.css`,     bsTheme: "light" },
    vapor:     { css: `${bw}/vapor/bootstrap.min.css`,      bsTheme: "dark" },
    yeti:      { css: `${bw}/yeti/bootstrap.min.css`,       bsTheme: "light" },
    zephyr:    { css: `${bw}/zephyr/bootstrap.min.css`,     bsTheme: "light" }
  };
})();

function applyTheme(name) {
  const config = themeConfig[name] || themeConfig.solar;
  const link = document.getElementById("bootstrap-theme-css");
  if (link) link.href = config.css;
  document.documentElement.setAttribute("data-bs-theme", config.bsTheme);
  localStorage.setItem("ffox_theme", name);
}

function changeTheme(name) {
  applyTheme(name);
}

function changeAutoHideMenu(enabled) {
  localStorage.setItem("ffox_autoHideMenu", enabled);
  document.body.classList.toggle("auto-hide-menu", enabled);
  if (enabled) {
    resetAutoHideTimer();
  } else {
    clearTimeout(autoHideTimer);
    document.getElementById("mainNav").classList.remove("nav-hidden");
  }
}

let autoHideTimer = null;
let autoHideCooldown = false;

function showNav() {
  const nav = document.getElementById("mainNav");
  if (nav) nav.classList.remove("nav-hidden");
}

function hideNav() {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  if (document.getElementById("settingsPage").classList.contains("d-none")) {
    nav.classList.add("nav-hidden");
    autoHideCooldown = true;
    setTimeout(() => { autoHideCooldown = false; }, 600);
  }
}

function resetAutoHideTimer() {
  if (autoHideCooldown) return;
  const enabled = localStorage.getItem("ffox_autoHideMenu") === "true";
  if (!enabled) return;
  showNav();
  clearTimeout(autoHideTimer);
  autoHideTimer = setTimeout(hideNav, 4000);
}

function openSettings() {
  document.getElementById("mainContent").classList.add("d-none");
  document.getElementById("settingsPage").classList.remove("d-none");

  const savedTheme = localStorage.getItem("ffox_theme") || "solar";
  const themeSel = document.getElementById("themeSelector");
  if (themeSel) themeSel.value = savedTheme;

  const autoHide = localStorage.getItem("ffox_autoHideMenu") === "true";
  const autoHideCb = document.getElementById("autoHideMenu");
  if (autoHideCb) autoHideCb.checked = autoHide;

  const qrContainer = document.getElementById("shareQrCode");
  if (qrContainer) {
    qrContainer.innerHTML = "";
    new QRCode(qrContainer, {
      text: "https://ownimage.github.io/FreeFormOX",
      width: 120,
      height: 120,
      margin: 8
    });
  }
}

function closeSettings() {
  document.getElementById("settingsPage").classList.add("d-none");
  document.getElementById("mainContent").classList.remove("d-none");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("buildNumber").textContent = BUILD_NUMBER;

  const savedTheme = localStorage.getItem("ffox_theme") || "solar";
  applyTheme(savedTheme);

  const autoHide = localStorage.getItem("ffox_autoHideMenu") === "true";
  if (autoHide) {
    document.body.classList.add("auto-hide-menu");
    resetAutoHideTimer();
    ["pointerdown", "pointerup", "touchstart", "click", "mousedown"].forEach(evt => {
      document.addEventListener(evt, resetAutoHideTimer, { passive: true });
      document.body.addEventListener(evt, resetAutoHideTimer, { passive: true });
    });
    window.addEventListener("scroll", resetAutoHideTimer, { passive: true });
  }
});
