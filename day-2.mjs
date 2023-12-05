import loadInput from "./load-input.mjs";
const input = await loadInput(2);

// const input = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
// Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
// Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
// Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
// Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
// `;

const lines = input.split("\n").slice(0, -1);

const parsedGames = lines.map((line) => {
  const [_, gameIndexStr, gameDataStr] = line.match(/^Game (\d+): (\d.*)$/);
  const gameRunStrs = gameDataStr.split("; ");

  /** @type {Array<{ green: number; blue: number; red: number }>} */
  const gameRuns = gameRunStrs.map((runString) => ({
    // Defaults, then fill with data
    red: 0,
    green: 0,
    blue: 0,
    ...Object.fromEntries(
      runString.split(", ").map((colorStr) => {
        const [__, count, color] = colorStr.match(/^(\d+) (green|blue|red)$/);
        return [color, +count];
      }),
    ),
  }));

  // DEBUG code
  // console.log(line, "|", +gameIndexStr, "|", gameRuns);

  return {
    index: +gameIndexStr,
    runs: gameRuns,
  };
});

// only 12 red cubes, 13 green cubes, and 14 blue cubes
console.log(
  parsedGames
    .filter((game) =>
      game.runs.every(
        (run) => run.red <= 12 && run.green <= 13 && run.blue <= 14,
      ),
    )
    .map((game) => game.index)
    .reduce((a, b) => a + b),
);

console.log(
  parsedGames
    .map((game) =>
      game.runs.reduce((a, b) => ({
        red: Math.max(a.red, b.red),
        green: Math.max(a.green, b.green),
        blue: Math.max(a.blue, b.blue),
      })),
    )
    .map(({ red, green, blue }) => red * green * blue)
    .reduce((a, b) => a + b),
);
