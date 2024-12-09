import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = "https://adventofcode.com/2024/day/6/input";

const cookies = {
  session: process.env.SESSION,
};
const DIRECTIONS = [
  [-1, 0], // Up
  [0, 1], // Right
  [1, 0], // Down
  [0, -1], // Left
];

// Function to simulate guard movement
async function simulateGuard(map, startX, startY, startDirection) {
  const visited = new Set(); // To track visited positions with direction
  let x = startX,
    y = startY;
  let direction = startDirection;

  while (true) {
    // Check if the guard has visited this position with the same direction
    const visitedKey = `${x},${y},${direction}`;
    if (visited.has(visitedKey)) {
      return true; // Loop detected
    }

    visited.add(visitedKey);

    // Move the guard
    const nextX = x + DIRECTIONS[direction][0];
    const nextY = y + DIRECTIONS[direction][1];

    // Check if the guard moves out of bounds
    if (
      nextX < 0 ||
      nextX >= map[0].length ||
      nextY < 0 ||
      nextY >= map.length
    ) {
      return false; // Out of bounds, no loop
    }

    // Check what the guard encounters
    if (map[nextY][nextX] === "#") {
      // Obstacle, turn right
      direction = (direction + 1) % 4;
    } else if (map[nextY][nextX] === ".") {
      // Empty space, move forward
      x = nextX;
      y = nextY;
    } else {
      return false; // Invalid state (shouldn't happen)
    }
  }
}

// Function to count valid positions for placing an obstruction
async function countValidObstructions(map, startX, startY, startDirection) {
  let validPositions = 0;

  // Iterate over all positions in the grid
  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[0].length; x++) {
      // Check if the current position is a valid position for the obstruction
      if (map[y][x] === "." && !(x === startX && y === startY)) {
        // Avoid the guard's starting position
        // Place the obstruction and simulate the path
        map[y][x] = "O"; // Place the obstruction

        if (await simulateGuard(map, startX, startY, startDirection)) {
          validPositions++;
        }

        map[y][x] = "."; // Remove the obstruction
      }
    }
  }

  return validPositions;
}

// Function to fetch and process the map data
async function fetchMapData() {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });

  const mapData = await response.text();
  return mapData.split("\n").map((line) => line.split(""));
}

// Main function to run the logic
async function main() {
  // Fetch the map data
  const mapData = await fetchMapData();

  // Starting position of the guard (you need to know the coordinates and direction)
  const startX = 9, // Example: set to the starting X position (make sure it's correct from input)
    startY = 6, // Example: set to the starting Y position (make sure it's correct from input)
    startDirection = 0; // Starting facing "Up" (0: Up, 1: Right, 2: Down, 3: Left)

  // Count valid positions for placing an obstruction
  const validPositions = await countValidObstructions(
    mapData,
    startX,
    startY,
    startDirection
  );

  console.log(`Valid positions: ${validPositions}`);
}

main().catch((err) => console.error(err));
