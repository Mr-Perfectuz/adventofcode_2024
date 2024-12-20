import fetch from "node-fetch";
import dotenv from "dotenv";
dotenv.config();

const url = "https://adventofcode.com/2024/day/21/input";

const cookies = {
  session: process.env,
};

async function cleanData() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `session=${cookies.session}`,
      },
    });

    const input = await response.text();
    console.log("Calculating...");
    const regex = /mul\((\d+),(\d+)\)/g;
    let totalSum = 0;
    let match;

    while ((match = regex.exec(input)) !== null) {
      const x = parseInt(match[1], 10);
      const y = parseInt(match[2], 10);

      totalSum += x * y;
    }

    console.log("Total Sum:", totalSum);
  } catch (error) {
    console.error("Error fetching input:", error);
  }
}

cleanData();
