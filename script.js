const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gridSize = 30;
let cellSize;
let running = false;

let grid = createGrid(gridSize);
let generationCounter = 0;
let lastGenerationTime = 0;

// Вызываем функцию для создания и отрисовки начального состояния сетки
createAndDrawInitialGrid();

function createAndDrawInitialGrid() {
  gridSize = 30;
  grid = createGrid(gridSize);
  drawGrid();
}

// Обработчик изменения значения ползунка
document
  .getElementById('gridSizeSlider')
  .addEventListener('input', function () {
    document.getElementById('slider-value').innerText = this.value;
  });

canvas.addEventListener('click', (e) => handleCanvasClick(e));
document
  .getElementById('gridSize')
  .addEventListener('change', () => changeGridSize());

function createGrid(size) {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => (Math.random() > 0.5 ? 1 : 0))
  );
}

function drawGrid() {
  canvas.width = canvas.height = gridSize * 10;
  cellSize = canvas.width / gridSize;

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      ctx.fillStyle = grid[i][j] ? '#000' : '#FFF';
      ctx.fillRect(j * cellSize, i * cellSize, cellSize, cellSize);
    }
  }
  document.getElementById(
    'generation-counter'
  ).innerText = `Generation: ${generationCounter}`;

  document.getElementById(
    'generation-time'
  ).innerText = `Generation Time: ${lastGenerationTime} ms`;
}

function updateGrid() {
  const startTime = performance.now();
  const newGrid = createGrid(gridSize);

  for (let i = 0; i < gridSize; i++) {
    for (let j = 0; j < gridSize; j++) {
      const total =
        grid[(i - 1 + gridSize) % gridSize][j] +
        grid[(i + 1) % gridSize][j] +
        grid[i][(j - 1 + gridSize) % gridSize] +
        grid[i][(j + 1) % gridSize] +
        grid[(i - 1 + gridSize) % gridSize][(j - 1 + gridSize) % gridSize] +
        grid[(i - 1 + gridSize) % gridSize][(j + 1) % gridSize] +
        grid[(i + 1) % gridSize][(j - 1 + gridSize) % gridSize] +
        grid[(i + 1) % gridSize][(j + 1) % gridSize];

      if (grid[i][j] === 1) {
        newGrid[i][j] = total === 2 || total === 3 ? 1 : 0;
      } else {
        newGrid[i][j] = total === 3 ? 1 : 0;
      }
    }
  }

  grid = newGrid;
  generationCounter++;
  lastGenerationTime = performance.now() - startTime;
  generationCounter++;
}

function handleCanvasClick(e) {
  if (!running) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const clickedRow = Math.floor(mouseY / cellSize);
    const clickedCol = Math.floor(mouseX / cellSize);

    grid[clickedRow][clickedCol] = 1 - grid[clickedRow][clickedCol];

    drawGrid();
  }
}

function randomize() {
  if (!running) {
    grid = createGrid(gridSize);
    drawGrid();
  }
  generationCounter = 0;
  document.getElementById(
    'generation-counter'
  ).innerText = `Generation: ${generationCounter}`;
}

function startStop() {
  running = !running;
  if (running) {
    runGame();
  }
  if (!running) {
    generationCounter = 0;
    document.getElementById(
      'generation-counter'
    ).innerText = `Generation: ${generationCounter}`;
  }
}

function runGame() {
  if (running) {
    updateGrid();
    drawGrid();
    setTimeout(runGame, 100); // Change the speed by adjusting the timeout value
  }
}

function changeGridSize() {
  if (!running) {
    gridSize = parseInt(document.getElementById('gridSize').value, 10);
    grid = createGrid(gridSize);
    drawGrid();
  }
}

function changeGridSize2() {
  if (!running) {
    gridSize = parseInt(document.getElementById('gridSizeSlider').value, 10);
    grid = createGrid(gridSize);
    drawGrid();
  }
}
