import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import process from "node:process";

// Directions for pathfinding (up, down, left, right)
let directions = [
  [0, -1], // up
  [0, 1], // down
  [1, 0], // right
  [-1, 0], // left
];

// Part 1 logic
function part1(data) {
  data = data.map((row) => row.split("").map(Number));
  const trailheads = [];

  const col = data.length;
  const row = data[0].length;

  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      if (data[i][j] === 0) {
        trailheads.push([i, j]);
      }
    }
  }

  let possiblePathCount = {};

  while (trailheads.length > 0) {
    const [y, x] = trailheads.pop();
    const path = [[y, x]];

    while (path?.length > 0) {
      const [cy, cx] = path.pop();

      for (let [dy, dx] of directions) {
        const ny = cy + dy;
        const nx = cx + dx;

        if (data[ny]?.[nx] && data[cy]?.[cx] + 1 === data[ny]?.[nx]) {
          path.push([ny, nx]);
        } else if (data[cy]?.[cx] === 9) {
          possiblePathCount[`${cy},${cx}-${y},${x}`] = true;
        }
      }
    }
  }

  return Object.keys(possiblePathCount).length;
}

// Part 2 logic
function part2(data) {
  data = data.map((row) => row.split("").map(Number));
  const trailheads = [];

  const col = data.length;
  const row = data[0].length;

  for (let i = 0; i < col; i++) {
    for (let j = 0; j < row; j++) {
      if (data[i][j] === 0) {
        trailheads.push([i, j]);
      }
    }
  }

  let possiblePaths = {};

  while (trailheads.length > 0) {
    const [y, x] = trailheads.pop();
    const path = [[y, x, ""]];

    while (path?.length > 0) {
      const [cy, cx, pathString] = path.pop();

      for (let [dy, dx] of directions) {
        const ny = cy + dy;
        const nx = cx + dx;

        if (ny >= 0 && ny < col && nx >= 0 && nx < row) {
          if (data[cy][cx] + 1 === data[ny][nx]) {
            path.push([
              ny,
              nx,
              pathString ? `${pathString}-${cy},${cx}` : `${cy},${cx}`,
            ]);
          } else if (data[cy]?.[cx] === 9) {
            const key = `${y},${x}`;
            const newPath = pathString
              ? `${pathString}-${cy},${cx}`
              : `${cy},${cx}`;
            possiblePaths[key] = new Set([
              ...(possiblePaths[key] || []),
              newPath,
            ]);
          }
        }
      }
    }
  }

  const paths = Object.values(possiblePaths).map((paths) => paths.size);
  let sm = 0;
  for (let i = 0; i < paths.length; i++) {
    sm += paths[i];
  }
  return sm;
}

// Main solve function
export function solve(puzzleInput) {
  const data = puzzleInput.split(/\r?\n/);
  const solution1 = part1(data);
  const solution2 = part2(data);
  return [solution1, solution2];
}

// Fetch puzzle input using node-fetch
async function fetchInput() {
  const url = "https://adventofcode.com/2024/day/10/input";
  const cookies = {
    session: process.env.SESSION,
  };

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `session=${cookies.session}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch input: ${response.statusText}`);
    }

    const puzzleInput = await response.text();
    const [solution1, solution2] = solve(puzzleInput);

    console.log(`Solution for Part 1: ${solution1}`);
    console.log(`Solution for Part 2: ${solution2}`);
  } catch (error) {
    console.error(`Error fetching input: ${error.message}`);
  }
}

fetchInput();
