async function fetchInput() {
  const input = await fetch("https://adventofcode.com/2024/day/5/input", {
    headers: {
      session: process.env.SESSION,
    },
  });
  return input.text();
}

async function processInstructions() {
  const inputText = await fetchInput();

  const lines = inputText.trim().split("\n");

  let rules = new Map();
  let instructions = [];

  let isPart1 = true;

  lines.forEach((line) => {
    if (line.trim() === "") {
      if (isPart1) {
        isPart1 = false;
        return;
      } else {
        return;
      }
    }

    if (isPart1) {
      const [beforeStr, afterStr] = line.split("|");
      const beforeNumber = parseInt(beforeStr.trim());
      const afterNumber = parseInt(afterStr.trim());

      if (!rules.has(beforeNumber)) {
        rules.set(beforeNumber, { before: [], after: [] });
      }
      if (!rules.has(afterNumber)) {
        rules.set(afterNumber, { before: [], after: [] });
      }

      rules.get(beforeNumber).after.push(afterNumber);
      rules.get(afterNumber).before.push(beforeNumber);
    } else {
      const instruction = line.split(",").map((num) => parseInt(num.trim()));
      instructions.push(instruction);
    }
  });

  const invalidInstructions = Day10(rules, instructions);

  let res = 0;
  let updatedInstructions = [];

  invalidInstructions.forEach((instruction) => {
    let i = 0;
    while (i < instruction.length) {
      let current = instruction[i];
      const rule = rules.get(current);

      if (!rule) {
        i++;
        continue;
      }

      const { before, after } = rule;
      let isChanged = false;

      for (let j = i + 1; j < instruction.length; j++) {
        const next = instruction[j];
        if (before.includes(next)) {
          // Swap elements in the instruction
          [instruction[i], instruction[j]] = [instruction[j], instruction[i]];
          updatedInstructions.push(instruction.slice()); // Add a copy of the updated instruction
          isChanged = true;
          break;
        }
      }

      if (!isChanged) {
        i++;
      }
    }

    const middleIndex = Math.floor(instruction.length / 2);
    res += instruction[middleIndex];
  });

  console.log(res);
}

function Day10(rules, instructions) {
  const invalidInstructions = [];

  instructions.forEach((instruction) => {
    let passedNumbers = [];
    let isValidInstruction = true;

    for (let number of instruction) {
      const rule = rules.get(number);

      if (!rule) {
        passedNumbers.push(number);
        continue;
      }

      const { before, after } = rule;

      const hasInvalidPassedNumber = passedNumbers.some((passedNum) =>
        after.includes(passedNum)
      );

      if (hasInvalidPassedNumber) {
        passedNumbers.push(number);
        isValidInstruction = false;
        break;
      }

      passedNumbers.push(number);
    }

    if (!isValidInstruction) {
      invalidInstructions.push(instruction);
    }
  });

  return invalidInstructions;
}

processInstructions();
