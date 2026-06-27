let currentPlayer = "X";

function rc(i) {
  return { row: Math.floor((i - 1) / 5), col: (i - 1) % 5 };
}

function getPlaced() {
  const cells = document.getElementById("buttonGrid").children;
  const placed = [];
  for (const btn of cells) {
    if (btn.className === "cell-placed" || btn.className === "cell-oob") {
      placed.push(+btn.dataset.index);
    }
  }
  return placed;
}

function fits3x3(indices) {
  const rows = indices.map(i => rc(i).row);
  const cols = indices.map(i => rc(i).col);
  return Math.max(...rows) - Math.min(...rows) <= 2 &&
         Math.max(...cols) - Math.min(...cols) <= 2;
}

function updateAvailability() {
  const cells = document.getElementById("buttonGrid").children;
  const placed = getPlaced();
  if (placed.length === 0) return;
  for (const btn of cells) {
    if (btn.disabled) continue;
    if (!fits3x3([...placed, +btn.dataset.index])) {
      btn.disabled = true;
      btn.textContent = "";
      btn.className = "cell-unavailable";
    }
  }
}

function buildGrid() {
  const grid = document.getElementById("buttonGrid");
  for (let i = 1; i <= 25; i++) {
    const btn = document.createElement("button");
    btn.dataset.index = i;
    if (i === 13) {
      btn.textContent = "O";
      btn.disabled = true;
      btn.className = "cell-oob";
    } else {
      btn.textContent = i;
      btn.className = "cell-available";
      btn.onclick = () => handleClick(btn);
    }
    grid.appendChild(btn);
  }
}

function handleClick(btn) {
  btn.textContent = currentPlayer;
  btn.disabled = true;
  btn.className = "cell-placed";
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("turnIndicator").textContent = currentPlayer + " to go";
  updateAvailability();
}

document.addEventListener("DOMContentLoaded", () => {
  buildGrid();
  if (screen.orientation && typeof screen.orientation.lock === "function") {
    screen.orientation.lock("portrait").catch(() => {});
  }
});
