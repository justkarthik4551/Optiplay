# 01 — Product Requirements Document (PRD)

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 01 of 11 · Product Requirements Document
> **Cross-references:** [00 Project Charter](../01_strategy/00_Project_Charter.md) · [06 Personas & Journey](./06_User_Personas_and_Journey.md) · [07 User Stories](./07_User_Stories_and_Acceptance_Criteria.md)

---

## 1. Product Vision

OptiPlay is a free, browser-based platform that transforms classical Operations Research problems into visually stunning, interactive games. Users learn optimization concepts through play — not proofs.

## 2. Target Audience

| Persona | Role | Primary Need |
|---------|------|--------------|
| **Priya** (The MBA Student) | First-year MBA, IS/IT specialization | Understand OR intuitively before exams |
| **Dr. Mehra** (The Professor) | Faculty teaching Operations Management | Zero-setup classroom demo + homework tool |
| **Arjun** (The Curious Professional) | Analytics consultant | Quick, game-like exploration of optimization |

> Full persona profiles: [06 User Personas & Journey](./06_User_Personas_and_Journey.md)

## 3. Scope of Initial Release

**Game:** "Pack That Bag!" (The 0/1 Knapsack Problem)
**Problem Statement:** Given a set of items (each with a weight and dollar value) and a bag with a fixed weight capacity, select items to maximize total value without exceeding capacity.

## 4. Functional Requirements

### FR-1: Platform Hub
The landing page lists all available OR games. The MVP includes one playable game ("Pack That Bag!") and one or more "Coming Soon" placeholders.

### FR-2: Game Configuration (Three Modes)
| Mode | Description | Default Items | Capacity |
|------|-------------|---------------|----------|
| **Classic** | The original 12 items from Prof. Yunes' PDF. Default mode. | 12 items (fixed) | 26 lbs |
| **Random** | System generates 8–15 items with random names, weights (1–10 lbs), and values ($50–$500). Capacity = 40–70% of total weight. | Random | Random |
| **Custom** | User defines items (name, weight, value) and capacity. Min 2, max 20 items. | User-defined | User-defined |

### FR-3: Interactive Gameplay (Drag & Drop)
- Items displayed as visual cards in an **Inventory Zone**, proportional in width to their weight.
- Users drag items from Inventory into a **Bag Zone**.
- Items can be dragged back out (undo).
- If a drop would exceed capacity, the item bounces back with a red warning flash.

### FR-4: Real-Time Feedback
- **Weight Bar:** Progress bar showing `currentWeight / capacity`. Updates on every drop/removal.
- **Value Counter:** Displays current total dollar value.

### FR-5: Hint Engine (The "Tutor")
- A "💡 Hint" button is always visible during gameplay.
- Clicking it provides exactly **one** actionable suggestion that strictly improves the current value without exceeding capacity.
- If the current solution is already optimal, the hint confirms: *"Your solution is already optimal! 🎉"*
- Hint logic is tiered: Add → Swap 1-for-1 → Swap 1-for-2 / 2-for-1.

> Full algorithm spec: [04 Algorithms & Logic](./04_Algorithms_and_Logic.md)

### FR-6: Victory Condition
- The DP solver computes the optimal value silently on game start.
- When `userValue === optimalValue`, a congratulatory modal appears with confetti animation.
- The modal displays the total value and weight, and offers "Play Again" and "How does this work?" options.

### FR-7: Post-Game Educational Summary
- An expandable section (accessible from the victory modal) briefly explains the 0/1 Knapsack problem and why greedy heuristics can fail.
- Concise (under 200 words), plain language, no jargon.

## 5. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| **Performance** | Hint Engine + DP solver < 50 ms. Landing page loads < 2 seconds. |
| **Aesthetics** | Premium dark glassmorphic design. Micro-animations on all interactions. Font: Inter. See [05 Design System](./05_UI_UX_Design_System.md). |
| **Responsiveness** | Desktop, tablet, and mobile. Touch DnD via `@dnd-kit` sensors. |
| **Accessibility** | Keyboard-navigable drag-and-drop (provided by `@dnd-kit`). |
| **Browser Support** | Modern evergreen browsers (Chrome, Firefox, Safari, Edge). |
