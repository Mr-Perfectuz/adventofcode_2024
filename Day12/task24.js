import fs from "fs";
import path from "path";

// Directions for Up, Down, Left, Right
const directions = [
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
  [-1, 0], // Up
];

function fetchInput(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.split("\n").map((line) => line.trim()));
      }
    });
  });
}

async function solve() {
  const lines = await fetchInput("input.txt");
  const R = lines.length;
  const C = lines[0].length;
  const mx = lines.map((line) => line.split(""));
  const dirs = directions;
  const visited = new Set();
  let res = 0;

  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      if (visited.has(`${i},${j}`)) continue;
      visited.add(`${i},${j}`);

      let q = [[i, j]];
      let p = 0; // perimeter
      let a = 0; // area

      while (q.length > 0) {
        const [r, c] = q.shift();
        a++;

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 &&
            nr < R &&
            nc >= 0 &&
            nc < C &&
            mx[nr][nc] === mx[r][c]
          ) {
            if (!visited.has(`${nr},${nc}`)) {
              visited.add(`${nr},${nc}`);
              q.push([nr, nc]);
            }
          } else {
            p++;
          }
        }
      }

      res += a * p;
    }
  }

  console.log(`First part result: ${res}`);
  return res;
}

function find(UF, x) {
  if (x !== UF[x]) {
    UF[x] = find(UF, UF[x]);
  }
  return UF[x];
}

function union(UF, x, y) {
  UF[find(UF, x)] = find(UF, y);
}

async function solve2() {
  const lines = await fetchInput("input.txt");
  const R = lines.length;
  const C = lines[0].length;
  const mx = lines.map((line) => line.split(""));
  const dirs = directions;
  const visited = new Set();
  let res = 0;

  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      if (visited.has(`${i},${j}`)) continue;
      visited.add(`${i},${j}`);

      let q = [[i, j]];
      let a = 0; // area
      let sides = 0; // sides count
      let UF = {};

      while (q.length > 0) {
        const [r, c] = q.shift();
        a++;

        for (const [dr, dc] of dirs) {
          const nr = r + dr;
          const nc = c + dc;

          if (
            nr >= 0 &&
            nr < R &&
            nc >= 0 &&
            nc < C &&
            mx[nr][nc] === mx[r][c]
          ) {
            if (!visited.has(`${nr},${nc}`)) {
              visited.add(`${nr},${nc}`);
              q.push([nr, nc]);
            }
          } else {
            const br = r + dr / 2;
            const bc = c + dc / 2;
            UF[`${br},${bc}`] = `${br},${bc}`;

            if (
              dr === 0 &&
              UF[`${br - 1},${bc}`] &&
              mx[r][c] === mx[r - 1][c]
            ) {
              union(UF, `${br},${bc}`, `${br - 1},${bc}`);
            }
            if (
              dr === 0 &&
              UF[`${br + 1},${bc}`] &&
              mx[r][c] === mx[r + 1][c]
            ) {
              union(UF, `${br},${bc}`, `${br + 1},${bc}`);
            }
            if (
              dc === 0 &&
              UF[`${br},${bc + 1}`] &&
              mx[r][c] === mx[r][c + 1]
            ) {
              union(UF, `${br},${bc}`, `${br},${bc + 1}`);
            }
            if (
              dc === 0 &&
              UF[`${br},${bc - 1}`] &&
              mx[r][c] === mx[r][c - 1]
            ) {
              union(UF, `${br},${bc}`, `${br},${bc - 1}`);
            }
          }
        }
      }

      const uniqueSides = new Set(Object.values(UF).map((x) => find(UF, x)));
      sides = uniqueSides.size;
      res += a * sides;
    }
  }

  console.log(`Second part result: ${res}`);
  return res;
}

solve().then(() => {
  solve2();
});
