import fs from "fs";

function calculateFewestTokens(input) {
  const OFFSET = 10000000000000;

  function adjustPosition(position) {
    return { X: position.X + OFFSET, Y: position.Y + OFFSET };
  }

  function manhattanDistance(point1, point2) {
    return Math.abs(point1.X - point2.X) + Math.abs(point1.Y - point2.Y);
  }

  let totalTokens = 0;

  input.forEach((line) => {
    const regex =
      /Button A: X\+(-?\d+), Y\+(-?\d+)\s+Button B: X\+(-?\d+), Y\+(-?\d+)\s+Prize: X=(\d+), Y=(\d+)/;
    const match = line.match(regex);

    if (match) {
      const buttonA = { X: parseInt(match[1]), Y: parseInt(match[2]) };
      const buttonB = { X: parseInt(match[3]), Y: parseInt(match[4]) };
      const prize = { X: parseInt(match[5]), Y: parseInt(match[6]) };

      const adjustedButtonA = adjustPosition(buttonA);
      const adjustedButtonB = adjustPosition(buttonB);
      const adjustedPrize = adjustPosition(prize);

      const distanceA = manhattanDistance(adjustedButtonA, adjustedPrize);
      const distanceB = manhattanDistance(adjustedButtonB, adjustedPrize);

      totalTokens += Math.min(distanceA, distanceB);
    }
  });

  return totalTokens;
}

fs.readFile("input.txt", "utf8", (err, data) => {
  if (err) {
    console.error("Error reading the file:", err);
    return;
  }

  const inputLines = data.split("\n");

  const result = calculateFewestTokens(inputLines);

  console.log(`The fewest tokens required: ${result}`);
});
