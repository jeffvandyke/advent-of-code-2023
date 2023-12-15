import loadInput from "./load-input.mjs";
const input = await loadInput(12);

// const input = `\
// ???.### 1,1,3
// .??..??...?##. 1,1,3
// ?#?#?#?#?#?#?#? 1,3,1,6
// ????.#...#... 4,1,1
// ????.######..#####. 1,6,5
// ?###???????? 3,2,1
// `;

// const input = `\
// _?#?.#??###..#####. 1,6,5
// `;

const lines = input.replace(/\./g, '_').replace(/\?/g, 'u')
  .split("\n")
  .slice(0, -1)
  .map((line) => {
    const [springs, brokenStr] = line.split(" ");
    return { springs: `_${springs}_`, sets: brokenStr.split(",").map((x) => +x) };
  });

const testSegments = (segments, sets) => {
    
}

// Assuming str will always start or end with '_' (.)
// Returns remaining bits bound with '_' (.) as well
const expandMatches = (str, sets) => {
    console.log('EXPANDING', str, 'for', sets)
    const results = []
    const regex = `^([_u]+?)(${sets.map(s => `[#u]{${s}}`).join('[_u]+?')})[_u]+$`
    // console.log(regex)
    let indexOffset = 0;
    let testStr = str
    let match;
    while (match = testStr.match(regex)) {
        testStr = testStr.slice(match[1].length + 1) // Omit first matched char
        console.log('testStr after first matched', testStr)
        let rem = '_' + testStr.slice(sets[0] - 1 + 1) // include next as '_'
        results.push({ /* index: match.index + indexOffset, */ rem })
        // indexOffset = indexOffset + match.index + 1

        testStr = '_' + testStr.slice(testStr.match(/[u_]/)?.index ?? -1)
        console.log('next testStr to match', testStr)
    }
    if (results.length === 0) throw new Error('hmmmmm')
    console.log('results', results)
    return results
}

const testSets = (springs, sets) => {
    // const splitSegments = springs.split(/_+/).filter(v => v.length > 0)
    // console.log(springs, sets)
    const works = expandMatches(springs, sets)
    return works.map(({ index, rem }) => {
        if (sets.length === 1) return 1
        return testSets(rem, sets.slice(1))
    }).reduce((a, b) => a + b)
}

const combinations = lines.map(l => testSets(l.springs, l.sets))
console.log(combinations.reduce((a, b) => a + b))
// 21 from input

// 8804 is too high
// 8000 is too high
// 8889... also too high...
