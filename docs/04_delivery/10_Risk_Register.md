# 10 — Risk Register & Mitigation Plan

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 10 of 11 · Risk Register & Mitigation Plan
> **Cross-references:** [03 Iterative Dev Plan](./03_Iterative_Development_Plan.md) · [04 Algorithms & Logic](../03_engineering/04_Algorithms_and_Logic.md) · [05 Design System](../02_product/05_UI_UX_Design_System.md)

---

## Risk Matrix

| ID | Risk | Category | Likelihood | Impact | Severity | Mitigation Strategy | Mitigated By |
|----|------|----------|------------|--------|----------|---------------------|--------------|
| R1 | AI Agent generates inconsistent UI across screens (colors, fonts, spacing drift) | Technical / Vibe Coding | High | Medium | 🟡 High | All visual properties defined as CSS variables in `variables.css`. AI must reference the design system doc before writing any CSS. Never hardcode colors or font sizes. | [05 Design System](./05_UI_UX_Design_System.md) |
| R2 | Hint Engine suggests invalid moves (exceeds capacity or doesn't improve value) | Algorithmic | Medium | High | 🟡 High | Unit test every hint tier (Add, Swap 1-for-1, Swap 1-for-2) against the classic 12-item problem. Verified optimal: **$1,166** at 26 lbs. Test hint paths from empty bag to optimal. | [04 Algorithms & Logic](./04_Algorithms_and_Logic.md) |
| R3 | Drag-and-drop breaks on mobile / touch devices | Technical / UX | High | Medium | 🟡 High | `@dnd-kit` has built-in `TouchSensor` and `KeyboardSensor` support. Test on Chrome DevTools mobile emulator during Phase 4. | [02 System Architecture](./02_System_Architecture.md) §1 |
| R4 | Scope creep: adding more games before "Pack That Bag!" is polished | Project Management | Medium | High | 🟡 High | [03 Iterative Dev Plan](./03_Iterative_Development_Plan.md) strictly mandates: no new games until Phase 5 is verified. Hub shows "Coming Soon" cards that are intentionally non-functional. | [03 Iterative Dev Plan](./03_Iterative_Development_Plan.md) |
| R5 | Performance lag on large custom item sets | Technical | Low | Medium | 🟢 Medium | DP solver is O(N×W). At max custom limits (N=20, W=200), that's 4,000 operations — trivial for browser JS. Custom Mode capped at 20 items. | [00 Project Charter](./00_Project_Charter.md) §4 |
| R6 | User confusion: not understanding the game objective | UX / Pedagogy | Medium | Medium | 🟢 Medium | Tagline on game card: *"Can you pack the most valuable bag?"* Persistent "Goal: Maximize Value within Weight Limit" banner on game screen. Clear onboarding text on Config screen. | [06 User Journey](./06_User_Personas_and_Journey.md) §2 |
| R7 | Multiple optimal solutions cause false negatives (user has optimal value but different item set) | Algorithmic | Medium | Low | 🟢 Medium | Victory condition checks `currentValue === optimalValue` only — NOT whether the specific item set matches. This is documented in [04 Algorithms & Logic](./04_Algorithms_and_Logic.md) §2 (Edge Cases). | [07 User Stories](./07_User_Stories_and_Acceptance_Criteria.md) US-5.1 |
| R8 | CSS glassmorphism (`backdrop-filter`) not supported on older browsers | Technical / Compatibility | Low | Low | 🟢 Low | `backdrop-filter` is supported in 95%+ of modern evergreen browsers. Provide a solid `rgba()` fallback without blur for edge cases. | [05 Design System](./05_UI_UX_Design_System.md) §2 |

## Severity Legend

| Icon | Level | Action |
|------|-------|--------|
| 🔴 | **Critical** | Blocks project delivery. Requires immediate action. |
| 🟡 | **High** | Significant impact. Must have mitigation plan before development begins. |
| 🟢 | **Medium / Low** | Manageable. Monitor during development. |

## Key Observation

The highest-severity risks (R1, R2, R3, R4) are all directly mitigated by specific documents in this `/docs` folder:

| Risk | Mitigating Document |
|------|---------------------|
| R1 (UI inconsistency) | [05 Design System](./05_UI_UX_Design_System.md) |
| R2 (Invalid hints) | [04 Algorithms & Logic](./04_Algorithms_and_Logic.md) |
| R3 (Mobile DnD) | [02 System Architecture](./02_System_Architecture.md) (technology choice) |
| R4 (Scope creep) | [03 Iterative Dev Plan](./03_Iterative_Development_Plan.md) |

This validates our documentation-first approach — a core thesis of this MBA project.
