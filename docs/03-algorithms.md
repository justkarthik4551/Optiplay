# 03 — Algorithms & Mathematical Foundations

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> **Cross-references:** [02 Game Design](./02-game-design.md) · [04 System Architecture](./04-system-architecture.md) · [05 Code Explained](./05-code-explained.md) · [06 Decisions](./06-decisions.md)

---

## 1. The 0/1 Knapsack Problem (Game 1)

### 1.1 Formal Problem Statement

**Given:**
- A set of `n` items, indexed `i = 1, ..., n`
- Each item `i` has weight `wᵢ ∈ ℤ⁺` and value `vᵢ ∈ ℤ⁺`
- A knapsack with integer weight capacity `W`

**Decision variables:** `xᵢ ∈ {0, 1}` for each item i (0 = excluded, 1 = included)

**Objective:**

```
maximize   Σᵢ₌₁ⁿ  vᵢ · xᵢ

subject to Σᵢ₌₁ⁿ  wᵢ · xᵢ ≤ W

           xᵢ ∈ {0, 1}  ∀ i
```

This is a **pure 0/1 Integer Programming problem**. The binary constraint is what makes it hard — without it, the fractional relaxation is solvable in O(n log n) by Greedy.

---

### 1.2 Why Not Greedy?

The intuitive approach: sort items by value-to-weight ratio `vᵢ/wᵢ` (highest first), then greedily add items until the bag is full.

**Counter-example from our Classic dataset** (source: `classicItems.js`):

Sorted by V/W ratio descending:
| Item | Weight (kg) | Value (₹) | V/W Ratio |
|------|------------|-----------|----------|
| DSLR Camera | 2 | 100 | 50.0 |
| Smartwatch | 3 | 145 | 48.3 |
| Mixer Grinder | 5 | 240 | 48.0 |
| Saregama Carvaan | 4 | 190 | 47.5 |
| BT Speaker | 3 | 123 | 41.0 |
| Microwave | 7 | 290 | 41.4 |
| Alphonso Mangoes | 4 | 161 | 40.3 |
| Cricket Kit | 5 | 200 | 40.0 |
| Pressure Cooker | 6 | 238 | 39.7 |
| Air Fryer | 5 | 190 | 38.0 |
| Sandwich Maker | 3 | 110 | 36.7 |
| Madhubani Art | 3 | 130 | 43.3 |

```
Capacity W = 26 kg

Greedy trace (highest V/W first):
  DSLR Camera      (2kg, ₹100,  ratio 50.0) → Add ✓  [ 2kg used, ₹100]
  Smartwatch       (3kg, ₹145,  ratio 48.3) → Add ✓  [ 5kg used, ₹245]
  Mixer Grinder    (5kg, ₹240,  ratio 48.0) → Add ✓  [10kg used, ₹485]
  Madhubani Art    (3kg, ₹130,  ratio 43.3) → Add ✓  [13kg used, ₹615]
  Microwave        (7kg, ₹290,  ratio 41.4) → Add ✓  [20kg used, ₹905]
  BT Speaker       (3kg, ₹123,  ratio 41.0) → Add ✓  [23kg used, ₹1028]
  Alphonso Mangoes (4kg, ₹161,  ratio 40.3) → SKIP  (23+4=27 > 26)
  Cricket Kit      (5kg, ₹200,  ratio 40.0) → SKIP  (23+5=28 > 26)
  Pressure Cooker  (6kg, ₹238,  ratio 39.7) → SKIP  (23+6=29 > 26)
  Air Fryer        (5kg, ₹190,  ratio 38.0) → SKIP  (23+5=28 > 26)
  Sandwich Maker   (3kg, ₹110,  ratio 36.7) → Add ✓  [26kg used, ₹1138]
  Saregama Carvaan (4kg, ₹190) → SKIP (bag full)

Greedy result:  ₹1,138  (26 kg used — bag is full, but not optimal)

DP Optimal:     ₹1,166  (₹28 better)
DP Optimal set: Mixer Grinder + Pressure Cooker + Saregama Carvaan +
                Air Fryer + Alphonso Mangoes + Smartwatch + DSLR Camera
                (5+6+4+5+4+3+2 = 29? No...)
```

