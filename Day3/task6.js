import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = "https://adventofcode.com/2024/day/3/input";

const cookies = {
  session: process.env.SESSION,
};

async function cleanMemory() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `session=${cookies.session}`,
      },
    });

    const input = await response.text();
    console.log("Calculating...");

    const regex = /mul\((\d+),(\d+)\)|do\(\)|don't\(\)/g;

    let totalSum = 0;
    let mulEnabled = true;
    let match;

    while ((match = regex.exec(input)) !== null) {
      if (match[0] === "do()") {
        mulEnabled = true;
      } else if (match[0] === `don't()`) {
        mulEnabled = false;
      } else if (match[0].startsWith("mul(")) {
        if (mulEnabled) {
          const x = parseInt(match[1], 10);
          const y = parseInt(match[2], 10);
          totalSum += x * y;
        }
      }
    }

    console.log("Total Multiplications:", totalSum);
  } catch (error) {
    console.error("Error fetching input:", error);
  }
}

cleanMemory();
