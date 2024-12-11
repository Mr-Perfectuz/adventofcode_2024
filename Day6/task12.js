import fetch from 'node-fetch';

const url = 'https://adventofcode.com/2024/day/6/input';

const cookies = {
  session: process.env.SESSION,
};

async function partTwo() {
  const grid = await parseInput();
  let si = -1,
    sj = -1;
  const row = grid.length;
  const col = grid[0].length;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j] === '^') {
        si = i;
        sj = j;
        break;
      }
    }
  }

  let count = 0;

  for (let i = 0; i < row; i++) {
    for (let j = 0; j < col; j++) {
      if (grid[i][j] === '.') {
        grid[i][j] = '#';
        console.log(`Checking for loop at: ${i}, ${j}`);
        count += hasLoop(grid, si, sj, row, col) ? 1 : 0;
        grid[i][j] = '.';
      }
    }
  }

  console.log(count);
}

function hasLoop(grid, si, sj, row, col) {
  const past = Array.from({ length: row }, () =>
    Array.from({ length: col }, () => new Set())
  );
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  let dir = 0;

  while (true) {
    if (past[si][sj].has(dir)) {
      return true;
    } else {
      past[si][sj].add(dir);
    }

    const ni = si + dirs[dir][0];
    const nj = sj + dirs[dir][1];

    if (ni < 0 || ni >= row || nj < 0 || nj >= col) {
      break;
    }

    if (grid[ni][nj] === '#') {
      dir = (dir + 1) % 4;
      continue;
    }

    si = ni;
    sj = nj;
  }

  return false;
}

async function parseInput() {
  const response = await fetch(url, {
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });
  const result = await response.text();

  return result.split('\n').map((line) => line.split(''));
}

const part = process.argv[2];

if (part === 'one') {
  partOne();
} else if (part === 'two') {
  partTwo();
} else {
  console.log('Invalid argument');
}
