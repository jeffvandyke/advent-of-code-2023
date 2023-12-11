import loadInput from "./load-input.mjs";
const input = await loadInput(7);

// const input = `\
// 32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483
// `;

const hands = input
  .split("\n")
  .slice(0, -1)
  .map((line) => {
    const m = line.match(/^(.)(.)(.)(.)(.) (\d+)$/);
    return {
      bid: m[6],
      cards: m.slice(1, 6),
    };
  });

// NOTE: Overwritten for part 2
let cards = ["A", "K", "Q", "J", "T", "9", "8", "7", "6", "5", "4", "3", "2"];
const computeCardValuesMap = () =>
  Object.fromEntries(cards.map((c, i) => [c, cards.length - i]));
let cardValuesMap = computeCardValuesMap();
let usingJokers = false;

const maxIdentical = (cards) =>
  Math.max(
    0,
    ...[...new Set(cards)].map((key) => cards.filter((c) => c === key).length),
  );

const is5Kind = (cards, jokers) => jokers + maxIdentical(cards) === 5;
const is4Kind = (cards, jokers) => jokers + maxIdentical(cards) === 4;
const is3Kind = (cards, jokers) => jokers + maxIdentical(cards) === 3;
const is2Kind = (cards, jokers) => jokers + maxIdentical(cards) === 2;

const isFullHouse = (cards, jokers) => {
  // By rank, this cannot be 5 or 4 of a kind
  if (!is3Kind(cards, jokers)) return false;
  const keys = [...new Set(cards)];
  return keys.length === 2;
};

const isTwoPair = (cards, jokers) => {
  if (jokers > 0) {
    return false; // no pairs in existing cards - it would have been 3 of kind
  }
  const keys = [...new Set(cards)];
  if (keys.length !== 3) return false;
  const keyCounts = keys.map((k) => cards.filter((c) => c === k).length).sort();
  return keyCounts[0] === 1 && keyCounts[1] === 2;
};

const calcHandScore = (cards) => {
  const cardValues = cards.map((c) => cardValuesMap[c]);
  const cardHandOrdering = cardValues.reduce((a, b) => a * 100 + b);

  const nonJokerCards = usingJokers ? cards.filter((c) => c !== "J") : cards;
  const jokers = 5 - nonJokerCards.length;

  let rank;
  if (is5Kind(nonJokerCards, jokers)) rank = 9;
  else if (is4Kind(nonJokerCards, jokers)) rank = 8;
  else if (isFullHouse(nonJokerCards, jokers)) rank = 7;
  else if (is3Kind(nonJokerCards, jokers)) rank = 6;
  else if (isTwoPair(nonJokerCards, jokers)) rank = 5;
  else if (is2Kind(nonJokerCards, jokers)) rank = 4;
  else rank = 2;

  const highCardRank = 0; // Math.max(...cardValues);

  return rank * 10 ** 12 + highCardRank * 10 ** 10 + cardHandOrdering;
};

const calcTotalWinnings = () => {
  const handValues = hands.map((c) => ({
    ...c,
    value: calcHandScore(c.cards),
  }));
  handValues.sort((a, b) => a.value - b.value);
  handValues.forEach((v, i) => (v.rank = i + 1));

  return handValues.reduce((acc, hand) => acc + hand.bid * hand.rank, 0);
};

console.log(calcTotalWinnings());

// Set new value ordering
cards = ["A", "K", "Q", "T", "9", "8", "7", "6", "5", "4", "3", "2", "J"];
cardValuesMap = computeCardValuesMap();
usingJokers = true;

console.log(calcTotalWinnings());
