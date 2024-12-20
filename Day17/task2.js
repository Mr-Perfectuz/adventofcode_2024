import fs from "fs";

const parseInput = () => {
  const data = fs.readFileSync("input.txt", "utf8");
  const lines = data.trim().split("\n");

  const rA = parseInt(lines[0].split(":")[1].trim(), 10);
  const rB = 0;
  const rC = 0;
  const program = lines[1].split(",").map(Number);

  return { rA, rB, rC, opr: program };
};

const runProgram = (input) => {
  let { rA, rB, rC, opr } = input;
  let p = 0;
  let outputs = [];

  while (p < opr.length) {
    const opcode = opr[p];
    const operand = opr[p + 1];

    switch (opcode) {
      case 0: // adv
        rA = Math.trunc(rA / 2 ** operand);
        p += 2;
        break;

      case 1: // bxl
        rB = rB ^ operand;
        p += 2;
        break;

      case 2: // bst
        rB = operand % 8;
        p += 2;
        break;

      case 3: // jnz
        if (rA !== 0) {
          p = operand;
        } else {
          p += 2;
        }
        break;

      case 4: // bxc
        rB = rB ^ rC;
        p += 2;
        break;

      case 5: // out
        outputs.push(operand % 8);
        p += 2;
        break;

      case 6: // bdv
        rB = Math.trunc(rA / 2 ** operand);
        p += 2;
        break;

      case 7: // cdv
        rC = Math.trunc(rA / 2 ** operand);
        p += 2;
        break;

      default:
        throw new Error(`Unknown opcode: ${opcode}`);
    }
  }

  return outputs.join(",");
};

const findInitialValue = (input) => {
  let res = 1;
  while (true) {
    input.rA = res;
    const output = runProgram(input);
    const programAsString = input.opr.join(",");
    if (output === programAsString) {
      return res;
    }
    res++;
  }
};

const main = () => {
  const input = parseInput();
  const result = findInitialValue(input);
  console.log(`The lowest initial value for register A is: ${result}`);
};

main();
