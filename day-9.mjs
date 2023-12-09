import loadInput from "./load-input.mjs";
const input = await loadInput(9);

// const input = `\
// 0 3 6 9 12 15
// 1 3 6 10 15 21
// 10 13 16 21 30 45
// `;

const lines = input.split("\n").slice(0, -1);
const sequences = lines.map((l) => l.split(" ").map((s) => +s));

const derivitiveSequence = (input) =>
  input.map((a, i, arr) => arr[i + 1] - a).slice(0, -1);
const allZero = (seq) => seq.every((n) => n === 0);

const generateDiffs = (sequence) => {
  let currSeq = sequence;
  const seq = [currSeq];
  while (!allZero(currSeq)) {
    currSeq = derivitiveSequence(currSeq);
    seq.push(currSeq);
  }
  return seq;
};

const sequencesWithDelta = sequences.map((s) => generateDiffs(s));

const extrapolateSequenceDeltas = (seqDiffs, backwards = false) => {
  seqDiffs.at(-1).push(0);
  for (var i = seqDiffs.length - 2; i >= 0; i--) {
    if (backwards) {
      seqDiffs[i].unshift(seqDiffs[i][0] - seqDiffs[i + 1][0]);
    } else {
      seqDiffs[i].push(seqDiffs[i].at(-1) + seqDiffs[i + 1].at(-1));
    }
  }
  return seqDiffs;
};

console.log(
  sequencesWithDelta
    .map((seqDeltas) => extrapolateSequenceDeltas(seqDeltas))
    .map((swd) => swd[0].at(-1))
    .reduce((a, b) => a + b),
);

console.log(
  sequencesWithDelta
    .map((seqDeltas) => extrapolateSequenceDeltas(seqDeltas, true))
    .map((swd) => swd[0][0])
    .reduce((a, b) => a + b),
);
