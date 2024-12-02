import { inputData as input } from "./inputData.js";

function isSafe(report) {
  const levels = report.split(" ").map(Number);
  const differences = [];
  for (let i = 0; i < levels.length - 1; i++) {
    differences.push(levels[i + 1] - levels[i]);
  }
  const allIncreasing = differences.every((diff) => diff >= 1 && diff <= 3);
  const allDecreasing = differences.every((diff) => diff >= -3 && diff <= -1);
  return allIncreasing || allDecreasing;
}

function reportsSum(input) {
  const reports = input.trim().split("\n");

  let safeCount = 0;
  for (const report of reports) {
    if (isSafe(report)) {
      safeCount++;
    }
  }

  return safeCount;
}

const safeReports = reportsSum(input);
console.log(`Number of safe reports: ${safeReports}`);
