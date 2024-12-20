function blinkStones(stoneCounts) {
  const newStoneCounts = new Map();

  for (const [stone, count] of stoneCounts.entries()) {
    const strStone = stone.toString();

    if (stone === 0) {
      newStoneCounts.set(1, (newStoneCounts.get(1) || 0) + count);
    } else if (strStone.length % 2 === 0) {
      const mid = strStone.length / 2;
      const left = parseInt(strStone.slice(0, mid));
      const right = parseInt(strStone.slice(mid));

      newStoneCounts.set(left, (newStoneCounts.get(left) || 0) + count);
      newStoneCounts.set(right, (newStoneCounts.get(right) || 0) + count);
    } else {
      const newStone = stone * 2024;
      newStoneCounts.set(newStone, (newStoneCounts.get(newStone) || 0) + count);
    }
  }

  return newStoneCounts;
}

function countStonesAfterBlinks(initialStones, blinks) {
  let stoneCounts = new Map();

  for (const stone of initialStones) {
    stoneCounts.set(stone, (stoneCounts.get(stone) || 0) + 1);
  }

  for (let i = 0; i < blinks; i++) {
    stoneCounts = blinkStones(stoneCounts);
  }

  let totalStones = 0;
  for (const count of stoneCounts.values()) {
    totalStones += count;
  }

  return totalStones;
}

const initialStones = [4189, 413, 82070, 61, 655813, 7478611, 0, 8];

const blinks = 75;

const result = countStonesAfterBlinks(initialStones, blinks);

console.log(`Number of stones after ${blinks} blinks: ${result}`);
