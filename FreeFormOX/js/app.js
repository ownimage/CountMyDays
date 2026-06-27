let currentPlayer = "X";

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
}

document.addEventListener("DOMContentLoaded", () => {
  buildGrid();
  if (screen.orientation && typeof screen.orientation.lock === "function") {
    screen.orientation.lock("portrait").catch(() => {});
  }
});
