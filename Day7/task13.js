import fetch from 'node-fetch';

const url = 'https://adventofcode.com/2024/day/7/input';
const cookies = {
  session: process.env.SESSION,
};

async function fetchInput() {
  const response = await fetch(url, {
    headers: {
      Cookie: `session=${cookies.session}`,
    },
  });
  const data = await response.text();
  console.log(data);
  return data.trim().split('\n');
}

function Day7(numbers, operators) {
  let result = numbers[0];

  for (let i = 0; i < operators.length; i++) {
    if (operators[i] === '+') {
      result += numbers[i + 1];
    } else if (operators[i] === '*') {
      result *= numbers[i + 1];
    }
  }

  return result;
}

function getComb(length) {
  const combinations = [];
  const operatorOptions = ['+', '*'];

  function gen_Comb(current) {
    if (current.length === length) {
      combinations.push(current);
      return;
    }

    for (let op of operatorOptions) {
      gen_Comb(current + op);
    }
  }

  gen_Comb('');
  return combinations;
}

function checkEquation(testValue, numbers) {
  const op_Comb = getComb(numbers.length - 1);
  for (let operators of op_Comb) {
    const result = Day7(numbers, operators.split(''));
    if (result === testValue) {
      return true;
    }
  }
  return false;
}

async function solve() {
  const input = await fetchInput();
  let result = 0;

  for (let line of input) {
    const [testValueStr, numbersStr] = line.split(':');
    const testValue = parseInt(testValueStr, 10);
    const numbers = numbersStr.trim().split(' ').map(Number);

    if (checkEquation(testValue, numbers)) {
      result += testValue;
    }
  }

  console.log(`Total Result: ${result}`);
}

solve();
