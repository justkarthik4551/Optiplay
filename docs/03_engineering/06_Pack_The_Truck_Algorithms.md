# 06 — Algorithms & Logic: Pack the Truck! (Multi-Constraint Knapsack)

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 06 of 11 · Algorithms — Game 2
> **Cross-references:** [04 Algorithms (Game 1)](./04_Algorithms_and_Logic.md) · [05 GDD](./05_Pack_The_Truck_GDD.md)

---

## 1. Why DP Fails for 2 Constraints

Game 1 uses a 2D DP table `dp[i][w]` — one dimension per item-index, one per weight. For 2 constraints, we would need a 3D table `dp[i][w][u]`. This is perfectly solvable mathematically (O(N × W × U)), but for our game's scale (N≤15, W≤100, U≤60), this produces at most 15 × 100 × 60 = **90,000 cells** — trivial for browser JS.

> **Design Decision:** We will use the 3D DP approach (not Branch & Bound) for two reasons:
> 1. Our problem sizes are small enough that 3D DP is instantaneous.
> 2. It still gives us an **exact optimal solution** with guaranteed correctness.
> 3. Branch & Bound is conceptually complex to implement correctly in JS without bugs.
> The 3D DP is documented as "Multi-Constraint DP" in the UI to maintain pedagogical accuracy.

---

## 2. The Multi-Constraint DP Solver (`truckSolver.js`)

### Algorithm: 3D Bottom-Up Dynamic Programming

```
DP[i][w][u] = max value using items 0..i-1,
              with at most w kg and u cu.ft. remaining

Base case:  DP[0][w][u] = 0  for all w, u

Recurrence: DP[i][w][u] = max(
              DP[i-1][w][u],                                     // exclude item i
              DP[i-1][w - weight_i][u - volume_i] + value_i      // include item i (if fits)
            )

Answer: DP[N][W][U]
```

### Traceback (recover the optimal item set)

Starting from `DP[N][W][U]`, walk backwards through item indices:
- If `DP[i][w][u] !== DP[i-1][w][u]`, item `i` is included in the solution.
  - Set `w = w - weight_i`, `u = u - volume_i`
- If equal, item `i` is excluded.

### Complexity
- **Time:** O(N × W × U)
- **Space:** O(N × W × U) — can be reduced to O(W × U) with a rolling 2D array

### Return Value
```javascript
{ optimalValue: number, optimalSet: string[] }
// optimalSet contains item IDs in the optimal solution
```

---

## 3. The Truck Hint Engine (`truckHintEngine.js`)

Same tiered coaching philosophy as Game 1's `hintEngine.js`, adapted for two constraints:

### Feasibility Check (helper)
```javascript
function fits(item, currentWeight, currentVolume, maxWeight, maxVolume) {
  return (
    currentWeight + item.weight <= maxWeight &&
    currentVolume + item.volume <= maxVolume
  );
}
```

### Tier 1 — ADD
- Find all items not in truck that `fits()` in remaining capacity.
- Among these, pick the one with highest `value / (weight + volume)` ratio.
- Return: `{ type: 'add', message: 'Load the [Item] (₹[val], [w] kg, [v] cu.ft.)' }`

### Tier 2 — SWAP 1-for-1
- For each item X in truck and item Y outside:
  - New weight = `currentWeight - X.weight + Y.weight ≤ maxWeight`
  - New volume = `currentVolume - X.volume + Y.volume ≤ maxVolume`
  - `Y.value - X.value > 0` (strict improvement)
- Pick the swap with the highest net gain.
- Return: `{ type: 'swap', message: 'Swap [X] (₹[x]) for [Y] (₹[y]) → +₹[gain]' }`

### Tier 3 — SWAP multi (1-for-2 or 2-for-1)
- Remove 1 from truck, try to add 2 from outside (both constraints must hold).
- Remove 2 from truck, try to add 1 from outside.
- Pick the combination with the highest net gain.

### Tier 4 — OPTIMAL
- Return: `{ type: 'optimal', message: 'Your truck is optimally loaded! 🎉' }`

---

## 4. Verified Reference Values (Classic Mode)

> To be computed after implementation and verified against solver output.

| Parameter | Value |
|-----------|-------|
| Items | 12 Indian household/furniture items |
| Max Weight | 100 kg |
| Max Volume | 60 cu.ft. |
| **Optimal Value** | TBD — computed by `truckSolver.js` |
| **Optimal Set** | TBD |

---

## 5. Random Mode Feasibility Guarantee

For random mode, we must ensure at least one feasible solution exists:

```javascript
// After generating random items:
// 1. Sort items by value/weight ratio (greedy)
// 2. Greedily pack until a constraint is hit
// 3. If zero items fit → regenerate (extremely rare edge case)
// 4. Set capacity to 40-65% of total weight and volume
```

---

*Document created: April 2026*
*Status: Approved for Implementation (Phase 8)*
