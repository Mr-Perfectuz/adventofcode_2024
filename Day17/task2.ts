const getAnswer = (input: string, A: bigint) => {
  const [registers, program] = input.split("\n\n");
  const registerValues = registers
    .split("\n")
    .map((line) => BigInt(line.match(/\d+/g)![0]));
  const combo: (bigint | string | null)[] = [
    BigInt(0),
    BigInt(1),
    BigInt(2),
    BigInt(3),
    "A",
    "B",
    "C",
    null,
  ];
  const instructions = program
    .match(/\d+/g)!
    .map((instruction) => Number(instruction));

  registerValues[0] = A;

  const getComboValue = (index: bigint | number): bigint => {
    const value = combo[index as number];
    if (typeof value === "string") {
      return registerValues[(index as number) - 4];
    }
    return value === null ? BigInt(Infinity) : value;
  };

  let flag = true;
  let initialIndex = 0;
  let result: bigint[] = [];

  const handleOperation = (opcode: number, operand: number) => {
    if (opcode === 0) {
      registerValues[0] =
        registerValues[0] / BigInt(Math.pow(2, Number(getComboValue(operand))));
    } else if (opcode === 1) {
      registerValues[1] ^= BigInt(operand);
    } else if (opcode === 2) {
      registerValues[1] = getComboValue(operand) % BigInt(8);
    } else if (opcode === 3) {
      if (registerValues[0] === BigInt(0)) return;
      initialIndex = Number(operand);
      flag = true;
    } else if (opcode === 4) {
      registerValues[1] = registerValues[1] ^ registerValues[2];
    } else if (opcode === 5) {
      result = [...result, getComboValue(operand) % BigInt(8)];
    } else if (opcode === 6) {
      registerValues[1] =
        registerValues[0] / BigInt(Math.pow(2, Number(getComboValue(operand))));
    } else if (opcode === 7) {
      registerValues[2] =
        registerValues[0] / BigInt(Math.pow(2, Number(getComboValue(operand))));
    }
    return null;
  };

  while (flag) {
    flag = false;
    for (let i = initialIndex * 2; i < instructions.length; i += 2) {
      handleOperation(instructions[i], instructions[i + 1]);
    }
  }

  return result.join(",");
};

const solve = (input: string) => {
  const [_, program] = input.split("\n\n");
  const instructions = program
    .match(/\d+/g)!
    .map((instruction) => Number(instruction));

  let i = BigInt(1);
  while (true) {
    const answer = getAnswer(input, i);
    if (answer === instructions.join(",")) return i;
    if (instructions.join(",").endsWith(answer)) {
      i *= BigInt(8);
    } else {
      i += BigInt(1);
    }
  }
};

const input = `51064159
0
0

2,4,1,5,7,5,1,6,0,3,4,6,5,5,3,0`;

const answer = solve(input);
console.log(input);
console.log(answer);