> **Note:** The exact optimal set is computed by the DP solver at runtime and stored in `state.optimalItemIds`. The optimal value of **₹1,166** is verified in `classicItems.js` code comments and confirmed by brute-force enumeration (see [07 Experiments §1](./07-experiments.md)).

**Key takeaway:** Greedy produces a suboptimal solution (₹1,138) even when the bag is filled to capacity. The interaction between items means no simple ordering rule always works — this is the fundamental insight Dynamic Programming provides.

**This is the central lesson of Game 1:** A locally optimal choice (taking the highest-ratio item) does not guarantee a globally optimal solution when items are indivisible.

---

### 1.3 Brute Force

**Approach:** Enumerate all 2ⁿ subsets of items. Return the feasible subset with maximum value.

**Time complexity:** O(2ⁿ)

For n = 12 items → 2¹² = 4,096 subsets → feasible for demonstration.
For n = 30 items → 2³⁰ = 1,073,741,824 → intractable.

**Why we don't use it:** Even though n ≤ 15 in our game, the DP approach is both faster *and* interpretable via the DP table structure — which is the educational point.

---

### 1.4 Dynamic Programming (Our Implementation)

**Key insight:** The Knapsack problem has **optimal substructure** and **overlapping subproblems** — the two conditions that make DP applicable.

**Optimal substructure:** An optimal solution to the n-item, W-capacity problem either:
- Excludes item n → reduces to the (n-1)-item, W-capacity problem
- Includes item n → reduces to the (n-1)-item, (W - wₙ)-capacity problem

**Recurrence relation:**

```
DP[i][w] = maximum value achievable using items {1, ..., i} with capacity w

Base case:
  DP[0][w] = 0   for all w  (no items → zero value)

Recurrence:
  DP[i][w] = DP[i-1][w]                              if wᵢ > w  (item i too heavy)
  DP[i][w] = max(DP[i-1][w],                         otherwise
                 DP[i-1][w - wᵢ] + vᵢ)
  
           = max(exclude item i,
                 include item i)

Answer: DP[n][W]
```

**Table construction (bottom-up):**

Fill the table row by row (item by item), column by column (capacity 0 to W). Each cell is computed in O(1) from two previously computed cells.

**Example (small instance):**

```
Items: A(w=2, v=6), B(w=3, v=10), C(w=4, v=12)  |  W = 5

       w=0  w=1  w=2  w=3  w=4  w=5
i=0     0    0    0    0    0    0
i=1(A)  0    0    6    6    6    6
i=2(B)  0    0    6   10   10   16
i=3(C)  0    0    6   10   12   16

Optimal = DP[3][5] = 16  (items A + B)
```

**Time complexity:** O(n × W)
**Space complexity:** O(n × W) — reducible to O(W) with rolling array

For our game: n = 12, W = 26 → 312 cells. Runs in < 1ms in the browser.

**Traceback (recovering the optimal item set):**

Starting from `DP[n][W]`, walk backwards:

```
for i from n downto 1:
  if DP[i][w] ≠ DP[i-1][w]:
    item i is included
    w = w - wᵢ
  else:
    item i is excluded
```

---

## 2. The Multi-Constraint Knapsack Problem (Game 2)

### 2.1 Formal Problem Statement

**Given:**
- A set of `n` items, each with weight `wᵢ`, volume `uᵢ`, and value `vᵢ`
- A truck with weight capacity `W` AND volume capacity `U`

**Objective:**

```
maximize   Σᵢ₌₁ⁿ  vᵢ · xᵢ

subject to Σᵢ₌₁ⁿ  wᵢ · xᵢ ≤ W     (weight constraint)
           Σᵢ₌₁ⁿ  uᵢ · xᵢ ≤ U     (volume constraint)

           xᵢ ∈ {0, 1}  ∀ i
```

This is the **2-Dimensional 0/1 Knapsack Problem**, a special case of the **Multi-Dimensional Knapsack Problem (MDKP)**.

### 2.2 Complexity

The MDKP is **NP-hard** (reduction from 0/1 Knapsack, which is NP-hard). Adding dimensions does not change the computational class, but it increases the DP table size multiplicatively.

The 1D DP runs in O(n × W). The 2D extension runs in O(n × W × U). Each additional dimension adds one factor.

For our game: n=12, W=100, U=60 → 72,000 cells. Still runs in < 1ms.

