# Experiments & Observations

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee

---

## Overview

This document describes the testing approach, observed outcomes, and analytical reflections from deploying and using OptiPlay. Given the project's scope (a single semester, student-led initiative), formal controlled trials were not feasible. What follows is a structured account of the design experiments, algorithmic verification, and informal user observations conducted during development.

---

## 1. Algorithm Verification Experiments

### Experiment A-01: Correctness of 2D DP Solver (Game 1)

**Objective:** Verify that `dpSolver.js` returns the true optimal solution for the Classic Mode problem.

**Method:** Brute-force enumeration of all 2¹² = 4,096 subsets of the 12-item Classic dataset. Compare the maximum feasible value with the DP solver output.

**Result:**

| Method | Optimal Value | Time (ms) |
|--------|--------------|-----------|
| Brute Force (all 4,096 subsets) | ₹1,166 | ~12ms |
| DP Solver (312 cells) | ₹1,166 | < 1ms |

**Conclusion:** Both methods agree. DP solver is 12× faster on this instance and scales O(N×W) vs. O(2ⁿ) for brute force.

**Optimal set verified:** DSLR Camera + Madhubani Art + Smartwatch + Alphonso Mangoes + Saregama Carvaan + Cricket Kit + Mixer Grinder (total: 26 kg, ₹1,166)

---

### Experiment A-02: Correctness of 3D DP Solver (Game 2)

**Objective:** Verify that `truckSolver.js` returns the true optimal solution for the Classic Truck Mode problem.

**Method:** Brute-force enumeration of all 2¹² = 4,096 subsets of the 12-item truck dataset. Filter for feasibility under both weight (≤ 100 kg) and volume (≤ 60 cu.ft.) constraints. Compare maximum feasible value with 3D DP output.

**Result:**

| Method | Optimal Value | Weight Used | Volume Used |
|--------|--------------|-------------|-------------|
| Brute Force | ₹2,730 | 100 kg | 59 cu.ft. |
| 3D DP Solver | ₹2,730 | 100 kg | 59 cu.ft. |

**Conclusion:** Solvers agree. The volume constraint has 1 cu.ft. slack in the optimal solution — an interesting pedagogical observation (not all constraints need to be simultaneously tight).

---

### Experiment A-03: Greedy Failure Verification

**Objective:** Confirm that the greedy (highest v/w ratio) heuristic produces a sub-optimal solution on the Game 1 Classic dataset.

**Method:** Apply greedy (sort by v/w ratio, add items greedily) to the 12-item Classic dataset with W=26.

**Result:**

| Strategy | Items Selected | Total Weight | Total Value | Gap from Optimal |
|----------|--------------|--------------|-------------|-----------------|
| Greedy (v/w ratio) | DSLR + Smartwatch + Mixer Grinder + Carvaan + Mangoes + BT Speaker | 24 kg | ₹1,066 | **-₹100 (-8.6%)** |
| DP Optimal | DSLR + Madhubani Art + Smartwatch + Mangoes + Carvaan + Cricket Kit + Mixer Grinder | 26 kg | ₹1,166 | — |

**Key finding:** Greedy leaves 2 kg unused and misses ₹100 of value. This counter-example is used in-game and in the FAQ as the definitive demonstration of greedy's failure on 0/1 knapsack.

---

### Experiment A-04: Hint Engine Coverage Test

**Objective:** Test that the hint engine provides actionable hints for all common game states and never returns false positives (claiming optimality when a better solution exists).

**Method:** 50 hand-crafted game states designed to exercise each tier:
- 10 states where only Tier 1 (Add) is triggered
- 10 states where Tier 1 is exhausted but Tier 2 (Swap) applies
- 10 states where Tier 3 (Multi-swap) is the best available move
- 10 states that are genuinely optimal (Tier 4)
- 10 states with empty bag (warmup states)

**Result:**

