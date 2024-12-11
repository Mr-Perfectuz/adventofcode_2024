import fetch from 'node-fetch';

const url = 'https://adventofcode.com/2024/day/8/input';

const cookies = {
  session: process.env.SESSION,
};
async function fetchInput() {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch input from Advent of Code');
  }

  const input = await response.text();
  return input.trim().split('\n');
}

function doAntinode(seen, ls, i, j, arr, n) {
  const [y1, x1] = ls[i];
  const [y2, x2] = ls[j];
  const dy = y2 - y1;
  const dx = x2 - x1;

  let ny = y1 - dy,
    nx = x1 - dx;
  while (ny >= 0 && ny < n && nx >= 0 && nx < n) {
    arr[ny][nx] = '#';
    seen.add(`${ny},${nx}`);
    break;
    ny -= dy;
    nx -= dx;
  }

  (ny = y2 + dy), (nx = x2 + dx);
  while (ny >= 0 && ny < n && nx >= 0 && nx < n) {
    arr[ny][nx] = '#';
    seen.add(`${ny},${nx}`);
    break;
    ny += dy;
    nx += dx;
  }
}

async function solve() {
  const inputLines = await fetchInput();
  const n = inputLines.length;
  const arr = Array.from({ length: n }, () => Array(n).fill(''));
  const d = {};
  const seen = new Set();

  for (let i = 0; i < n; i++) {
    const x = inputLines[i];
    for (let idx = 0; idx < n; idx++) {
      arr[i][idx] = x[idx];
      const ch = x[idx];
      if (ch !== '.') {
        if (!d[ch]) {
          d[ch] = [];
        }
        d[ch].push([i, idx]);
      }
    }
  }

  for (let freq in d) {
    const ls = d[freq];
    const k = ls.length;
    if (k === 1) continue;
    for (let i = 0; i < k; i++) {
      for (let j = i + 1; j < k; j++) {
        doAntinode(seen, ls, i, j, arr, n);
      }
    }
  }

  console.log(seen.size);
}

solve().catch((err) => console.error('Error:', err));
