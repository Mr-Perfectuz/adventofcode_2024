import fs from 'fs';
const [wiresRaw, gatesRaw] = fs
  .readFileSync('input.txt', 'utf8')
  .trim()
  .split('\n\n')
  .map((n) => n.split('\n'));

const wires = {};
for (const line of wiresRaw) {
  const [name, value] = line.split(': ');
  wires[name] = parseInt(value);
}

const inputBitCount = wiresRaw.length / 2;

const gates = [];
for (const line of gatesRaw) {
  let [inputs, output] = line.split(' -> ');

  const [a, op, b] = inputs.split(' ');
  gates.push({ a, op, b, output });

  if (wires[a] == undefined) wires[a] = null;
  if (wires[b] == undefined) wires[b] = null;
  if (wires[output] == undefined) wires[output] = null;
}

function isDirect(gate) {
  return gate.a.indexOf('x') == 0 || gate.b.indexOf('x') == 0;
}

function isOutput(gate) {
  return gate.output.indexOf('z') == 0;
}

function isGate(type) {
  return function (gate) {
    return gate.op == type;
  };
}

function hasOutput(output) {
  return function (gate) {
    return gate.output === output;
  };
}

function hasInput(input) {
  return function (gate) {
    return gate.a === input || gate.b === input;
  };
}

//outputs that are flagged as bad or suspicious
const flags = new Set();

/**
 * FULL ADDER
 * (first bits aren't a full adder)
 * (for last FA, COUT is the extra output)
 *
 * A    XOR B    -> VAL0     <= FAGate0
 * A    AND B    -> VAL1     <= FAGate1
 * VAL0 AND CIN  -> VAL2     <= FAGate2
 * VAL0 XOR CIN  -> SUM      <= FAGate3
 * VAL1 OR  VAL2 -> COUT     <= FAGate4
 */

//check FAGate0 gates for zXXs
//each of these should be a An XOR Bn -> VAL0n
//except for the first one, which should be x00 XOR y00 -> z00
const FAGate0s = gates.filter(isDirect).filter(isGate('XOR'));
for (const gate of FAGate0s) {
  const { a, b, output } = gate;

  const isFirst = a === 'x00' || b === 'x00';
  if (isFirst) {
    if (output !== 'z00') {
      flags.add(output);
    }
    continue;
  } else if (output == 'z00') {
    flags.add(output);
  }

  //none of these should be a output
  if (isOutput(gate)) {
    flags.add(output);
  }
}

//check all XOR gates that are indirect (FAGate3)
//each of these should be outputting to a zXX
const FAGate3s = gates.filter(isGate('XOR')).filter((gate) => !isDirect(gate));
for (const gate of FAGate3s) {
  if (!isOutput(gate)) {
    flags.add(gate.output);
  }
}

//check all output gates
//each of these should be VAL0 XOR CIN -> SUM
//except for the last one, which should be VAL1 OR VAL2 -> COUT
const outputGates = gates.filter(isOutput);
for (const gate of outputGates) {
  const isLast = gate.output === `z${inputBitCount}`.padStart(3, '0');
  if (isLast) {
    if (gate.op !== 'OR') {
      flags.add(gate.output);
    }
    continue;
  } else if (gate.op !== 'XOR') {
    flags.add(gate.output);
  }
}

//more complex checks

//all FAGate0 gates MUST output to a FAGate3 gate
let checkNext = [];
for (const gate of FAGate0s) {
  const { output } = gate;

  //if we've already flagged this, skip
  if (flags.has(output)) continue;

  //if the output is z00, skip
  if (output === 'z00') continue;

  const matches = FAGate3s.filter(hasInput(output));
  if (matches.length === 0) {
    checkNext.push(gate);
    flags.add(output);
  }
}

//check what the flagged gates should be
for (const gate of checkNext) {
  const { a, output } = gate;

  //the inputs should be An and Bn, so the output of this gate *should* go to an FaGate3 that outputs Zn
  const intendedResult = `z${a.slice(1)}`;
  const matches = FAGate3s.filter(hasOutput(intendedResult));

  //if there's not exactly one match, something has gone very wrong
  if (matches.length != 1) {
    throw new Error('Critical Error! Is your input correct?');
  }

  const match = matches[0];

  const toCheck = [match.a, match.b];

  //one of these should come from an OR gate
  const orMatches = gates
    .filter(isGate('OR'))
    .filter((gate) => toCheck.includes(gate.output));

  //if theres not exactly one match, this solver isn't complex enough to solve this
  if (orMatches.length != 1) {
    throw new Error(
      "Critical Error! This solver isn't complex enough to solve this"
    );
  }

  const orMatchOutput = orMatches[0].output;

  //the correct output is the one that isn't OrMatchOutput
  const correctOutput = toCheck.find((output) => output !== orMatchOutput);
  flags.add(correctOutput);
}

//if there isn't exactly 8 flags, this solver isn't complex enough to solve this
if (flags.size != 8) {
  throw new Error(
    "Critical Error! This solver isn't complex enough to solve this"
  );
}

const flagsArr = [...flags];
flagsArr.sort((a, b) => a.localeCompare(b));
console.log(flagsArr.join(','));
