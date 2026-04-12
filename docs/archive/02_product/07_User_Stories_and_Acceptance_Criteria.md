# 07 — User Stories & Acceptance Criteria

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 07 of 11 · User Stories & Acceptance Criteria
> **Cross-references:** [01 PRD](./01_PRD.md) · [06 Personas](./06_User_Personas_and_Journey.md) · [03 Iterative Dev Plan](../04_delivery/03_Iterative_Development_Plan.md)

---

Each story follows: *"As a [persona], I want to [action], so that [benefit]."*
Acceptance Criteria (AC) are the contract the AI agent must satisfy before marking a feature "done."
Persona references: **Priya** (student), **Dr. Mehra** (professor), **Arjun** (professional) — see [06 Personas](./06_User_Personas_and_Journey.md).

---

## Epic 1: Platform Hub

### US-1.1: View Available Games
**As** Arjun, **I want to** see a landing page listing all available OR games, **so that** I can quickly choose which game to play.

**Phase:** 1 · **Route:** `/`

**Acceptance Criteria:**
- [ ] Landing page loads in under 2 seconds.
- [ ] At least one game card ("Pack That Bag!") is visible with title, tagline, and emoji icon.
- [ ] Clicking on a game card navigates to `/pack-that-bag/config`.
- [ ] One or more "Coming Soon" cards are displayed but non-interactive (greyed out).
- [ ] Page is fully responsive (desktop, tablet, mobile).
- [ ] Aesthetic matches [05 Design System](./05_UI_UX_Design_System.md) — dark glassmorphic theme, Inter font.

---

## Epic 2: Game Configuration

### US-2.1: Choose Classic Mode
**As** Priya, **I want to** start a game with the original 12 items from the OR textbook problem, **so that** I can practice the exact problem discussed in class.

**Phase:** 3 · **Route:** `/pack-that-bag/config`

**Acceptance Criteria:**
- [ ] "Classic Mode" is the default selected option.
- [ ] Selecting Classic Mode loads 12 items with names, weights, and values matching the PDF.
- [ ] Capacity is set to 26 lbs.
- [ ] `dpSolver` computes `optimalValue = 1166` on game start.

### US-2.2: Choose Random Mode
**As** Arjun, **I want to** generate a randomized problem, **so that** I can replay with variety.

**Phase:** 3 · **Route:** `/pack-that-bag/config`

**Acceptance Criteria:**
- [ ] Random Mode generates 8–15 items with random names, weights (1–10 lbs), values ($50–$500).
- [ ] Capacity is set to 40–70% of total item weight (ensures constrained but solvable problem).
- [ ] Each generation produces a different problem.

### US-2.3: Choose Custom Mode
**As** Dr. Mehra, **I want to** define my own items and bag capacity, **so that** I can create specific problem instances for my students.

**Phase:** 3 · **Route:** `/pack-that-bag/config`

**Acceptance Criteria:**
- [ ] User can add items with name, weight (positive integer), and value (positive integer) fields.
- [ ] User can set a custom bag capacity (positive integer).
- [ ] Minimum 2 items, maximum 20 items enforced.
- [ ] "Start Game" button is disabled until at least 2 valid items and a valid capacity are entered.
- [ ] Validation errors shown inline.

---

## Epic 3: Core Gameplay

### US-3.1: Drag Items into the Bag
**As** Priya, **I want to** drag item cards from the Inventory Zone into the Bag Zone, **so that** I can build my solution visually.

**Phase:** 4 · **Route:** `/pack-that-bag/play`

**Acceptance Criteria:**
- [ ] All items displayed in an Inventory Zone with name, value ($), and weight (lbs).
- [ ] Items can be dragged from Inventory to Bag Zone.
- [ ] Items can be dragged back from Bag to Inventory (undo a choice).
- [ ] Drag interaction has visual feedback: lift (scale 1.05×), shadow, dropzone glow on hover.
- [ ] Uses `@dnd-kit` with both pointer and touch sensors.

### US-3.2: Real-time Weight & Value Feedback
**As** Priya, **I want to** see the current total weight and value update in real-time, **so that** I always know where I stand.

**Phase:** 4 · **Route:** `/pack-that-bag/play`

**Acceptance Criteria:**
- [ ] A weight progress bar shows `currentWeight / capacity` and updates on every drop/removal.
- [ ] A value counter displays current total dollar value.
- [ ] If adding an item would exceed capacity, the item bounces back with a red flash. The item is NOT added.

### US-3.3: Item Visual Proportionality
**As** Arjun, **I want** item cards to be visually proportional to their weight, **so that** I can intuitively gauge which items are heavier.

**Phase:** 4 · **Route:** `/pack-that-bag/play`

**Acceptance Criteria:**
- [ ] Card width is scaled proportionally to weight using the formula in [05 Design System](./05_UI_UX_Design_System.md) §6.
- [ ] A 7-lb item is visually ~2.3× wider than a 3-lb item.

---

## Epic 4: Hint Engine

### US-4.1: Request a Hint
**As** Priya, **I want to** click a "💡 Hint" button and receive exactly one suggestion to improve my current solution, **so that** I learn incrementally without being given the full answer.

**Phase:** 5 · **Route:** `/pack-that-bag/play`

**Acceptance Criteria:**
- [ ] A "💡 Hint" button is always visible during gameplay.
- [ ] Clicking it displays a `HintToast` with a specific, actionable instruction.
- [ ] Hint types follow the tiered logic in [04 Algorithms & Logic](./04_Algorithms_and_Logic.md) §2.
- [ ] The suggested action strictly improves total value without exceeding capacity.
- [ ] If already optimal: *"Your solution is already optimal! 🎉"*
- [ ] Toast auto-dismisses after 5 seconds or on next user interaction.

---

## Epic 5: Victory Condition

### US-5.1: Detect & Celebrate Optimal Solution
**As** Priya, **I want** the game to automatically recognize when I've found the optimal solution, **so that** I feel accomplished.

**Phase:** 5 · **Route:** `/pack-that-bag/play` (overlay)

**Acceptance Criteria:**
- [ ] `dpSolver` computes optimal value silently on game start.
- [ ] When `currentValue === optimalValue`, `VictoryModal` appears within 500ms.
- [ ] Modal includes: confetti animation, "🎉 Optimal Solution Found!", total value and weight, "Play Again" button.
- [ ] "Play Again" navigates to `/pack-that-bag/config`.
- [ ] Victory checks value only, not the specific item set (multiple optimal sets are valid).

---

## Epic 6: Post-Game Learning

### US-6.1: Educational Summary
**As** Priya, **I want** a brief explanation of *why* my solution is optimal, **so that** I understand the underlying OR concept.

**Phase:** 5 · **Route:** `/pack-that-bag/play` (within Victory Modal)

**Acceptance Criteria:**
- [ ] An expandable "How does this work?" section is available in the Victory Modal.
- [ ] It briefly explains the 0/1 Knapsack problem and why greedy heuristics can fail.
- [ ] Text is concise (under 200 words), plain language, no jargon.
