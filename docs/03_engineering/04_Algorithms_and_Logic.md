# 04 — Algorithms & Logic Specifications

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 04 of 11 · Algorithms & Logic Specifications
> **Cross-references:** [02 System Architecture](./02_System_Architecture.md) · [03 Iterative Dev Plan](../04_delivery/03_Iterative_Development_Plan.md) (Phase 2)

---

## 1. The DP Solver (`dpSolver.js`)

### Problem Definition (0/1 Knapsack)
Given:
- `N` items, each with a `weight` (integer, kg) and `value` (integer, ₹).
- A bag with integer `capacity` W.

Find the subset of items that maximizes total value without exceeding capacity W. Each item is either fully included or excluded (0/1 constraint — no fractional items).

### Algorithm: Bottom-Up Dynamic Programming
```
DP[i][w] = max value achievable using items 1..i with capacity w

Base case:  DP[0][w] = 0  for all w
Recurrence: DP[i][w] = max(
              DP[i-1][w],                         // exclude item i
              DP[i-1][w - weight_i] + value_i      // include item i (if weight_i ≤ w)
            )

Answer: DP[N][W]
```

### Traceback (to recover the optimal item set)
Starting from `DP[N][W]`, walk backwards:
- If `DP[i][w] ≠ DP[i-1][w]`, item `i` is included. Set `w = w - weight_i`.
- If `DP[i][w] = DP[i-1][w]`, item `i` is excluded.

### Implementation Notes
- **Time Complexity:** O(N × W). For N = 20, W = 100 → 2,000 operations. Trivial for browser JS.
- **Space Optimization:** A 1D rolling array can be used (iterating W downward) to reduce space from O(N × W) to O(W). Optional for our use case.
- **Return Value:** `{ optimalValue: number, optimalSet: string[] }` where `optimalSet` contains item IDs.

### Verified Reference Values (Classic Mode — Indian Localization)
| Parameter | Value |
|-----------|-------|
| Items | 12 (Microwave, Mixer Grinder, Pressure Cooker, Cricket Kit, Saregama Carvaan, Air Fryer, Alphonso Mangoes, Smartwatch, Madhubani Art, BT Speaker, Sandwich Maker, DSLR Camera) |
| Capacity | 26 kg |
| **Optimal Value** | **₹1,166** |
| **Optimal Set** | DSLR Camera (₹100, 2 kg), Madhubani Art (₹130, 3 kg), Smartwatch (₹145, 3 kg), Alphonso Mangoes (₹161, 4 kg), Saregama Carvaan (₹190, 4 kg), Cricket Kit (₹200, 5 kg), Mixer Grinder (₹240, 5 kg) |
| **Optimal Weight** | 26 kg (exactly at capacity) |
| **Optimal Item Count** | 7 |

---

## 2. The Hint Engine (`hintEngine.js`)

### Directive
Provide **exactly one** actionable suggestion that **strictly improves** the user's current total value without exceeding capacity. If no improvement is possible, confirm optimality.

### Input
```javascript
hintEngine(items, capacity)
// items: array of { id, name, weight, value, inBag: boolean }
// capacity: integer
```

### Output
```javascript
{ type: 'add' | 'swap' | 'optimal', message: string }
```

### Tiered Logic

The engine evaluates tiers in order and returns the first valid suggestion found:

**Tier 1 — ADD (simplest)**
- Iterate over items where `inBag === false`.
- If `currentWeight + item.weight ≤ capacity`, the item can be added.
- Among all addable items, select the one with the **highest value-to-weight ratio** (`item.value / item.weight`).
- Return: `{ type: 'add', message: 'Add the [Item Name] (₹[value], [weight] kg)' }`

**Tier 2 — SWAP 1-for-1**
- For each item X in the bag and item Y outside the bag:
  - Check: `currentWeight - X.weight + Y.weight ≤ capacity`
  - Check: `Y.value - X.value > 0` (strict improvement)
- Among all valid swaps, select the one with the **greatest net value gain** (`Y.value - X.value`).
- Return: `{ type: 'swap', message: 'Swap [X] for [Y] (+₹[gain])' }`

**Tier 3 — SWAP 1-for-2 or 2-for-1**
- Remove 1 item from the bag, attempt to add 2 items from outside (or vice versa).
- Same validity checks: weight ≤ capacity, net value > 0.
- Select the combination with the greatest net value gain.
- Return: `{ type: 'swap', message: 'Remove [X] and add [Y1] + [Y2] (+₹[gain])' }`

---

## 3. Show Optimal Solution (`PACK_OPTIMAL_SOLUTION`)

A UI button ("✨ Show Optimal") allows the user to instantly reveal the DP-optimal item set. This is designed as a teaching tool — the user can explore what the algorithm chose and why.

### How It Works
1. On `START_GAME`, `dpSolver` returns both `optimalValue` and `optimalSet` (the IDs of optimal items).
2. These IDs are stored in `state.optimalItemIds`.
3. When the user clicks "✨ Show Optimal", the `PACK_OPTIMAL_SOLUTION` action fires in the reducer.
4. The reducer uses a `Set` of optimal IDs to flip all items: optimal items get `inBag: true`, everything else `inBag: false`.
5. The Victory Modal fires 400ms later (after items animate into the bag).

### Pedagogical Intent
The feature is intentionally placed *after* the Hint button. The intended student journey is:
- Try → Get stuck → Use 💡 Hint → Try again → Still stuck → Use ✨ Show Optimal → Learn from the solution.

**Tier 4 — OPTIMAL (no improvement found)**
- Return: `{ type: 'optimal', message: 'Your solution is already optimal! 🎉' }`

### Edge Cases
- **Empty bag:** Tier 1 will always find an addable item (unless capacity is 0).
- **Full capacity, suboptimal:** Tier 2 or 3 will find a swap.
- **Multiple optimal solutions:** Different item sets can achieve the same `optimalValue`. All are equally valid victories. The hint engine may guide toward any one of them.
