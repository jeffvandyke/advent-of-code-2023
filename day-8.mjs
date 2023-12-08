import loadInput from "./load-input.mjs";
const input = await loadInput(8);

// const input = `\
// LLR\n
// AAA = (BBB, BBB)
// BBB = (AAA, ZZZ)
// ZZZ = (ZZZ, ZZZ)
// `;

// const input = `\
// LR\n
// 11A = (11B, XXX)
// 11B = (XXX, 11Z)
// 11Z = (11B, XXX)
// 22A = (22B, XXX)
// 22B = (22C, 22C)
// 22C = (22Z, 22Z)
// 22Z = (22B, 22B)
// XXX = (XXX, XXX)
// `;

const lines = input.split("\n").slice(0, -1);

const directions = lines[0].split("");
const parsed = lines.slice(2).map((l) => {
  const m = l.match(/(\w{3}) = \((\w{3}), (\w{3})\)/);
  return [m[1], { L: m[2], R: m[3] }];
});

const nodeMap = Object.fromEntries(parsed);

let directionIndex = 0;
const nextDir = () => directions[directionIndex++ % directions.length];

// Part 1
let thisNode = "AAA";

while (thisNode !== "ZZZ") {
  const direction = nextDir();
  thisNode = nodeMap[thisNode][direction];
}

console.log(directionIndex);

// Part 2
let currentNodes = parsed.filter((p) => p[0][2] === "A").map((p) => p[0]);
directionIndex = 0; // restart

// ---- try something else ----

let pathsInfo = currentNodes.map(() => ({
  endsHit: [],
  endsHitSteps: [],
  endValues: [],
}));

currentNodes.forEach((node, nodeIndex) => {
  const pathInfo = pathsInfo[nodeIndex];
  let currNode = node;
  directionIndex = 0;
  while (true) {
    const direction = nextDir();
    currNode = nodeMap[currNode][direction];
    if (currNode[2] === "Z") {
      const directionIndexEnded = directionIndex % directions.length;
      if (pathInfo.endsHit.some((e, i) => e === directionIndexEnded)) break;
      else {
        pathInfo.endsHit.push(directionIndexEnded);
        pathInfo.endsHitSteps.push(directionIndex);
      }
    }
  }
});
// console.log(pathsInfo);
// console.log("directions.length", directions.length);

// Stolen from online
function lcmTwoNumbers(x, y) {
  if (typeof x !== "number" || typeof y !== "number") return false;
  return !x || !y ? 0 : Math.abs((x * y) / gcdTwoNumbers(x, y));
}

function gcdTwoNumbers(x, y) {
  x = Math.abs(x);
  y = Math.abs(y);
  while (y) {
    var t = y;
    y = x % y;
    x = t;
  }
  return x;
}

console.log(
  pathsInfo.map((p) => p.endsHitSteps[0]).reduce((a, b) => lcmTwoNumbers(a, b)),
);
