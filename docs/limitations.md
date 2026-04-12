# Limitations

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> *Honest scope boundaries. Examiners appreciate self-awareness. Explaining limitations demonstrates mastery.*

---

## L-01: Problem Scale Is Restricted by Design

**Limitation:** The platform works best with small problem instances (N ≤ 20 items, W ≤ 500).

**Why it exists:** The DP solver's time complexity is O(N × W) for Game 1 and O(N × W × U) for Game 2. For large N and W, the DP table grows prohibitively. A 3D table with N=50, W=10,000, U=5,000 would require 2.5 billion cells — far exceeding browser memory.

**Why it's acceptable for this project:** OptiPlay is a pedagogical tool, not an industrial solver. Students learning the knapsack concept need small, manageable problem instances where they can reason about each item individually. A problem with 200 items would be cognitively overwhelming regardless of the solver's capability.

**What we would do differently at scale:** Use a Fully Polynomial-Time Approximation Scheme (FPTAS) for large instances, or switch to a metaheuristic (Simulated Annealing, Tabu Search) with a configurable approximation guarantee.

---

## L-02: No Backend or Persistence

**Limitation:** Game state is not saved. Refreshing the page resets progress. There is no user account system, no history of past attempts, and no way to compare performance across students.

**Why it exists:** The project was intentionally scoped to a client-side architecture for simplicity, cost, and pedagogical transparency. A backend would require authentication, a database, and server infrastructure — all out of scope for a semester-long MBA project.

**Impact:** Students cannot resume a game session. Instructors cannot track student progress analytically.

**Future resolution:** A lightweight backend (e.g., Firebase Firestore) could persist game sessions under student IDs, enabling cohort-level analytics on hint usage, time-to-optimal, and game mode preferences.

---

## L-03: Hint Engine Uses Local Search (Not Optimal Guidance)

**Limitation:** The hint engine may not always guide toward the mathematically optimal solution through the most efficient path. It provides locally improving moves, not globally guided search.

**Example:** In some configurations, the optimal path requires temporarily *reducing* value (removing a high-value item to make room for two that yield more). The hint engine will not suggest a value-reducing move — it only suggests strict improvements from the current state.

**Why it's acceptable:** For pedagogical purposes, any locally improving move teaches the right lesson. Students who follow hints iteratively will converge on an optimal or near-optimal solution. The "Show Optimal" escape hatch exists for cases where hints cannot bridge the gap.

---

## L-04: Random Mode Has No Guarantee of Interesting Problems

**Limitation:** The random item generator produces valid knapsack instances, but does not guarantee the instance is "interesting" — there is no check that the greedy solution is sub-optimal, or that the problem has a meaningful tradeoff structure.

**Impact:** Occasionally, a randomly generated problem may be trivially easy (one obvious set of items fits perfectly) or trivially hard (almost nothing fits). These instances are less pedagogically valuable.

**Future resolution:** Add a "problem quality filter" that runs greedy and DP on the generated instance and regenerates if the gap is below a threshold (e.g., if DP optimal is less than 5% above greedy optimal, regenerate).

---

## L-05: No Formal Validated Learning Outcomes

**Limitation:** The claim that this platform improves OR understanding is not backed by controlled experimental data. No before-after assessment was conducted with a statistically significant student sample.

**Why it exists:** Conducting a proper educational trial is beyond the scope of a single-semester project and requires IRB approval, a control group, validated assessment instruments, and longitudinal follow-up.

**Current evidence:** The platform's design is grounded in established learning science principles (active learning, immediate feedback, concrete-before-abstract). See `docs/problem-definition.md §3` for the literature base.

**Future resolution:** Partner with DoMS faculty to integrate OptiPlay into the OR curriculum and measure pre/post comprehension on knapsack-related assessment questions.

---

## L-06: Mobile Experience Is Functional but Not Optimized

**Limitation:** The game is usable on mobile devices (touch sensors are configured), but the card layout and zone sizes were designed for desktop. On small screens (< 400px), item cards may overflow or feel cramped.

**Impact:** Students using phones as their primary device will have a degraded experience.

**Partial mitigation already in place:** The navbar uses a responsive seal-only logo on mobile; grid layouts collapse to single-column; touch sensors support drag-and-drop on touchscreens.

---

## L-07: Only Two Games Available

**Limitation:** The platform currently contains two games (Pack That Bag, Pack the Truck). The original vision included additional OR problem types (TSP, scheduling, assignment problems).

**Why:** Each game requires significant design, algorithm implementation, UX work, and testing. The two implemented games represent the knapsack family in depth rather than the full breadth of OR.

**The architecture supports expansion:** The shared `useKnapsackDnD` hook, `DroppableZone`, `VictoryModal`, and `HintToast` components were designed for reuse. Adding a third game requires only a new solver, context, and play page.
