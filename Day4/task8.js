import fetch from "node-fetch";

const url = "https://adventofcode.com/2024/day/4/input";
const cookies = {
  session: process.env.SESSION,
};

async function fetchInput() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Cookie: `session=${cookies.session}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch input: ${response.statusText}`);
    }

    const data = await response.text();

    const lines = data.split("\n").map((line) => [...line.trim()]);

    for (const line of lines) {
      console.log(line.join(""));
    }

    let xmasCount = 0;

    for (let i = 1; i < lines.length - 1; i++) {
      const line = lines[i];

      for (let j = 1; j < line.length - 1; j++) {
        const c = line[j];

        if (c === "A") {
          const lowerLine = lines[i + 1];
          const upperLine = lines[i - 1];
          const lowLeft = lowerLine[j - 1];
          const lowRight = lowerLine[j + 1];
          const upLeft = upperLine[j - 1];
          const upRight = upperLine[j + 1];

          let lowLeftToRightUpIsValid = false;
          let lowRightToUpLeftIsValid = false;

          if (lowLeft === "M" && upRight === "S") {
            lowLeftToRightUpIsValid = true;
          }
          if (lowLeft === "S" && upRight === "M") {
            lowLeftToRightUpIsValid = true;
          }
          if (lowRight === "M" && upLeft === "S") {
            lowRightToUpLeftIsValid = true;
          }
          if (lowRight === "S" && upLeft === "M") {
            lowRightToUpLeftIsValid = true;
          }

          if (lowLeftToRightUpIsValid && lowRightToUpLeftIsValid) {
            xmasCount++;
          }
        }
      }
    }

    console.log("Count:", xmasCount);
  } catch (error) {
    console.error("Error fetching the input:", error);
  }
}

fetchInput();
