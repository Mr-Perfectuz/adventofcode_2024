import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = "https://adventofcode.com/2024/day/4/input";

const cookies = {
  session: process.env.SESSION,
};

async function Day4() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `session=${cookies.session}`,
      },
    });

    const input = await response.text();

    const grid = input
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    console.log("Calculating...");

    const word = "XMAS";
    const rows = grid.length;
    const cols = grid[0].length;
    let count = 0;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
      [-1, -1],
      [1, 1],
      [-1, 1],
      [1, -1],
    ];

    function searchFrom(x, y, dx, dy) {
      for (let i = 0; i < word.length; i++) {
        const newX = x + dx * i;
        const newY = y + dy * i;

        if (
          newX < 0 ||
          newX >= rows ||
          newY < 0 ||
          newY >= cols ||
          grid[newX][newY] !== word[i]
        ) {
          return false;
        }
      }
      return true;
    }

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        for (const [dx, dy] of directions) {
          if (searchFrom(i, j, dx, dy)) {
            count++;
          }
        }
      }
    }

    console.log("Count:", count);

    return count;
  } catch (error) {
    console.error("Error fetching input:", error);
  }
}

Day4();
