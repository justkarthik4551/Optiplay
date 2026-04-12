# 03 — Iterative Development Plan

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 03 of 11 · Iterative Development Plan
> **Cross-references:** [11 Project Timeline](./11_Project_Timeline.md) · [02 System Architecture](../03_engineering/02_System_Architecture.md) · [07 User Stories](../02_product/07_User_Stories_and_Acceptance_Criteria.md)

---

## Guiding Principle

AI agents produce the highest-quality output when complex systems are broken into small, strictly verified, linear steps. **Do not attempt to build the entire platform in one shot.** Each phase below must pass its verification gate before the next phase begins.

---

## Phase 1: Foundation & Design System ("The Vibe")

**Goal:** Establish the project skeleton and ensure it looks stunning before any game logic is added.

**Tasks:**
1. Initialize React + Vite project (`npx -y create-vite@latest ./`).
2. Install dependencies: `@dnd-kit/core`, `@dnd-kit/sortable`, `react-router-dom`.
3. Create the folder structure defined in [02 System Architecture](./02_System_Architecture.md).
4. Implement `variables.css`, `theme.css`, and `animations.css` per [05 Design System](./05_UI_UX_Design_System.md).
5. Build the Hub landing page (`Hub.jsx`) with Navbar, Hero section, and game card grid.

**Verification:**
- [ ] `npm run dev` serves the app without errors.
- [ ] Landing page renders with the dark glassmorphic aesthetic. User confirms "wow factor."
- [ ] Covers: **US-1.1** (View Available Games).

---

## Phase 2: OR Algorithms ("The Brain")

**Goal:** Implement and verify pure algorithmic logic, completely independent of the UI.

**Tasks:**
1. Implement `dpSolver.js` — given `items[]`, `capacity`, returns `{ optimalValue, optimalSet[] }`.
2. Implement `hintEngine.js` — given `items[]` (with `inBag` flags), `capacity`, returns `{ type, message }`.
3. Create `classicItems.js` — the 12 items from the PDF with correct names, weights, and values.
4. Write console-based verification tests.

**Verification:**
- [ ] `dpSolver` returns **$1,166** for the classic 12-item, 26-lb problem.
- [ ] `dpSolver` returns the correct 7-item optimal set: Camera, Painting, Tablet, Wine, Projector, PlayStation, Keurig.
- [ ] `hintEngine` returns valid Tier 1 (Add) hints when capacity has room.
- [ ] `hintEngine` returns valid Tier 2 (Swap) hints when bag is full but suboptimal.
- [ ] `hintEngine` returns "already optimal" when the user has the optimal set.
- [ ] Covers algorithm foundation for: **US-4.1**, **US-5.1**.

---

## Phase 3: Game Configuration & State Management

**Goal:** Build the data backbone — mode selection UI and shared game state.

**Tasks:**
1. Implement `GameContext.jsx` with the state shape defined in [02 System Architecture](./02_System_Architecture.md).
2. Build `GameConfig.jsx` — three mode cards (Classic / Random / Custom) + "Start Game" button.
3. Implement Classic Mode: loads `classicItems.js` data, sets capacity to 26.
4. Implement Random Mode: generates 8–15 items with random attributes and constrained capacity.
5. Implement Custom Mode: input form for items (name, weight, value) + capacity. Min 2, max 20 items.
6. On "Start Game," run `dpSolver` to pre-compute `optimalValue`, then navigate to `/pack-that-bag/play`.

**Verification:**
- [ ] All three modes produce a valid game state (items array + capacity + optimalValue).
- [ ] Custom Mode validates inputs (positive integers, min 2 items, max 20 items).
- [ ] Covers: **US-2.1**, **US-2.2**, **US-2.3**.

---

## Phase 4: Core Interactive UI (Drag & Drop)

**Goal:** Build the tactile gameplay experience.

**Tasks:**
1. Implement `ItemCard` component — width proportional to weight, displays name/value/weight.
2. Implement `InventoryZone` and `BagZone` as `@dnd-kit` droppable containers.
3. Wire drag-and-drop: items move between Inventory ↔ Bag by toggling `inBag` in `GameContext`.
4. Implement capacity enforcement: if a drop would exceed capacity, bounce item back with red flash.
5. Implement `ProgressBar` component for weight (`currentWeight / capacity`).
6. Implement value counter display.
7. Add `🔄 Reset` button to return all items to Inventory.

**Verification:**
- [ ] Items drag between zones with tactile visual feedback (lift, shadow, snap).
- [ ] Capacity-exceeding drops are rejected with animation.
- [ ] Weight bar and value counter update in real-time.
- [ ] Reset returns all items to Inventory and resets counters.
- [ ] Covers: **US-3.1**, **US-3.2**, **US-3.3**.

---

## Phase 5: Polish & Integration

**Goal:** Wire the Brain to the UI, add victory/hint flows, and polish micro-animations.

**Tasks:**
1. Wire "💡 Hint" button to `hintEngine.js` → render result in `HintToast` component (auto-dismiss 5s).
2. Wire victory detection: when `currentValue === optimalValue`, trigger `VictoryModal` with confetti.
3. Build `VictoryModal` — displays stats, "Play Again" (→ config), "How does this work?" (→ educational text).
4. Build post-game educational summary (expandable section in VictoryModal).
5. Final micro-animation pass: hover glows, drag shadows, transition curves per [05 Design System](./05_UI_UX_Design_System.md).
6. End-to-end playtest across all three modes.

**Verification:**
- [ ] Hint always suggests a strictly improving move or confirms optimality.
- [ ] Victory modal fires exactly when optimal value is reached.
- [ ] "Play Again" navigates back to config. "How does this work?" shows educational text.
- [ ] Full flow is seamless: Hub → Config → Play → Hint → Victory → Play Again.
- [ ] Covers: **US-4.1**, **US-5.1**, **US-6.1**.
