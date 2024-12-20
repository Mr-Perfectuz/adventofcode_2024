import fs from "fs";

async function readInputFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, "utf8", (err, data) => {
      if (err) {
        reject("Failed to read input file");
      } else {
        resolve(data);
      }
    });
  });
}

async function processInput() {
  const input = await readInputFile("input.txt");

  let decompressed = [];
  let filesReversed = [];
  let freeBlocks = [];

  for (let i = 1; i <= input.length; i += 2) {
    const fileLength = parseInt(input[i - 1], 10);
    const freeSpace = i === input.length ? 0 : parseInt(input[i], 10);

    filesReversed.unshift([Math.floor(i / 2), decompressed.length, fileLength]);
    freeBlocks.push([decompressed.length + fileLength, freeSpace]);

    decompressed = decompressed.concat(
      Array(fileLength).fill(Math.floor(i / 2))
    );
    decompressed = decompressed.concat(Array(freeSpace).fill(-1));
  }

  let compressed = [...decompressed];

  for (let i = compressed.length - 1; i > 0; i--) {
    const block = compressed[i];

    if (block === -1) {
      continue;
    }

    const freeBlock = compressed.indexOf(-1);

    if (freeBlock >= i) {
      break;
    }

    compressed[freeBlock] = block;
    compressed[i] = -1;
  }

  compressed = compressed.filter((b) => b !== -1);

  let part1 = 0;
  for (let i = 0; i < compressed.length; i++) {
    part1 += i * compressed[i];
  }

  console.log(`Part 1: ${part1}`);

  let part2 = 0;
  compressed = [...decompressed];

  filesReversed.forEach((file) => {
    const freeSpace = freeBlocks.find((f) => f[0] < file[1] && f[1] >= file[2]);

    if (!freeSpace) {
      return;
    }

    for (let j = 0; j < file[2]; j++) {
      compressed[freeSpace[0] + j] = file[0];
      compressed[file[1] + j] = -1;
    }

    if (freeSpace[1] === file[2]) {
      freeBlocks = freeBlocks.filter((f) => f !== freeSpace);
    } else {
      freeBlocks[freeBlocks.indexOf(freeSpace)] = [
        freeSpace[0] + file[2],
        freeSpace[1] - file[2],
      ]; // Update free space
    }
  });

  for (let i = 0; i < compressed.length; i++) {
    if (compressed[i] === -1) {
      continue;
    }
    part2 += i * compressed[i];
  }

  console.log(`Part 2: ${part2}`);
}

processInput().catch((err) => console.error("Error:", err));
