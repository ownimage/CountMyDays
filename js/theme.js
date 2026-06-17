// -------------------------------
// theme.js - Theme configuration and helpers
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