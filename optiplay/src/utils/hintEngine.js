/**
 * Hint Engine — Tiered coaching for the 0/1 Knapsack game
 * Ref: docs/04_Algorithms_and_Logic.md §2
 *
 * Provides exactly ONE actionable suggestion that strictly improves
 * the user's current total value without exceeding capacity.
 *
 * @param {Array<{id: string, name: string, weight: number, value: number, inBag: boolean}>} items
 * @param {number} capacity
 * @returns {{ type: 'add' | 'swap' | 'optimal', message: string }}
 */
export function hintEngine(items, capacity) {
  const bagItems = items.filter(i => i.inBag);
  const outItems = items.filter(i => !i.inBag);
  const currentWeight = bagItems.reduce((sum, i) => sum + i.weight, 0);

  // ──────────────────────────────────────
  // Tier 1 — ADD: Can we simply add an item?
  // ──────────────────────────────────────
  const addable = outItems
    .filter(item => currentWeight + item.weight <= capacity)
    .map(item => ({
      item,
      ratio: item.value / item.weight,
    }))
    .sort((a, b) => b.ratio - a.ratio); // best ratio first

  if (addable.length > 0) {
    const best = addable[0].item;
    return {
      type: 'add',
      message: `Add the ${best.name} ($${best.value}, ${best.weight} lbs)`,
    };
  }

  // ──────────────────────────────────────
  // Tier 2 — SWAP 1-for-1
  // ──────────────────────────────────────
  let bestSwap = null;
  let bestGain = 0;

  for (const x of bagItems) {
    for (const y of outItems) {
      const newWeight = currentWeight - x.weight + y.weight;
      const gain = y.value - x.value;
      if (newWeight <= capacity && gain > bestGain) {
        bestSwap = { remove: x, add: y, gain };
        bestGain = gain;
      }
    }
  }

  if (bestSwap) {
    return {
      type: 'swap',
      message: `Swap ${bestSwap.remove.name} ($${bestSwap.remove.value}) for ${bestSwap.add.name} ($${bestSwap.add.value}) → +$${bestSwap.gain}`,
    };
  }

  // ──────────────────────────────────────
  // Tier 3 — SWAP 1-for-2 (remove 1, add 2)
  // ──────────────────────────────────────
  let bestMultiSwap = null;
  let bestMultiGain = 0;

  for (const x of bagItems) {
    // Try adding 2 items from outside after removing x
    for (let i = 0; i < outItems.length; i++) {
      for (let j = i + 1; j < outItems.length; j++) {
        const y1 = outItems[i];
        const y2 = outItems[j];
        const newWeight = currentWeight - x.weight + y1.weight + y2.weight;
        const gain = (y1.value + y2.value) - x.value;
        if (newWeight <= capacity && gain > bestMultiGain) {
          bestMultiSwap = { remove: [x], add: [y1, y2], gain };
          bestMultiGain = gain;
        }
      }
    }
  }

  // Also try SWAP 2-for-1 (remove 2, add 1)
  for (let i = 0; i < bagItems.length; i++) {
    for (let j = i + 1; j < bagItems.length; j++) {
      const x1 = bagItems[i];
      const x2 = bagItems[j];
      for (const y of outItems) {
        const newWeight = currentWeight - x1.weight - x2.weight + y.weight;
        const gain = y.value - (x1.value + x2.value);
        if (newWeight <= capacity && gain > bestMultiGain) {
          bestMultiSwap = { remove: [x1, x2], add: [y], gain };
          bestMultiGain = gain;
        }
      }
    }
  }

  if (bestMultiSwap) {
    const removeNames = bestMultiSwap.remove.map(i => i.name).join(' + ');
    const addNames = bestMultiSwap.add.map(i => i.name).join(' + ');
    return {
      type: 'swap',
      message: `Remove ${removeNames} and add ${addNames} → +$${bestMultiSwap.gain}`,
    };
  }

  // ──────────────────────────────────────
  // Tier 4 — OPTIMAL (no improvement possible)
  // ──────────────────────────────────────
  return {
    type: 'optimal',
    message: 'Your solution is already optimal! 🎉',
  };
}
