# Build Walkthrough

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** Build Walkthrough · Post-Development Summary
> **Cross-references:** [03 Dev Plan](./03_Iterative_Development_Plan.md) · [Sprint Backlog](./Sprint_Backlog.md)

---

## Overview

This document is a post-build summary of what was implemented, how it was verified, and where each component lives in the codebase. It serves as the bridge between the pre-development specifications (Strategy, Product, Engineering docs) and the actual delivered software.

---

## Phase-by-Phase Summary

### Phase 1: Foundation & Design System
**Goal:** Initialize the project and establish the premium visual identity.

| Deliverable | Status |
|-------------|--------|
| React 18 + Vite project (`optiplay/`) | ✅ |
| CSS design tokens (`variables.css`) | ✅ |
| Dark glassmorphic theme (`theme.css`) | ✅ |
| Cosmic void background (CSS starfield, vignette, orbs) | ✅ |
| Hub landing page with IIT Roorkee branding | ✅ |
| Navbar with institutional logo | ✅ |

---

### Phase 2: OR Algorithms ("The Brain")
**Goal:** Implement and verify the core algorithmic logic independently of the UI.

| Deliverable | File | Status |
|-------------|------|--------|
| Bottom-up DP solver with traceback | `src/utils/dpSolver.js` | ✅ |
| 4-tier hint engine (Add → Swap 1:1 → Swap 1:2/2:1 → Optimal) | `src/utils/hintEngine.js` | ✅ |
| 12-item classic dataset | `src/utils/classicItems.js` | ✅ |
| Verification test suite | `src/utils/testAlgorithms.mjs` | ✅ 17/17 passed |

**Key Verification:** Classic mode optimal = **$1,166** (7 items, 26 lbs exactly).

---

### Phase 3: Game Configuration & State Management
**Goal:** Build the mode selector, state management, and data pipeline.

| Deliverable | File | Status |
|-------------|------|--------|
| Game state context (useReducer + useMemo) | `src/context/GameContext.jsx` | ✅ |
| Config page — 3 modes with inline validation | `src/pages/GameConfig.jsx` | ✅ |
| Random item generator (8–15 items, constrained capacity) | Integrated in `GameConfig.jsx` | ✅ |

---

### Phase 4: Core Interactive UI (Drag & Drop)
**Goal:** Build the two-zone game board with `@dnd-kit`.

| Deliverable | File | Status |
|-------------|------|--------|
| Proportional-width item cards | `src/components/game/ItemCard.jsx` | ✅ |
| Draggable wrapper | `src/components/game/DraggableItem.jsx` | ✅ |
| Droppable zone (Inventory / Bag) | `src/components/game/DroppableZone.jsx` | ✅ |
| Weight progress bar (green/yellow/red) | `src/components/common/ProgressBar.jsx` | ✅ |
| Capacity enforcement (red flash) | `PackThatBag.jsx` logic | ✅ |

---

### Phase 5: Polish & Integration
**Goal:** Wire the brain to the UI and add celebratory polish.

| Deliverable | File | Status |
|-------------|------|--------|
| 💡 Hint button + tiered hint toast | `src/components/game/HintToast.jsx` | ✅ |
| Victory modal (confetti, star rating, DP insight) | `src/components/game/VictoryModal.jsx` | ✅ |
| Hints-used counter in stats bar | `PackThatBag.jsx` | ✅ |
| Educational DP explanation in victory card | `VictoryModal.jsx` | ✅ |

---

## Verification Summary

| Test Type | Details | Result |
|-----------|---------|--------|
| **Algorithm (Console)** | dpSolver: optimal value, traceback, edge cases; hintEngine: all 4 tiers | **17/17 passed** |
| **Browser (Visual)** | Hub → Config → Game → Drag Items → Hint Toast → Victory detection | **Verified** |
| **Design Review** | Dark void background, glassmorphic cards, IIT Roorkee branding | **Approved** |

---

## File Map

```
optiplay/
├── index.html
├── src/
│   ├── App.jsx                          # Router + GameProvider
│   ├── main.jsx                         # Entry point
│   ├── styles/
│   │   ├── variables.css                # Design tokens
│   │   └── theme.css                    # Global styles + void background
│   ├── context/
│   │   └── GameContext.jsx              # Shared game state
│   ├── utils/
│   │   ├── classicItems.js              # 12-item dataset
│   │   ├── dpSolver.js                  # DP algorithm
│   │   ├── hintEngine.js                # Tiered coaching
│   │   └── testAlgorithms.mjs           # Verification tests
│   ├── pages/
│   │   ├── Hub.jsx / Hub.css            # Landing page
│   │   ├── GameConfig.jsx / .css        # Mode selector
│   │   └── PackThatBag.jsx / .css       # Main game board
│   └── components/
│       ├── layout/
│       │   └── Navbar.jsx / .css        # Top nav + IITR logo
│       ├── game/
│       │   ├── ItemCard.jsx / .css       # Draggable item
│       │   ├── DraggableItem.jsx         # @dnd-kit wrapper
│       │   ├── DroppableZone.jsx / .css  # Drop target
│       │   ├── HintToast.jsx / .css      # Hint notification
│       │   └── VictoryModal.jsx / .css   # Win celebration
│       └── common/
│           └── ProgressBar.jsx / .css    # Weight gauge
```
