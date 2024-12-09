import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = "https://adventofcode.com/2024/day/6/input";

const cookies = {
  session: process.env.SESSION,
};
const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
};

const PositionType = {
  FREE: ".",
  OBSTACLE: "#",
  PASSED: "X",
};

async function Day6() {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });

  const mapData = await response.text();
  console.log("Calculating...");
  const map = mapData.split("\n").map((line) => line.split(""));

  let guard = { x: 0, y: 0, direction: Direction.UP };
  let visited = new Set();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "^") {
        guard.x = x;
        guard.y = y;
        map[y][x] = PositionType.FREE;
      }
    }
  }

  function markAsVisited(x, y) {
    visited.add(`${x},${y}`);
    map[y][x] = PositionType.PASSED;
  }

  let isOut = false;

  while (!isOut) {
    const { x, y, direction } = guard;

    markAsVisited(x, y);

    let nextX = x;
    let nextY = y;

    switch (direction) {
      case Direction.UP:
        nextY -= 1;
        break;
      case Direction.RIGHT:
        nextX += 1;
        break;
      case Direction.DOWN:
        nextY += 1;
        break;
      case Direction.LEFT:
        nextX -= 1;
        break;
    }

    if (
      nextY < 0 ||
      nextY >= map.length ||
      nextX < 0 ||
      nextX >= map[nextY].length
    ) {
      isOut = true;
      break;
    }

    const newPos = map[nextY][nextX];

    if (newPos === PositionType.OBSTACLE) {
      switch (direction) {
        case Direction.UP:
          guard.direction = Direction.RIGHT;
          break;
        case Direction.RIGHT:
          guard.direction = Direction.DOWN;
          break;
        case Direction.DOWN:
          guard.direction = Direction.LEFT;
          break;
        case Direction.LEFT:
          guard.direction = Direction.UP;
          break;
      }
    } else {
      // Move forward
      guard.x = nextX;
      guard.y = nextY;
    }
  }

  console.log(`The guard visited ${visited.size} distinct positions.`);
  return visited.size;
}

Day6();
