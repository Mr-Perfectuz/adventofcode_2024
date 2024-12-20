// This function reads the input from stdin
async function fetchInput() {
  const input = await fetch("https://adventofcode.com/2024/day/5/input", {
    headers: {
      session: process.env.SESSION,
    },
  });
  return input.text();
}

async function Day5() {
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

  let res = 0;
  let validInstructions = [];

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

      const invalidNumber = passedNumbers.some((passedNum) =>
        after.includes(passedNum)
      );

      if (invalidNumber) {
        passedNumbers.push(number);
        isValidInstruction = false;
        break;
      }

      passedNumbers.push(number);
    }

    if (isValidInstruction) {
      const middleIndex = Math.floor(instruction.length / 2);
      res += instruction[middleIndex];
      validInstructions.push(instruction);
    }
  });

  console.log(res);
  validInstructions.forEach((instruction) =>
    console.log(instruction.join(", "))
  );
}

Day5();
