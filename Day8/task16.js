import fetch from 'node-fetch';

const url = 'https://adventofcode.com/2024/day/8/input';

const cookies = {
  session: process.env.SESSION,
};

async function getInput() {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });
  const input = await response.text();
  return input.split('\n').map((line) => line.trim());
}

async function solve() {
  const s = await getInput();
  const n = 50;
  const arr = Array.from({ length: n }, () => Array(n).fill(''));
  const d = {};
  const seen = new Set();

  for (let i = 0; i < n; i++) {
    const line = s[i];
    for (let j = 0; j < n; j++) {
      const ch = line[j];
      arr[i][j] = ch;
      if (ch !== '.') {
        if (!d[ch]) {
          d[ch] = [];
        }
        d[ch].push([i, j]);
      }
    }
  }

  function doCalculations(seen, ls, i, j, arr) {
    const [y1, x1] = ls[i];
    const [y2, x2] = ls[j];
    const dy = y2 - y1;
    const dx = x2 - x1;

    let ny = y1;
    let nx = x1;
    while (ny >= 0 && ny < n && nx >= 0 && nx < n) {
      arr[ny][nx] = '#';
      seen.add(`${ny},${nx}`);
      ny -= dy;
      nx -= dx;
    }

    ny = y2;
    nx = x2;
    while (ny >= 0 && ny < n && nx >= 0 && nx < n) {
      seen.add(`${ny},${nx}`);
      arr[ny][nx] = '#';
      ny += dy;
      nx += dx;
    }
  }

  for (let key in d) {
    const positions = d[key];
    const k = positions.length;
    if (k === 1) continue;

    for (let i = 0; i < k; i++) {
      for (let j = i + 1; j < k; j++) {
        doCalculations(seen, positions, i, j, arr);
      }
    }
  }

  console.log(seen.size);
}

solve().catch((err) => console.error('Error:', err));
