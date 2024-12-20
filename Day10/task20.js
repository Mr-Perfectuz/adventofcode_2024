import fs from "fs";
import path from "path";
import process from "node:process";

let directions = [
  [0, -1],
  [0, 1],
  [1, 0],
  [-1, 0],
];

function part1(data) {
  // Solve part 1
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

  let posstiblePathCount = {};

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
          posstiblePathCount[`${cy},${cx}-${y},${x}`] = true;
        }
      }
    }
  }

  return Object.keys(posstiblePathCount).length;
}

function part2(data) {
  // Solve part 2
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

export function solve(puzzleInput) {
  // Parse the given input
  const data = puzzleInput.split(/\r?\n/);

  // Get the solutions for each problem
  const solution1 = part1(data);
  const solution2 = part2(data);

  return [solution1, solution2];
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2);

  args.forEach((filePath) => {
    const puzzleInput = fs.readFileSync(path.resolve(filePath), "utf8");
    const solutions = solve(puzzleInput);
    console.log(solutions.map(String).join("\n"));
  });
}
