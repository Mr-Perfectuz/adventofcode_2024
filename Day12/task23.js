import fetch from "node-fetch";

const url = "https://adventofcode.com/2024/day/13/input";
const cookies = {
  session: process.env,
};

async function fetchInput() {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `session=${cookies.session}`,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch input data: ${response.status}`);
  }

  const data = await response.text();
  return data
    .trim()
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

function exploreRegion(x, y, grid, visited) {
  const plantType = grid[x][y];
  const queue = [[x, y]];
  const regionCells = [];
  visited[x][y] = true;

  while (queue.length > 0) {
    const [currX, currY] = queue.shift();
    regionCells.push([currX, currY]);

    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    for (const [dx, dy] of directions) {
      const nx = currX + dx;
      const ny = currY + dy;

      if (nx >= 0 && ny >= 0 && nx < grid.length && ny < grid[0].length) {
        if (grid[nx][ny] === plantType && !visited[nx][ny]) {
          visited[nx][ny] = true;
          queue.push([nx, ny]);
        }
      }
    }
  }

  let perimeter = 0;
  for (const [x, y] of regionCells) {
    const directions = [
      [-1, 0], // Up
      [1, 0], // Down
      [0, -1], // Left
      [0, 1], // Right
    ];

    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (
        nx < 0 ||
        ny < 0 ||
        nx >= grid.length ||
        ny >= grid[0].length ||
        grid[nx][ny] !== grid[x][y]
      ) {
        perimeter++;
      }
    }
  }

  return {
    area: regionCells.length,
    perimeter,
    cellType: plantType,
  };
}

async function calculateTotalCost() {
  const grid = await fetchInput();
  const rows = grid.length;
  const cols = grid[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  let totalCost = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!visited[i][j]) {
        const { area, perimeter } = exploreRegion(i, j, grid, visited);
        totalCost += area * perimeter;
      }
    }
  }

  return totalCost;
}

 (async () => {
  try {
    const result = await calculateTotalCost();
    console.log(`The total price of fencing all regions: ${result}`);
  } catch (error) {
    console.error("Error solving the puzzle:", error);
  }
})();
