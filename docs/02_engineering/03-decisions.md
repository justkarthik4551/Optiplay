# 06 — Decision Log

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> **Cross-references:** [03 Algorithms](../01_theory_and_design/03-algorithms.md) · [04 System Architecture](./01-system-architecture.md) · [FAQ](../04_viva_prep/01-faq.md)
>
> *Every significant architectural and design decision, with rationale. This document is your "why" file.*

---

## D-01: Dynamic Programming over Greedy

**Decision:** Use exact bottom-up DP to solve the 0/1 Knapsack, not a greedy heuristic.

**Alternatives considered:**
- Greedy by value-to-weight ratio
- Branch & Bound
- Random local search

**Rationale:**

The entire pedagogical purpose of Game 1 is to *demonstrate* that greedy fails on this problem. If the solver itself used greedy, the "Show Optimal" button would sometimes show an incorrect answer, and the hint engine's "Tier 4: You're optimal" would be unreliable.

The game's educational claim depends on the solver being **exact**. DP is exact. Greedy is not.

Additionally, the DP table structure (O(N × W) entries) is inherently more explainable to an audience than a B&B tree. The Victory Modal's algorithm explanation references O(N × W) complexity — this needs to correspond to the actual implementation.

**Tradeoff accepted:** For Custom mode with very large N and W (e.g., N=20, W=1000), the DP table has 20,000 cells and may take a few milliseconds. This is acceptable. We cap W at 500 in custom mode to prevent perceptible lag.

---

## D-02: 3D DP over Branch & Bound for Game 2

**Decision:** Extend the DP approach to 3D (adding a volume dimension) rather than switching to Branch & Bound for the multi-constraint problem.

**Alternatives considered:**
- Branch & Bound with LP relaxation
- Simulated Annealing
- 3D DP

**Rationale:**

For our game bounds (N ≤ 15, W ≤ 100, U ≤ 60), the 3D DP table has at most 15 × 100 × 60 = 90,000 cells. This runs in under 1ms in any modern browser.

Branch & Bound would be algorithmically more interesting for large N, but:
1. Implementation complexity is significantly higher
2. The B&B search tree is hard to visualize or explain in 30 seconds
3. Worst-case performance is unpredictable (depends on bounding quality)

The 3D DP is the natural extension of 2D DP — it teaches students that adding a constraint just adds a dimension, at O(W × U) cost per item. This is exactly the lesson Game 2 should deliver.

---

## D-03: Client-Side Algorithms (No Backend)

**Decision:** Run all optimization algorithms in the browser via JavaScript. No backend API.

**Alternatives considered:**
- Python backend with PuLP / Gurobi
- Cloud function (serverless) calling an OR solver
- WebAssembly compiled from C++ solver

**Rationale:**

1. **Pedagogical transparency:** The solver code is in the project repository, in plain JavaScript, readable by anyone. There is no black-box API call.
2. **Zero latency:** Feedback is instant. For a game teaching optimization, a 200ms network round-trip would destroy the interaction loop.
3. **Zero infrastructure cost:** No server to manage, no API key to protect, no downtime risk. The game works offline once loaded.
4. **No backend complexity:** Authentication, rate limiting, database — none of this is relevant to teaching knapsack. It would be engineering for its own sake.

**For "isn't JavaScript too slow for optimization?":**
Our problem is tiny (N ≤ 15). The DP runs in microseconds. JavaScript is fast enough for problems 10,000× larger than ours.

---

## D-04: React + Vite over Vanilla JS or Power BI

**Decision:** Build as a React SPA with Vite, not as a Power BI dashboard or a plain HTML/CSS/JS page.

**Context:** Early in this project, Power BI was considered for visualization dashboards. It was rejected.

**Why not Power BI:**
- Power BI is a reporting tool, not an interactive game engine
- Drag-and-drop state management across custom visuals is painful
- No access to run custom JavaScript algorithms without premium licensing
- The game's DnD interaction is inherently imperative — Power BI's declarative model fights this

**Why React over Vanilla JS:**
- Component model maps naturally to the game's UI structure (item cards, drop zones, modals)
- React Context + useReducer provides predictable, testable state management
- @dnd-kit requires React (it's a React library)
- Component reuse (VictoryModal, HintToast, DroppableZone) is clean and explicit

**Why Vite over Create React App:**
- Vite's dev server starts in < 1 second (vs CRA's 10–30 seconds)
- Native ES modules — no bundling during development
- Vite is the current community standard for new React projects

---

## D-05: @dnd-kit over react-beautiful-dnd or HTML5 DnD API

**Decision:** Use `@dnd-kit/core` for drag-and-drop.

**Alternatives considered:**
- HTML5 native DnD API
- `react-beautiful-dnd`
- `react-dnd`

**Rationale:**

| Library | Issue |
|---------|-------|
| HTML5 DnD API | No touch support; no keyboard support; complex event model |
| react-beautiful-dnd | No longer actively maintained; performance issues |
| react-dnd | Complex provider model; overkill for our use case |
| @dnd-kit | Active; accessible (WCAG 2.1); pointer + touch + keyboard sensors; lightweight |

@dnd-kit's `DragOverlay` component is particularly useful — it renders a custom ghost element that follows the cursor, which looks far more polished than the browser's default DnD ghost.

---

## D-06: Vanilla CSS over Tailwind or a Component Library

**Decision:** Use Vanilla CSS 3 with Custom Properties (design tokens), not Tailwind CSS or a component library like MUI or Chakra.

**Rationale:**

1. **Full design control:** The game's glassmorphism aesthetic requires precise control over backdrop-filter, rgba, and gradient combinations. Tailwind's utility classes can approximate this, but override conflicts and JIT compilation add friction for unusual visual effects.
2. **Token-based theming:** CSS Custom Properties allow the entire design system to be changed by editing one file (`variables.css`). Tailwind achieves this through `tailwind.config.js`, but for our scale, pure CSS is simpler.
3. **No framework dependency:** A component library would impose its own design language. Our UI needs to feel like a game, not an admin panel.
4. **Educational clarity:** Any evaluator reading the CSS can directly see what every style does. There is no "look up what `p-4` means" step.

---

## D-07: Indian Localization for Item Names

**Decision:** Use Indian household products (e.g., Alphonso Mangoes, Cricket Kit, Mixer Grinder) rather than generic international items (e.g., "Computer", "Camera").

**Rationale:**

1. **Cultural relevance:** The target audience is Indian MBA students at IIT Roorkee. Items they recognize create immediate emotional engagement.
2. **Rupee currency:** Using ₹ instead of $ makes the value tradeoffs feel real and anchored to lived experience.
3. **Differentiation from the original paper:** The original "Pack That Bag!" game by Prof. Tallys Yunes used generic items. Our localization is a deliberate adaptation, not a copy.

---

## D-08: Separate Context for Each Game

**Decision:** `GameContext` (Game 1) and `TruckContext` (Game 2) are independent. Games do not share state.

**Alternative considered:** A single unified `AppContext` for all games.

**Rationale:**

A shared context would mean:
- A player finishing Game 1 and navigating to Game 2 carries over `hintsUsed`, `optimalValue`, etc.
- Every component in every game re-renders on every state change in any other game
- Adding Game 3 requires modifying shared state that Game 1 and Game 2 depend on

Scoped providers eliminate all of these problems. Each game is independently mounted and unmounted. The provider boundary is the component boundary.

**Analogy:** This is why microservices have separate databases. Shared state is shared risk.
