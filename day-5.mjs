import loadInput from "./load-input.mjs";
const input = await loadInput(5);

// const input = `\
// seeds: 79 14 55 13\n
// seed-to-soil map:\n50 98 2\n52 50 48\n
// soil-to-fertilizer map:\n0 15 37\n37 52 2\n39 0 15\n
// fertilizer-to-water map:\n49 53 8\n0 11 42\n42 0 7\n57 7 4\n
// water-to-light map:\n88 18 7\n18 25 70\n
// light-to-temperature map:\n45 77 23\n81 45 19\n68 64 13\n
// temperature-to-humidity map:\n0 69 1\n1 0 69\n
// humidity-to-location map:\n60 56 37\n56 93 4\n
// `;

const [seedsStr, ...mapStrs] = input.trim().split("\n\n");

const seeds = seedsStr
  .slice("seeds: ".length)
  .split(" ")
  .map((v) => Number(v));

// Note - maps are in processing order
const maps = mapStrs.map((mapStr) => {
  const [headerStr, ...lines] = mapStr.split("\n");
  const [_match, src, dest] = headerStr.match(/^(\w+)-to-(\w+) map:$/);
  const rangeMaps = lines.map((s) => {
    const p = s.split(" ");
    return { srcStart: +p[1], len: +p[2], destStart: +p[0] };
  });
  return { src, dest, rangeMaps };
});

/**
 * @param {typeof maps[number]} map
 */
function mapValue(map, input) {
  // DEBUG console.log("mapping ", input, " through ", map.rangeMaps);
  const foundEntry = map.rangeMaps.filter(
    (m) => m.srcStart <= input && input < m.srcStart + m.len,
  )[0];
  return foundEntry
    ? input - foundEntry.srcStart + foundEntry.destStart
    : input;
}

const mappedSeeds = seeds.map((seed) =>
  maps.reduce((value, map) => mapValue(map, value), seed),
);

console.log(Math.min(...mappedSeeds));

const seedRanges = seeds
  .filter((_e, i) => i % 2 === 0)
  .map((seedStart, index) => {
    const len = seeds[index * 2 + 1];
    return { begin: seedStart, end: seedStart + len };
  });

// Pass all ranges through maps, one by one.

const finalRanges = maps.reduce((currRanges, map) => {
  // DEBUG
  // console.log("mapping", currRanges, " through ", map);
  const mapSrcRanges = map.rangeMaps.map((r) => ({
    begin: r.srcStart,
    end: r.srcStart + r.len,
  }));
  const mapSrcPoints = mapSrcRanges.flatMap((r) => [r.begin, r.end]);

  const brokenRanges = currRanges.flatMap((range) => {
    const points = [
      range.begin,
      // Final mistake here - sorting is essential here to create ranges correctly
      ...mapSrcPoints.filter((p) => range.begin < p && p < range.end).sort(),
      range.end,
    ];
    return points
      .slice(0, -1)
      .map((p, i) => ({ begin: p, end: points[i + 1] }));
  });

  return brokenRanges
    .map(({ begin, end }) => {
      const mappedBegin = mapValue(map, begin);
      return { begin: mappedBegin, end: end - begin + mappedBegin };
    })
    .filter((r) => r.begin !== r.end)
    .toSorted((a, b) => a.begin - b.begin);
}, seedRanges);

console.log(Math.min(...finalRanges.map((r) => r.begin)));
