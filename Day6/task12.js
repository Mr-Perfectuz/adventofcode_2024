import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const url = 'https://adventofcode.com/2024/day/6/input';

const cookies = {
  session: process.env.SESSION,
};
const DIRECTIONS = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

async function simulateGuard(map, startX, startY, startDirection) {
  const visited = new Set();
  let x = startX,
    y = startY;
  let direction = startDirection;

  while (true) {
    const visitedKey = `${x},${y},${direction}`;
    if (visited.has(visitedKey)) {
      return true;
    }

    visited.add(visitedKey);

    const nextX = x + DIRECTIONS[direction][0];
    const nextY = y + DIRECTIONS[direction][1];

    if (
      nextX < 0 ||
      nextX >= map[0].length ||
      nextY < 0 ||
      nextY >= map.length
    ) {
      return false;
    }

    if (map[nextY][nextX] === '#') {
      direction = (direction + 1) % 4;
    } else if (map[nextY][nextX] === '.') {
      x = nextX;
      y = nextY;
    } else {
      return false;
    }
  }
}

async function Day6(map, startX, startY, startDirection) {
  let validPositions = 0;

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      if (map[y][x] === '.' && !(x === startX && y === startY)) {
        map[y][x] = 'O';

        if (await simulateGuard(map, startX, startY, startDirection)) {
          validPositions++;
        }

        map[y][x] = '.';
      }
    }
  }

  return validPositions;
}

async function fetchMapData() {
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });

  const mapData = await response.text();
  return mapData.split('\n').map((line) => line.split(''));
}

async function main() {
  const mapData = await fetchMapData();

  const startX = 9,
    startY = 6,
    startDirection = 0;

  const validPositions = await Day6(mapData, startX, startY, startDirection);

  console.log(`Valid positions: ${validPositions}`);
}

main().catch((err) => console.error(err));
