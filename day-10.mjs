import loadInput from "./load-input.mjs";
const input = await loadInput(10);

// const input = `\
// ..F7.
// .FJ|.
// SJ.L7
// |F--J
// LJ...
// `;

// const input = `\
// FF7FSF7F7F7F7F7F---7
// L|LJ||||||||||||F--J
// FL-7LJLJ||||||LJL-77
// F--JF--7||LJLJ7F7FJ-
// L---JF-JLJ.||-FJLJJ7
// |F|F-JF---7F7-L7L|7|
// |FFJF7L7F-JF7|JL---7
// 7-L-JL7||F7|L7F-7F7|
// L.L7LFJ|||||FJL7||LJ
// L7JLJL-JLJLJL--JLJ.L
// `;

const P_V = "|"; // is a vertical pipe connecting north and south.
const P_H = "-"; // is a horizontal pipe connecting east and west.
const P_NE = "L"; // is a 90-degree bend connecting north and east.
const P_NW = "J"; // is a 90-degree bend connecting north and west.
const P_SW = "7"; // is a 90-degree bend connecting south and west.
const P_SE = "F"; // is a 90-degree bend connecting south and east.
const P_G = "."; // is ground; there is no pipe in this tile.
const P_S = "S"; // is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.

const dirCharMap = {
  [P_V]: ["N", "S"],
  [P_H]: ["W", "E"],
  [P_NE]: ["N", "E"],
  [P_NW]: ["N", "W"],
  [P_SE]: ["S", "E"],
  [P_SW]: ["S", "W"],
  [P_G]: [],
};

const grid = input
  .split("\n")
  .slice(0, -1)
  .map((line) => line.split("").map((char) => ({ char, dist: null })));

let startX = -1;
const startY = grid.findIndex(
  (r) => (startX = r.findIndex((c) => c.char === P_S)) !== -1,
);

/** North, East, South, West */
const iterDirPoints = ({ x, y }) => [
  { dir: "N", x, y: y - 1 },
  { dir: "E", x: x + 1, y },
  { dir: "S", x, y: y + 1 },
  { dir: "W", x: x - 1, y },
];
const dirs = ["N", "E", "S", "W"];
const revDir = { N: "S", E: "W", S: "N", W: "E" };
const isOnGrid = ({ x, y }) =>
  0 <= x && x < grid[0].length && 0 <= y && y < grid.length;

const gridAt = ({ x, y }) => grid[y][x];
const setGridAt = ({ x, y }, props) => {
  grid[y][x] = { ...grid[y][x], ...props };
};

// grid[startY][startX].dist = 0;
setGridAt({ x: startX, y: startY }, { dist: 0 });

const ends = [];
const branches = iterDirPoints({ x: startX, y: startY }).filter((pt, i) => {
  return isOnGrid(pt) && dirCharMap[gridAt(pt).char].includes(revDir[dirs[i]]);
});

let currDist = 1;
branches.forEach((b) => setGridAt(b, { dist: currDist, isPath: true }));

while (branches.length) {
  currDist += 1;
  const rmBranch = [];
  branches.forEach((b, i) => {
    const gridPt = gridAt(b);
    const nextPts = iterDirPoints(b).filter(
      (dp) =>
        dirCharMap[gridPt.char].includes(dp.dir) && gridAt(dp).dist == null,
    );
    if (nextPts.length >= 2) throw new Error("Unexpected");
    if (nextPts.length === 0) {
      rmBranch.push(b);
      ends.push({ ...b, distReached: currDist - 1 });
    } else {
      branches[i] = nextPts[0];
      setGridAt(nextPts[0], { dist: currDist, isPath: true });
    }
  });
  rmBranch.forEach((rm) => branches.splice(branches.indexOf(rm), 1));
}

// // Show grid and distances
// console.log(
//   grid
//     .map((r) => r.map(({ dist, char }) => String(dist ?? char).slice(0, 1)).join(""))
//     .join("\n"),
// );

console.log(Math.max(...ends.map((e) => e.distReached)));

// ignore dist from here on out

// MUTATE grid to make loop even
const startDirs = iterDirPoints({ x: startX, y: startY })
  .filter((pt, i) => {
    return (
      isOnGrid(pt) && dirCharMap[gridAt(pt).char].includes(revDir[dirs[i]])
    );
  })
  .map((p) => p.dir);
const startChar = Object.entries(dirCharMap).filter(([k, v]) =>
  startDirs.every((d) => v.includes(d)),
)[0][0];
// console.log(startChar);
setGridAt({ x: startX, y: startY }, { char: startChar, isPath: true });

// const iterGrid = (fn) => grid.forEach((row, y) => row.forEach((pt, x) => fn({ x, y, ...pt })))

const countInside = (row, y) => {
  let insides = [];
  let prevVerts = [];
  let amIn = false;
  let prevVertEntry = null;
  let insideCount = 0;
  row.forEach(({ char, isPath }, x) => {
    if (!isPath) {
      insideCount += amIn ? 1 : 0;
      // DEBUG
      setGridAt({ x, y }, { inside: amIn });
    } else {
      // on path, do something special
      const dirs = dirCharMap[char];
      if (dirs.length !== 2) throw new Error("Unexpected");
      if (char === P_V) amIn = !amIn;
      else if (char === P_H) {
        void 0; // noop
      } else if (dirs.includes("E")) {
        prevVertEntry = dirs.filter((d) => d !== "E")[0];
      } else if (dirs.includes("W")) {
        // Changing dirs
        if (!prevVertEntry) throw new Error("Got null prevVertEntry");
        const vertDir = dirs.filter((d) => d !== "W")[0];
        if (vertDir !== prevVertEntry) amIn = !amIn;
      }
    }
    insides.push(amIn ? "I" : "O");
    prevVerts.push(prevVertEntry === null ? "o" : prevVertEntry);
  });

  // console.log(
  //   row
  //     .map(({ char, inside, isPath }) => (inside ? "█" : isPath ? char : " "))
  //     .join(""),
  // );
  // console.log(prevVerts.join(""));
  // console.log(insides.join(""));

  return insideCount;
};

// 1829 is too high

console.log(grid.reduce((sum, row, y) => sum + countInside(row, y), 0));

// // Show Path presence
// console.log(
//   grid
//     .map((r) =>
//       r.map(({ char, inside, isPath }) => (isPath ? char : " ")).join(""),
//     )
//     .join("\n"),
// );
