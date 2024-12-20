import fetch from "node-fetch";

const url = "https://adventofcode.com/2024/day/7/input";

const cookies = {
  session: process.env.SESSION,
};

async function fetchInput() {
  try {
    const response = await fetch(url, {
      headers: {
        Cookie: `session=${cookies.session}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch input");
    }

    const data = await response.text();

    return data.trim().split("\n");
  } catch (error) {
    console.error("Error fetching input:", error);
    return null;
  }
}

function validate(numbers, operators) {
  let result = numbers[0];

  for (let i = 0; i < operators.length; i++) {
    const num = numbers[i + 1];
    const op = operators[i];

    if (op === "+") {
      result += num;
    } else if (op === "*") {
      result *= num;
    } else if (op === "||") {
      result = parseInt(result.toString() + num.toString(), 10);
    }
  }

  return result;
}

function getComb(length) {
  const operators = ["+", "*", "||"];
  const combinations = [];
  const totalCombinations = Math.pow(operators.length, length);

  for (let i = 0; i < totalCombinations; i++) {
    let combination = [];
    let index = i;

    for (let j = 0; j < length; j++) {
      combination.push(operators[index % operators.length]);
      index = Math.floor(index / operators.length);
    }

    combinations.push(combination);
  }

  return combinations;
}

function checkEquation(testValue, numbers) {
  const operator_comb = getComb(numbers.length - 1);
  for (let operators of operator_comb) {
    const result = validate(numbers, operators);
    if (result === testValue) {
      return true;
    }
  }
  return false;
}

async function solve() {
  const input = await fetchInput();
  if (!input) {
    console.log("Error fetching input.");
    return;
  }

  let result = 0;

  for (let line of input) {
    const [testValueStr, numbersStr] = line.split(":");
    const testValue = parseInt(testValueStr, 10);
    const numbers = numbersStr.trim().split(" ").map(Number);

    if (checkEquation(testValue, numbers)) {
      result += testValue;
    }
  }

  console.log(`Total Result: ${result}`);
}

solve();
