# 02 — Game Design

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> **Cross-references:** [01 Problem Definition](./01-problem-definition.md) · [03 Algorithms](./03-algorithms.md) · [04 System Architecture](./04-system-architecture.md)

---

## Overview

Each OptiPlay game is a **precise, playable instance of a formally defined OR problem**. The design goal is not to simulate OR — it is to *be* OR, wrapped in mechanics that make the problem approachable and the solution memorable.

Design philosophy:
> The player should be able to solve the game optimally without knowing any algorithm — and then understand why the algorithm works because of what they experienced while playing.

---

## Game 1: Pack That Bag! 🎒

### 1.1 OR Problem Mapping

| Game Element | OR Equivalent |
|-------------|---------------|
| Items in inventory | Decision variables xᵢ ∈ {0, 1} |
| Dragging into bag | Setting xᵢ = 1 |
| Dragging back out | Setting xᵢ = 0 |
| Weight limit | Constraint: Σ wᵢxᵢ ≤ W |
| Rupee value counter | Objective: Σ vᵢxᵢ |
| Winning the game | Achieving max Σ vᵢxᵢ |

The student is, unknowingly (at first), solving a 0/1 Integer Programming problem with one constraint. They experience:
- **Feasibility:** Not everything fits. Choices must be made.
- **Tradeoffs:** A heavier, higher-value item might crowd out two lighter, higher-value items combined.
- **Optimality gap:** Your intuitive solution is often not the best one.

### 1.2 Problem Parameters (Classic Mode)

```
N = 12 items (Indian household products)
W = 26 kg (bag weight limit)
Optimal Value = ₹1,166
Optimal Item Count = 7 items
```

**Item set** — source of truth: `optiplay/src/utils/classicItems.js`

| Item | Weight (kg) | Value (₹) | V/W Ratio |
|------|------------|-----------|-----------|
| Microwave | 7 | 290 | 41.4 |
| Mixer Grinder | 5 | 240 | 48.0 |
| Pressure Cooker | 6 | 238 | 39.7 |
| Cricket Kit | 5 | 200 | 40.0 |
| Saregama Carvaan | 4 | 190 | 47.5 |
| Air Fryer | 5 | 190 | 38.0 |
| Alphonso Mangoes | 4 | 161 | 40.3 |
| Smartwatch | 3 | 145 | 48.3 |
| Madhubani Art | 3 | 130 | 43.3 |
| BT Speaker | 3 | 123 | 41.0 |
| Sandwich Maker | 3 | 110 | 36.7 |
| DSLR Camera | 2 | 100 | 50.0 |

*The item set is deliberately constructed so that a pure greedy (highest ratio first) approach is sub-optimal — the core pedagogical point. See [03 Algorithms §1.2](./03-algorithms.md) for the counter-example proof.*

### 1.3 Game Modes

| Mode | Description | Pedagogical Purpose |
|------|-------------|---------------------|
| Classic | Fixed 12-item problem | Reproducible; used for class discussions |
| Random | **8–15 items**, weight 1–10 kg, value ₹50–₹500 | Tests generalization; different every run |
| Custom | User-defined items, weights, values, capacity (max 20 items) | Lets students formulate and solve their own problems |

### 1.4 UX Design Decisions

**Drag & Drop (not checkboxes)**
The physical act of picking up an item and placing it in a bag engages spatial reasoning and makes the weight constraint feel real. A simple checkbox would work algorithmically but removes the embodied experience.

**Real-time weight bar**
The progress bar fills as items are added, turning abstract numbers into a visual budget. Students *see* capacity shrinking with each addition — this is the constraint made tangible.

**4-Tier Hint Engine**
Hints are tiered to avoid giving too much too fast:
1. **Add** — "There's room for one more item"
2. **Swap 1-for-1** — "Exchange this item for a better one"
3. **Swap multi** — "Remove one, add two" or "Remove two, add one"
4. **Optimal** — "You've found it"

Each tier represents a different level of neighbourhood search. Students who use hints naturally learn the language of local search without it being labelled as such.

**Show Optimal (last resort)**
The "✨ Show Optimal" button invokes the DP solver and animates the optimal solution onto the board. Students can study *what* the algorithm chose and compare it to their own attempt. The Victory Modal explicitly marks this as "🤖 Auto-Solved" — there is no reward, just insight.

### 1.5 Learning Outcomes

After playing Pack That Bag!, a student should be able to:

1. Define the 0/1 Knapsack problem in their own words
2. Explain why greedy (highest value-to-weight) does not guarantee optimality
3. Articulate what a "feasible" solution means (satisfies all constraints)
4. Understand why Dynamic Programming is used (overlapping subproblems, no greedy choice property)
5. Identify at least two item-swap strategies that improve a suboptimal solution

