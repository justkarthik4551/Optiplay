/**
 * Truck Hint Engine — 4-tier coaching for the multi-constraint knapsack game.
 * Ref: docs/03_engineering/06_Pack_The_Truck_Algorithms.md §3
 *
 * Same tiered philosophy as hintEngine.js (Game 1), adapted for 2 constraints.
 * Each tier returns the FIRST valid improvement found.
 *
 * @param {Array<{id,name,weight,volume,value,inBag}>} items
 * @param {number} maxWeight
 * @param {number} maxVolume
 * @returns {{ type: 'add'|'swap'|'optimal', message: string }}
 */
export function truckHintEngine(items, maxWeight, maxVolume) {
  const truckItems = items.filter((i) => i.inBag);
  const outItems = items.filter((i) => !i.inBag);

  const usedWeight = truckItems.reduce((s, i) => s + i.weight, 0);
  const usedVolume = truckItems.reduce((s, i) => s + i.volume, 0);

  // Shared feasibility check for 2 constraints
  const fits = (item, extraW = 0, extraU = 0) =>
    usedWeight + extraW + item.weight <= maxWeight &&
    usedVolume + extraU + item.volume <= maxVolume;

  // ──────────────────────────────────────────────
  // Tier 1 — ADD: best item that fits in the truck
  // ──────────────────────────────────────────────
  const addable = outItems
    .filter((item) => fits(item))
    .map((item) => ({ item, ratio: item.value / (item.weight + item.volume) }))
    .sort((a, b) => b.ratio - a.ratio);

  if (addable.length > 0) {
    const best = addable[0].item;
    return {
      type: 'add',
      message: `Load the ${best.name} (₹${best.value}, ${best.weight} kg, ${best.volume} cu.ft.)`,
    };
  }

  // ──────────────────────────────────────────────
  // Tier 2 — SWAP 1-for-1
  // ──────────────────────────────────────────────
  let bestSwap = null;
  let bestGain = 0;

  for (const x of truckItems) {
    for (const y of outItems) {
      const netW = y.weight - x.weight;
      const netU = y.volume - x.volume;
      const gain = y.value - x.value;
      if (
        usedWeight + netW <= maxWeight &&
        usedVolume + netU <= maxVolume &&
        gain > bestGain
      ) {
        bestSwap = { remove: x, add: y, gain };
        bestGain = gain;
      }
    }
  }

  if (bestSwap) {
    return {
      type: 'swap',
      message: `Swap ${bestSwap.remove.name} (₹${bestSwap.remove.value}) for ${bestSwap.add.name} (₹${bestSwap.add.value}) → +₹${bestSwap.gain}`,
    };
  }

  // ──────────────────────────────────────────────
  // Tier 3 — SWAP 1-for-2 (remove 1, add 2)
  // ──────────────────────────────────────────────
  let bestMulti = null;
  let bestMultiGain = 0;

  for (const x of truckItems) {
    const freeW = usedWeight - x.weight;
    const freeU = usedVolume - x.volume;
    for (let a = 0; a < outItems.length; a++) {
      for (let b = a + 1; b < outItems.length; b++) {
        const y1 = outItems[a];
        const y2 = outItems[b];
        const gain = y1.value + y2.value - x.value;
        if (
          freeW + y1.weight + y2.weight <= maxWeight &&
          freeU + y1.volume + y2.volume <= maxVolume &&
          gain > bestMultiGain
        ) {
          bestMulti = { remove: [x], add: [y1, y2], gain };
          bestMultiGain = gain;
        }
      }
    }
  }

  // Also try SWAP 2-for-1
  for (let a = 0; a < truckItems.length; a++) {
    for (let b = a + 1; b < truckItems.length; b++) {
      const x1 = truckItems[a];
      const x2 = truckItems[b];
      const freeW = usedWeight - x1.weight - x2.weight;
      const freeU = usedVolume - x1.volume - x2.volume;
      for (const y of outItems) {
        const gain = y.value - x1.value - x2.value;
        if (
          freeW + y.weight <= maxWeight &&
          freeU + y.volume <= maxVolume &&
          gain > bestMultiGain
        ) {
          bestMulti = { remove: [x1, x2], add: [y], gain };
          bestMultiGain = gain;
        }
      }
    }
  }

  if (bestMulti) {
    const removeNames = bestMulti.remove.map((i) => i.name).join(' + ');
    const addNames = bestMulti.add.map((i) => i.name).join(' + ');
    return {
      type: 'swap',
      message: `Remove ${removeNames} and load ${addNames} → +₹${bestMulti.gain}`,
    };
  }

  // ──────────────────────────────────────────────
  // Tier 4 — OPTIMAL
  // ──────────────────────────────────────────────
  return {
    type: 'optimal',
    message: 'Your truck is optimally loaded! 🎉',
  };
}
