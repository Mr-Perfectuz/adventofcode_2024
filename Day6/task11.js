import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = "https://adventofcode.com/2024/day/6/input";

const cookies = {
  session: process.env.SESSION,
};
// Enum for the direction the guard is facing
const Direction = {
  UP: "UP",
  RIGHT: "RIGHT",
  DOWN: "DOWN",
  LEFT: "LEFT",
};

// Enum for the map position types
const PositionType = {
  FREE: ".",
  OBSTACLE: "#",
  PASSED: "X",
};

// Function to simulate the guard's movement
async function simulateGuardPath() {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });

  const mapData = await response.text();
  console.log("Calculating...");
  const map = mapData.split("\n").map((line) => line.split(""));

  let guard = { x: 0, y: 0, direction: Direction.UP }; // Guard's position and direction
  let visitedPositions = new Set(); // To track distinct positions visited by the guard

  // Find the guard's initial position
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === "^") {
        guard.x = x;
        guard.y = y;
        map[y][x] = PositionType.FREE; // Remove the '^' marker
      }
    }
  }

  // Function to mark the position as visited
  function markAsVisited(x, y) {
    visitedPositions.add(`${x},${y}`);
    map[y][x] = PositionType.PASSED; // Mark the current position as passed
  }

  // Start the guard's simulation
  let isOut = false;

  while (!isOut) {
    const { x, y, direction } = guard;

    // Mark the current position as visited
    markAsVisited(x, y);

    // Determine the next position based on the guard's direction
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

    // Check if the guard is out of bounds
    if (
      nextY < 0 ||
      nextY >= map.length ||
      nextX < 0 ||
      nextX >= map[nextY].length
    ) {
      isOut = true;
      break;
    }

    // Check the position the guard is attempting to move to
    const newPos = map[nextY][nextX];

    if (newPos === PositionType.OBSTACLE) {
      // If there's an obstacle, turn right
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

  // Output the results
  console.log(`The guard visited ${visitedPositions.size} distinct positions.`);
  return visitedPositions.size;
}

// Call the function to run the simulation
simulateGuardPath();
