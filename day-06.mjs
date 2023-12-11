import loadInput from "./load-input.mjs";
const input = await loadInput(6);

// const input = `\
// Time:      7  15   30
// Distance:  9  40  200
// `;

const [times, distances] = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.replace(/^\w*:\s*/, "").split(/\s+/));

const races = times.map((t, i) => ({ time: t, recordDistance: distances[i] }));

const raceTimes = races.map((race) => {
  const options = Array.from(Array(race.time - 1)).map((_e, i) => i + 1);
  return options.filter(
    (btnTime) => btnTime * (race.time - btnTime) > race.recordDistance,
  ).length;
});

console.log(raceTimes.reduce((a, b) => a * b));

const [raceTime, distance] = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.replace(/\s+/g, "").match(/\d+/)[0]);

const findWonChangeIndex = (start, end) => {
  const step = Math.ceil((end - start) / 10);
  const calcWon = (testTime) => testTime * (raceTime - testTime) > distance;

  let prevWon = calcWon(start);

  // DEBUG console.log({ start, end, step, prevWon })

  for (let i = start + step; i <= raceTime; i += step) {
    const won = calcWon(i);

    if (won !== prevWon) {
      if (step === 1) return i;
      else return findWonChangeIndex(i - step, i);
    }
    prevWon = won;
  }
};

const beginWon = findWonChangeIndex(0, raceTime / 2);
const endWon = findWonChangeIndex(raceTime / 2, raceTime);

console.log(endWon - beginWon);
