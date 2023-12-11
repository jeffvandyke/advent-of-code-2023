import loadInput from "./load-input.mjs";
const input = await loadInput(11);

// const input = `\
// ...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....
// `;

const grid = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((v) => v === "#"));

// console.log(grid)

const findIndicesWhere = (arr, cond) =>
  arr
    .map((e, i) => ({ e, i }))
    .filter(({ e, i }) => cond(e, i))
    .map(({ i }) => i);

const expandedGrid = grid.map((r) => r.slice());

const emptyRows = findIndicesWhere(grid, (row) => row.every((c) => !c));
const emptyColumns = findIndicesWhere(grid[0], (_c, colIndex) =>
  grid.every((row) => row[colIndex] === false),
);

// expand columns
emptyColumns
  .reverse()
  .forEach((colIndex) =>
    expandedGrid.forEach((row) => row.splice(colIndex, 0, false)),
  );
emptyRows
  .reverse()
  .forEach((rowIndex) =>
    expandedGrid.splice(rowIndex, 0, expandedGrid[rowIndex]),
  );

// expandedGrid.forEach(row => console.log(row.map(c => c ? '#' : '.').join('')))

const galaxies = [];
expandedGrid.forEach((row, y) =>
  row.forEach((value, x) => {
    if (value) galaxies.push({ x, y });
  }),
);

const allPairs = galaxies.flatMap((g, i) =>
  galaxies.slice(i + 1).map((subG) => [g, subG]),
);
const pairDistances = allPairs.map(
  ([a, b]) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
);

console.log(pairDistances.reduce((a, b) => a + b));

const newGalaxies = [];
grid.forEach((row, y) =>
  row.forEach((value, x) => {
    if (value) newGalaxies.push({ x, y });
  }),
);
const newPairs = newGalaxies.flatMap((g, i) =>
  newGalaxies.slice(i + 1).map((subG) => [g, subG]),
);

const expansion = (expInxs, begin, end) =>
  expInxs.filter((x) => begin < x && x < end).length;

const newPairDistances = newPairs.map(([a, b]) => {
  const [x0, x1] = [a.x, b.x].sort((a, b) => a - b);
  const [y0, y1] = [a.y, b.y].sort((a, b) => a - b);

  const expanded =
    expansion(emptyColumns, x0, x1) + expansion(emptyRows, y0, y1);
  return x1 - x0 + (y1 - y0) + expanded * 999999;
});

console.log(newPairDistances.reduce((a, b) => a + b));