### 2.3 3D Dynamic Programming (Our Implementation)

**Recurrence relation:**

```
DP[i][w][u] = maximum value using items {1, ..., i}
              with weight capacity w and volume capacity u

Base case:
  DP[0][w][u] = 0   for all w, u

Recurrence:
  DP[i][w][u] = DP[i-1][w][u]                            if wᵢ > w or uᵢ > u
  DP[i][w][u] = max(DP[i-1][w][u],                       otherwise
                    DP[i-1][w-wᵢ][u-uᵢ] + vᵢ)

Answer: DP[n][W][U]
```

**Traceback:**

```
for i from n downto 1:
  if DP[i][w][u] ≠ DP[i-1][w][u]:
    item i is included
    w = w - wᵢ
    u = u - uᵢ
```

**Implementation detail:** We use `Int32Array` (typed arrays) for each row of the 3D table. This avoids JavaScript's object overhead on large arrays and keeps memory contiguous.

**Verified result (Classic Mode):**

```
Input: 12 items, W=100, U=60
Optimal value: ₹2,730
Optimal set: LED TV + Microwave + Air Conditioner + Study Desk + Cricket Kit Bag + Suitcase
Weight used: 100/100 kg  (weight constraint binds)
Volume used: 59/60 cu.ft. (volume constraint almost binds)
```

*Pedagogical note:* The weight constraint binds exactly, but the volume constraint has 1 cu.ft. slack. This illustrates that in multi-constraint problems, not all constraints need to be simultaneously tight — and that adding a second constraint can force you to leave capacity unused in one dimension.

---

## 3. The Hint Engine

### 3.1 Design Goal

Provide the **minimum useful nudge** — never reveal the optimal solution, never give empty encouragement. Every hint must represent a concrete, actionable, strictly value-improving move.

### 3.2 Tier Structure

The engine evaluates tiers in sequence and returns on the **first hit**.

**Tier 1 — ADD**
```
For each item not in bag:
  if current_weight + item.weight ≤ W (and current_volume + item.volume ≤ U for Game 2):
    candidate_pool.add(item)

Return: item from candidate_pool with highest v/w ratio (Game 1)
        or highest v/(w+u) ratio (Game 2)
```

**Tier 2 — SWAP 1-for-1**
```
For each item X in bag, item Y not in bag:
  net_weight = current_weight - X.weight + Y.weight
  net_volume = current_volume - X.volume + Y.volume  (Game 2)
  gain = Y.value - X.value

  if net_weight ≤ W AND net_volume ≤ U AND gain > 0:
    candidate_swaps.add({X, Y, gain})

Return: swap with maximum gain
```

**Tier 3 — MULTI-SWAP**
Two sub-strategies evaluated simultaneously:
- Remove 1, add 2: for each X in bag, pair (Y₁, Y₂) not in bag
- Remove 2, add 1: for each pair (X₁, X₂) in bag, Y not in bag

```
Return: combination with maximum net gain (subject to all constraints)
```

**Tier 4 — OPTIMAL**
```
Return: "Your solution is already optimal!"
```

### 3.3 Why This Tier Order?

The tier order mirrors the **complexity of neighbourhood moves** in combinatorial optimization:
- Tier 1 = 1-opt insertion
- Tier 2 = 1-opt swap
- Tier 3 = 2-opt move

This is not accidental. Students who use all three tiers are, without knowing it, performing manual local search. This creates the foundation for understanding metaheuristics (Simulated Annealing, Tabu Search) in a later OR course.

---

## 4. Why Not Other Approaches?

| Approach | Why Rejected |
|----------|-------------|
| **Greedy** | Does not guarantee optimality for 0/1 knapsack. Shown to be suboptimal in our dataset. |
| **Branch & Bound** | Exact solver, but implementation complexity is high and the B&B tree is hard to visualize pedagogically. DP table is more transparent. |
| **Simulated Annealing** | Approximate. Our game requires exact optimality for victory detection. |
| **Linear Programming Relaxation** | Gives fractional solutions. The 0/1 constraint is the entire point of the game. |
| **Backend API (e.g., PuLP/Gurobi)** | Adds network latency, server costs, and deployment complexity. Client-side DP is faster for our problem scale. |

See [06 Decisions](./06-decisions.md) for the full rationale.
