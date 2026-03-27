/**
 * Phase 2 Verification Tests
 * Ref: docs/03_Iterative_Development_Plan.md (Phase 2 Verification)
 *
 * Run: node --experimental-vm-modules src/utils/testAlgorithms.mjs
 * (or via: node test_brain.mjs from project root)
 */

import { CLASSIC_ITEMS, CLASSIC_CAPACITY } from './classicItems.js';
import { dpSolver } from './dpSolver.js';
import { hintEngine } from './hintEngine.js';

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ ${testName}`);
    passed++;
  } else {
    console.log(`  ❌ ${testName}`);
    failed++;
  }
}

// ════════════════════════════════════════
// TEST GROUP 1: dpSolver
// ════════════════════════════════════════
console.log('\n══ dpSolver Tests ══');

const { optimalValue, optimalSet } = dpSolver(CLASSIC_ITEMS, CLASSIC_CAPACITY);

assert(optimalValue === 1166, `Classic optimal value is $1,166 (got $${optimalValue})`);
assert(optimalSet.length === 7, `Classic optimal set has 7 items (got ${optimalSet.length})`);

const expectedIds = ['camera', 'painting', 'tablet', 'wine', 'projector', 'playstation', 'keurig'];
const setMatches = expectedIds.every(id => optimalSet.includes(id));
assert(setMatches, `Classic optimal set contains correct items: ${optimalSet.sort().join(', ')}`);

const optimalWeight = CLASSIC_ITEMS
  .filter(i => optimalSet.includes(i.id))
  .reduce((sum, i) => sum + i.weight, 0);
assert(optimalWeight === 26, `Classic optimal weight is exactly 26 lbs (got ${optimalWeight})`);

// Edge case: empty items
const emptyResult = dpSolver([], 10);
assert(emptyResult.optimalValue === 0, 'Empty items → optimal value is $0');
assert(emptyResult.optimalSet.length === 0, 'Empty items → optimal set is empty');

// Edge case: single item fits
const singleFit = dpSolver([{ id: 'a', weight: 3, value: 100 }], 5);
assert(singleFit.optimalValue === 100, 'Single item fits → value is $100');
assert(singleFit.optimalSet.includes('a'), 'Single item fits → included in set');

// Edge case: single item doesn't fit
const singleNoFit = dpSolver([{ id: 'b', weight: 10, value: 100 }], 5);
assert(singleNoFit.optimalValue === 0, "Single item doesn't fit → value is $0");
assert(singleNoFit.optimalSet.length === 0, "Single item doesn't fit → empty set");

// ════════════════════════════════════════
// TEST GROUP 2: hintEngine
// ════════════════════════════════════════
console.log('\n══ hintEngine Tests ══');

// Scenario A: Empty bag → should suggest ADD (Tier 1)
const emptyBagItems = CLASSIC_ITEMS.map(i => ({ ...i, inBag: false }));
const hintA = hintEngine(emptyBagItems, CLASSIC_CAPACITY);
assert(hintA.type === 'add', `Empty bag → hint type is 'add' (got '${hintA.type}')`);
console.log(`    → "${hintA.message}"`);

// Scenario B: Bag has room → should suggest ADD
const partialBagItems = CLASSIC_ITEMS.map(i => ({
  ...i,
  inBag: i.id === 'camera' || i.id === 'tablet', // 2 + 3 = 5 lbs (room for more)
}));
const hintB = hintEngine(partialBagItems, CLASSIC_CAPACITY);
assert(hintB.type === 'add', `Partial bag (5/26 lbs) → hint type is 'add' (got '${hintB.type}')`);
console.log(`    → "${hintB.message}"`);

// Scenario C: Bag is full but suboptimal → should suggest SWAP (Tier 2 or 3)
// Put in: Computer(7,$290) + Printer(6,$238) + Keurig(5,$240) + Toaster(3,$110) + Speaker(3,$123) + Camera(2,$100)
// Total: 7+6+5+3+3+2 = 26 lbs, value = $1,101 (suboptimal, optimal is $1,166)
const fullSuboptimalItems = CLASSIC_ITEMS.map(i => ({
  ...i,
  inBag: ['computer', 'printer', 'keurig', 'toaster', 'speaker', 'camera'].includes(i.id),
}));
const hintC = hintEngine(fullSuboptimalItems, CLASSIC_CAPACITY);
assert(hintC.type === 'swap', `Full bag, suboptimal → hint type is 'swap' (got '${hintC.type}')`);
assert(hintC.message.includes('+$') || hintC.message.includes('→'), 'Swap hint includes gain info');
console.log(`    → "${hintC.message}"`);

// Scenario D: Optimal solution → should confirm optimality (Tier 4)
const optimalBagItems = CLASSIC_ITEMS.map(i => ({
  ...i,
  inBag: optimalSet.includes(i.id),
}));
const hintD = hintEngine(optimalBagItems, CLASSIC_CAPACITY);
assert(hintD.type === 'optimal', `Optimal bag → hint type is 'optimal' (got '${hintD.type}')`);
assert(hintD.message.includes('optimal'), 'Optimal hint includes the word "optimal"');
console.log(`    → "${hintD.message}"`);

// Scenario E: Near-optimal, needs a single swap to reach optimal
// Put in optimal set but swap Keurig for RoboVac (same weight, lower value: $190 vs $240)
const nearOptimalItems = CLASSIC_ITEMS.map(i => ({
  ...i,
  inBag: [...optimalSet.filter(id => id !== 'keurig'), 'robovac'].includes(i.id),
}));
const hintE = hintEngine(nearOptimalItems, CLASSIC_CAPACITY);
assert(hintE.type === 'swap' || hintE.type === 'add', `Near-optimal → hint is swap or add (got '${hintE.type}')`);
console.log(`    → "${hintE.message}"`);

// ════════════════════════════════════════
// SUMMARY
// ════════════════════════════════════════
console.log(`\n══ Results: ${passed} passed, ${failed} failed ══`);
if (failed === 0) {
  console.log('🧠 Phase 2 — The Brain is VERIFIED! ✅\n');
} else {
  console.log('⚠️  Some tests failed. Review above.\n');
}

process.exit(failed > 0 ? 1 : 0);