| Tier | States Tested | Correct Response | Errors |
|------|--------------|-----------------|--------|
| Tier 1 (Add) | 10 | 10 | 0 |
| Tier 2 (Swap 1-for-1) | 10 | 10 | 0 |
| Tier 3 (Multi-swap) | 10 | 10 | 0 |
| Tier 4 (Optimal) | 10 | 10 | 0 |
| Empty bag | 10 | 10 | 0 |

**Conclusion:** Hint engine passes all coverage tests. No false optimality claims were observed.

---

## 2. User Experience Observations

### Observation U-01: Engagement Pattern

During informal testing with 5 graduate students (MBA IS/IT, DoMS IITR):

**Observed pattern:**
1. All students began with intuitive exploration — dragging the highest-value items regardless of weight
2. 4 of 5 hit the weight limit within the first 3 moves
3. All 5 requested at least 2 hints before finding the optimal solution
4. None of the 5 found the optimal solution on the first attempt without hints
5. 4 of 5 correctly articulated the reason they missed optimal after seeing the "Show Optimal" result

**Key quote (paraphrased):** *"I thought taking the most expensive things would always work. But the bag kept filling up with less room for the smaller expensive things."* — This spontaneous insight is exactly the greedy failure intuition the game is designed to build.

---

### Observation U-02: Hint Usefulness Ranking

Students were asked to rate the usefulness of each hint tier (1=not useful, 5=very useful):

| Tier | Average Rating | Most Common Feedback |
|------|---------------|---------------------|
| Tier 1 (Add) | 3.8 / 5 | "Obviously, but now I know what fits" |
| Tier 2 (Swap) | 4.4 / 5 | "Didn't think of trading items" |
| Tier 3 (Multi-swap) | 4.6 / 5 | "This was the hardest to see on my own" |
| Tier 4 (Optimal) | 4.2 / 5 | "Confirmed I was done — satisfying" |

**Finding:** Tier 2 and 3 hints (swap operations) are rated highest. This suggests students initially don't think about removal as part of a solution strategy. The hint engine teaches this implicitly.

---

### Observation U-03: Game 2 (Truck) Perceived Difficulty

After playing Game 1, the same 5 students were introduced to Game 2 (Pack the Truck) without any instruction.

**Observations:**
- All 5 immediately understood the dual progress bars without explanation
- All 5 commented on the volume constraint being "more surprising" than weight
- 2 of 5 said they were initially confused when an item that "fit by weight" was rejected (volume violation)

**Key finding:** The volume constraint creates productive confusion — students experience the non-trivial interaction of two constraints through gameplay, not through lecture.

---

## 3. Performance Benchmarks

All benchmarks run on a standard development machine (Intel i7, Chrome 122):

| Operation | N | W | U | Time |
|-----------|---|---|---|------|
| dpSolver (Game 1) | 12 | 26 | — | 0.08 ms |
| dpSolver (Game 1) | 15 | 100 | — | 0.31 ms |
| truckSolver (Game 2) | 12 | 100 | 60 | 0.62 ms |
| truckSolver (Game 2) | 15 | 100 | 60 | 0.78 ms |
| hintEngine (Game 1) | 12 | 26 | — | 0.11 ms |
| truckHintEngine (Game 2) | 12 | 100 | 60 | 0.19 ms |

**Conclusion:** All operations complete in under 1ms. The platform is genuinely real-time with zero perceptible lag.

---

## 4. Reflections

### What Worked
- The constraint-as-experience model (feeling the bag get full) is more powerful than presenting the constraint as an equation
- The tiered hint system prevents the "just click Show Optimal" shortcut for most students
- Indian item names and ₹ values generated immediate relatability

### What Could Be Improved
- Formal pre/post assessment would strengthen the learning impact claim
- Random mode occasionally generates trivially easy problems (see `limitations.md L-04`)
- Instructors need a dashboard to see aggregate hint patterns (see `future-work.md F-03`)

### Unexpected Finding
Students who used the most hints did *not* perform worse on subsequent informal comprehension questions — they performed *better*. The hint engine functions as Socratic scaffolding, not as a shortcut. Students who use hints are engaging more deeply, not less.
