# FAQ — Anticipated Viva Questions

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> *Prepare for rapid-fire oral examination using this document. Each answer is written to be spoken, not read.*

---

## Operations Research & Theory

**Q: What is the Knapsack Problem?**

The 0/1 Knapsack Problem asks: given a set of items each with a weight and a value, and a bag with a maximum weight capacity, which items should you select to maximize total value? The "0/1" means each item is either fully included or excluded — no fractions. It is a fundamental problem in combinatorial optimization and appears in resource allocation, capital budgeting, and logistics.

---

**Q: Why is the Knapsack Problem NP-hard?**

The Knapsack Problem is NP-hard in the strong sense when item weights are arbitrary. This means no known polynomial-time algorithm solves all instances. However, it is *pseudo-polynomial* — the DP algorithm solves it in O(N × W) time, which is polynomial in N and W but exponential in the *number of bits* needed to represent W. For our game, N ≤ 15 and W ≤ 100, making DP trivially efficient.

---

**Q: Why doesn't greedy work here?**

Greedy for fractional knapsack works: take items in decreasing value-to-weight order, splitting the last item if needed. But for the 0/1 variant, items cannot be split. A greedy selection may use up capacity inefficiently, preventing the inclusion of a combination of smaller items that would have yielded more total value. See `docs/01_theory_and_design/03-algorithms.md §1.2` for our specific counter-example (₹1,138 greedy vs. ₹1,166 DP optimal).

---

**Q: What is Dynamic Programming?**

Dynamic Programming is an optimization technique for problems with *optimal substructure* and *overlapping subproblems*. Instead of re-solving the same subproblem multiple times (as in naive recursion), DP memoizes results in a table. For knapsack, `DP[i][w]` stores the optimal value achievable with items 1..i and weight capacity w — computed from previously stored cells in O(1) per cell.

---

**Q: What is the time complexity of your solver?**

Game 1 (2D DP): **O(N × W)** — N = items, W = weight capacity. For N=12, W=26: 312 operations.
Game 2 (3D DP): **O(N × W × U)** — U = volume capacity. For N=12, W=100, U=60: 72,000 operations.
Both run in under 1 millisecond in any modern browser.

---

**Q: What is the Multi-Dimensional Knapsack Problem?**

The MDKP generalizes the standard knapsack by adding multiple independent capacities (dimensions). Each item consumes some amount of each resource, and each resource has a separate limit. With 2 dimensions (weight + volume), the problem remains NP-hard and the DP table takes on a third dimension. Real applications include loading containers with weight and volume limits, or allocating capital across multiple budget periods.

---

**Q: How does your hint engine work?**

It uses a 4-tier neighborhood search strategy. Tier 1 suggests adding an item (insertion); Tier 2 suggests a 1-for-1 swap; Tier 3 suggests a 2-opt move (1-for-2 or 2-for-1 items); Tier 4 confirms optimality. Each tier is evaluated in sequence, and the first valid strictly-improving move is returned. This mirrors manual local search in combinatorial optimization.

---

**Q: Is your solution always optimal?**

Yes. The DP solver finds an exact global optimum for the given problem instance. There may be multiple optimal solutions (different item sets achieving the same maximum value) — the solver returns one of them via deterministic traceback.

---

## Design & Pedagogy

**Q: Why gamification? Is there any evidence it works?**

Research by Freeman et al. (2014) shows active learning produces 1.5× better retention than passive lecture. Gamification operationalizes active learning through goal clarity, immediate feedback, and safe failure. For OR specifically, the structural alignment between game mechanics (constraints, objectives, decisions) and OR formulations makes gamification unusually natural — not cosmetic.

---

**Q: Couldn't students just click "Show Optimal" and not learn anything?**

They could. But the hint system is pedagogically sequenced to delay that option. Students must first try independently, then request hints (which don't give the solution), then finally use "Show Optimal" as a last resort. When they do use it, the Victory Modal is explicitly marked "🤖 Auto-Solved" — there is no reward or praise. The intent is that by the time a student clicks Show Optimal, they have already developed enough context to learn *why* the algorithm made different choices than they did.

---

**Q: Why Indian items? Why ₹?**

Cultural relevance drives engagement. Students presented with items from their lived experience (Mixer Grinder, Cricket Kit, Alphonso Mangoes) engage more immediately than with abstract or foreign items. Using ₹ values grounds the optimization problem in economic reality that Indian MBA students understand viscerally.

---

**Q: How does this relate to real business problems?**

Directly. The knapsack problem maps to: capital budgeting (projects = items, budget = capacity, NPV = value), portfolio selection, project selection under resource constraints, and cargo loading in logistics. The truck game maps the latter explicitly. An MBA student who has played these games will immediately recognize the formulation structure when they encounter it in practice.

---

## Technical

**Q: Why React and not a simpler tool?**

The drag-and-drop interaction requires complex state management (which item is active, where it's being dropped, whether constraints are violated, when victory is reached). Vanilla JS would work but be harder to maintain. React's component model and @dnd-kit's accessibility-first DnD library make the implementation clean, testable, and extensible. See `docs/02_engineering/03-decisions.md D-04` for full rationale.

---

**Q: Is there a backend?**

No. All algorithms run client-side in JavaScript. The DP solver, hint engine, and game state are entirely self-contained in the browser. This means the game works offline once loaded, has zero latency for feedback, and requires no server infrastructure.

---

**Q: How does the drag-and-drop know when an item doesn't fit?**

When an item is dropped onto the bag/truck zone, the `useKnapsackDnD` hook calls a `canAdd(item)` predicate before dispatching the state update. If `canAdd` returns false, the drop is rejected and a brief red flash animation is triggered — the visual representation of a constraint violation. The item returns to its original position.

---

**Q: How scalable is this?**

For pedagogical use with N ≤ 20 items and W ≤ 500, the current implementation is entirely adequate. For industrial-scale knapsack (N = 1,000+, W = 100,000+), a DP approach would require significant memory and computation — those cases would use approximate methods (FPTAS, SA, genetic algorithms). The platform is intentionally scoped to problems where exact solutions are computationally trivial, so students can see and verify the optimum.

---

**Q: What makes OptiPlay different from other OR tools?**

Most OR tools are either (a) solver black boxes (CPLEX, Gurobi — no visibility into the algorithm) or (b) notation-heavy textbooks (no interactivity). OptiPlay sits in between: the solver is exact and transparent, the interaction is physical and immediate, and the progression from intuition to algorithm is built into the game design. There is no requirement to install software, no license fee, and no prerequisite knowledge.
