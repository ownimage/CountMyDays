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

function buildLines() {
  const lines = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c <= 2; c++) {
      lines.push([r * 5 + c + 1, r * 5 + c + 2, r * 5 + c + 3]);
    }
  }
  for (let c = 0; c < 5; c++) {
    for (let r = 0; r <= 2; r++) {
      lines.push([r * 5 + c + 1, (r + 1) * 5 + c + 1, (r + 2) * 5 + c + 1]);
    }
  }
  for (let r = 0; r <= 2; r++) {
    for (let c = 0; c <= 2; c++) {
      lines.push([r * 5 + c + 1, (r + 1) * 5 + c + 2, (r + 2) * 5 + c + 3]);
    }
  }
  for (let r = 0; r <= 2; r++) {
    for (let c = 2; c < 5; c++) {
      lines.push([r * 5 + c + 1, (r + 1) * 5 + c, (r + 2) * 5 + c - 1]);
    }
  }
  return lines;
}
const winLines = buildLines();

function checkWin(player) {
  const cells = document.getElementById("buttonGrid").children;
  for (const line of winLines) {
    if (line.every(i => cells[i - 1].textContent === player)) {
      return line;
    }
  }
  return null;
}

function showWinner(player) {
  document.getElementById("winnerMessage").textContent = player + " wins!";
  new bootstrap.Modal(document.getElementById("winnerModal")).show();
}

function closeWinner() {
  bootstrap.Modal.getInstance(document.getElementById("winnerModal")).hide();
  resetGame();
}

function resetGame() {
  const cells = document.getElementById("buttonGrid").children;
  for (let i = 0; i < cells.length; i++) {
    const btn = cells[i];
    const idx = i + 1;
    if (idx === 13) {
      btn.textContent = "O";
      btn.disabled = true;
      btn.className = "cell-oob";
    } else {
      btn.textContent = idx;
      btn.disabled = false;
      btn.className = "cell-available";
      btn.onclick = () => handleClick(btn);
    }
  }
  currentPlayer = "X";
  document.getElementById("turnIndicator").textContent = "X to go";
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
  const player = currentPlayer;
  btn.textContent = player;
  btn.disabled = true;
  btn.className = "cell-placed";
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  document.getElementById("turnIndicator").textContent = currentPlayer + " to go";
  updateAvailability();
  if (checkWin(player)) {
    showWinner(player);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  buildGrid();
  if (screen.orientation && typeof screen.orientation.lock === "function") {
    screen.orientation.lock("portrait").catch(() => {});
  }
});