---

## Game 2: Pack the Truck! 🚚

### 2.1 OR Problem Mapping

| Game Element | OR Equivalent |
|-------------|---------------|
| Items in inventory | Decision variables xᵢ ∈ {0, 1} |
| Weight bar | Constraint: Σ wᵢxᵢ ≤ W |
| Volume bar | Constraint: Σ uᵢxᵢ ≤ U |
| Rupee value | Objective: Σ vᵢxᵢ |
| Card left-border colour | Volume density (compact → bulky) — visual heuristic aid |

This is the **Multi-Dimensional Knapsack Problem (MDKP)** with dimension d=2. The student now experiences:
- **Two simultaneous constraints** — an item can fit by weight but not volume, or vice versa
- **Increased problem hardness** — the interaction between two binding constraints is non-obvious
- **New tradeoff axis** — items must now be evaluated on weight efficiency, volume efficiency, and value simultaneously

### 2.2 Problem Parameters (Classic Mode)

```
N = 12 items (Indian moving-day household goods)
W = 100 kg (truck weight limit)
U = 60 cu.ft. (truck volume limit)
Optimal Value = ₹2,730
Optimal Item Set = 6 items (LED TV, Microwave, Air Conditioner, Study Desk, Cricket Kit Bag, Suitcase)
```

*Source of truth: `optiplay/src/utils/truckItems.js`. See [03 Algorithms §2](./03-algorithms.md) for the 3D DP derivation.*

**Item set:**

| Item | Weight (kg) | Volume (cu.ft.) | Value (₹) |
|------|------------|-----------------|-----------|
| Refrigerator | 40 | 20 | 850 |
| Washing Machine | 35 | 18 | 780 |
| LED TV (55") | 20 | 15 | 650 |
| Sofa Set | 45 | 25 | 900 |
| Dining Table | 30 | 20 | 720 |
| Microwave | 12 | 6 | 340 |
| Air Conditioner | 28 | 12 | 680 |
| Study Desk | 22 | 14 | 560 |
| Almirah | 50 | 28 | 950 |
| Bookshelf | 18 | 16 | 480 |
| Cricket Kit Bag | 8 | 5 | 220 |
| Suitcase | 10 | 7 | 280 |

### 2.3 Volume-Density Visual Encoding

Each TruckItemCard has a coloured left border that encodes volume density relative to the item set:

| Border Colour | Volume Density | Interpretation |
|--------------|----------------|----------------|
| 🟢 Green | < 35th percentile | Space-efficient item |
| 🟡 Amber | 35th–65th percentile | Moderate space use |
| 🔴 Red | > 65th percentile | Space-hungry item |

This passive visual encoding teaches students to think about two-dimensional efficiency without explicit instruction.

### 2.4 Progression from Game 1 to Game 2

The second game is intentionally a pedagogical extension of the first:

| Dimension | Pack That Bag | Pack the Truck |
|-----------|--------------|----------------|
| Constraints | 1 | 2 |
| Solver dimension | 2D DP table | 3D DP table |
| Hint complexity | Single feasibility check | Dual feasibility check |
| Items | 12 | 12 |
| Visual encoding | Weight bar | Weight bar + Volume bar + colour border |

This progression mirrors how OR curricula naturally build — master one constraint, then add more.

### 2.5 Learning Outcomes

After playing Pack the Truck!, a student should be able to:

1. Define the Multi-Dimensional Knapsack Problem
2. Explain why adding a second constraint makes a problem harder (feasible region shrinks)
3. Recognize that a near-optimal weight allocation may be infeasible when volume is considered
4. Understand that the 2D DP generalization extends naturally to d dimensions (at O(W^d) cost)
5. Discuss real-world analogs (container loading, capital budgeting with multiple budget periods)

---

## Shared UX Principles

### Principle 1: Constraint Before Formula
The student feels the constraint through gameplay before it is ever presented as mathematics. This is Schwartz & Bransford's "Preparation for Future Learning" model.

### Principle 2: Least-Intrusive Feedback First
The hint engine never gives the optimal solution as a first response. Students must reach for it gradually. This mirrors Socratic method — guide, don't tell.

### Principle 3: Failure is Informative
The capacity flash (red pulsing border) when a student tries to add an item that doesn't fit is deliberately visible. The constraint violation is the lesson.

### Principle 4: The Algorithm Reveals Itself
When "Show Optimal" is used, the Victory Modal explains the algorithm in plain language. The student who just spent 5 minutes struggling is primed to understand the explanation — they have context the passive learner lacks.
