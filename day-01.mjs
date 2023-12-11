import loadInput from "./load-input.mjs";
const input = await loadInput(1);

const lines = input.split("\n").slice(0, -1);

console.log(
  lines.reduce((acc, line) => {
    const digits = line.match(/\d/g);
    return acc + Number(digits.at(0) + digits.at(-1));
  }, 0),
);

// prettier-ignore
const wordDigits = [ "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
const wordDigitMap = Object.fromEntries(
  wordDigits.map((word, i) => [word, String(i + 1)]),
);

console.log(
  lines.reduce((acc, line) => {
    const regex = new RegExp(`\\d|${wordDigits.join("|")}`, "g");
    const transform = (digit) => wordDigitMap[digit] ?? digit;

    // Devilish trick to match overlapping regexes
    let first;
    let last;
    let match;
    while ((match = regex.exec(line))) {
      first ||= transform(match[0]);
      last = match[0];
      regex.lastIndex -= match[0].length - 1;
    }
    last = transform(last);

    const number = Number(first + last);
    return acc + number;
  }, 0),
);
