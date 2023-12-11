import loadInput from "./load-input.mjs";
const input = await loadInput(3);

// const input = `\
// 467..114..
// ...*......
// ..35..633.
// ......#...
// 617*......
// .....+.58.
// ..592.....
// ......755.
// ...$.*....
// .664.598..
// `;

const lines = input.split("\n").slice(0, -1);

const symbolRegex = /[!@#$%^&*()\-_=+[\]{}\\|;:'",<>/?]/;
const numberRegex = /\d+/gi;
const numberLocations = lines.flatMap((line, lineIndex) =>
  Array.from(line.matchAll(numberRegex)).map((value) => ({
    value: +value[0],
    line: lineIndex,
    start: value.index + 0, // Types - value.index should always be defined
    end: value.index + value[0].length,
  })),
);

// Filter for only number locations that include digits
const foundPartNumbers = numberLocations.filter(({ line, start, end }) => {
  const searchBox = lines
    .slice(Math.max(0, line - 1), Math.min(line + 2, lines.length))
    .map((l) => l.slice(Math.max(0, start - 1), Math.min(end + 1, l.length)));
  return symbolRegex.test(searchBox.join(""));
});

console.log(foundPartNumbers.reduce((a, c) => a + c.value, 0));

// Polyfill this utility function
const groupBy = (items, callback) => {
  return items.reduce((acc, item) => {
    const key = callback(item);
    acc[key] ||= [];
    acc[key].push(item);
    return acc;
  }, {});
};

/** @type {{ [index: number]: Array<typeof numberLocations[number]> }} */
const numbersByLine = groupBy(numberLocations, (nl) => nl.line);

// Get search boxes precomputed for efficiency.
// Type is: [line] -> [a-1, a, a+1] -> numberLocations
const numberBoxByLine = lines.map((_l, index) => {
  const nbl = numbersByLine;
  // Some numbersByLine may be empty
  let boxSlot;
  if (index === 0) {
    boxSlot = [nbl[0], nbl[1]];
  } else if (index === lines.length - 1) {
    boxSlot = [nbl[lines.length - 2], nbl[lines.length - 1]];
  } else {
    boxSlot = [nbl[index - 1], nbl[index], nbl[index + 1]];
  }
  return boxSlot.map((i) => i ?? []);
});

const foundGears = lines.flatMap((line, lineIndex) => {
  const numberBoxVerticalBoundary = numberBoxByLine[lineIndex];

  const starIndices = Array.from(line.matchAll(/\*/g)).map(
    ({ index }) => index + 0, // Again, "type" to assert non-undefined,
  );

  const lineGears = starIndices
    .map((index) => {
      const adjacentNumbers = numberBoxVerticalBoundary.flatMap((boxLine) =>
        boxLine.filter(
          ({ start, end }) => index - 1 <= end - 1 && start <= index + 1,
        ),
      );
      // Handy DEBUG
      // console.log({ line, index, vert: JSON.stringify(numberBoxVerticalBoundary), adj: adjacentNumbers.map(n => n.value)})
      return { index, adjacentNumbers };
    })
    .filter(({ adjacentNumbers }) => adjacentNumbers.length === 2);
  return lineGears;
});

console.log(
  foundGears
    .map(({ adjacentNumbers: [{ value: one }, { value: two }] }) => one * two)
    .reduce((a, b) => a + b),
);
