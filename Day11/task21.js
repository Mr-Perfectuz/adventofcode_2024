function blinkStones(stones) {
  const newStones = [];

  stones.forEach((stone) => {
    const strStone = stone.toString();

    if (stone === 0) {
      newStones.push(1);
    } else if (strStone.length % 2 === 0) {
      const mid = strStone.length / 2;
      const left = parseInt(strStone.slice(0, mid));
      const right = parseInt(strStone.slice(mid));
      newStones.push(left, right);
    } else {
      newStones.push(stone * 2024);
    }
  });

  return newStones;
}

function countStonesAfterBlinks(initialStones, blinks) {
  let stones = initialStones;

  for (let i = 0; i < blinks; i++) {
    stones = blinkStones(stones);
  }

  return stones.length;
}

const initialStones = [4189, 413, 82070, 61, 655813, 7478611, 0, 8];

const blinks = 25;

const result = countStonesAfterBlinks(initialStones, blinks);

console.log(`Number of stones after ${blinks} blinks: ${result}`);
