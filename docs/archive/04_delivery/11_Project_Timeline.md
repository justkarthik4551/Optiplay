# 11 — Project Timeline & Milestones

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 11 of 11 · Project Timeline & Milestones
> **Cross-references:** [03 Iterative Dev Plan](./03_Iterative_Development_Plan.md) · [07 User Stories](../02_product/07_User_Stories_and_Acceptance_Criteria.md)

---

## Methodology

**Iterative Agile** with AI-assisted "Vibe Coding." Each phase is a self-contained sprint with a clear deliverable and a verification gate. The AI agent must not proceed to the next phase until the current phase passes its gate criteria.

---

## Gantt-Style Timeline

```
Phase                        │ Sprint │ Deliverable                         │ Verify
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
Phase 0: Documentation       │   S0   │ All 12 docs in /docs                │ ✅ Complete
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
Phase 1: Setup & Design      │   S1   │ Vite + React initialized            │
  System ("The Vibe")        │        │ Folder structure created             │
                             │        │ CSS Design System (variables.css,    │
                             │        │   theme.css, animations.css)         │
                             │        │ Hub Landing Page (Hub.jsx)           │ User Review
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
Phase 2: OR Algorithms       │   S2   │ dpSolver.js implemented              │
  ("The Brain")              │        │ hintEngine.js implemented            │
                             │        │ classicItems.js data file            │
                             │        │ Console verification tests pass      │ Test Output
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
Phase 3: Game Config &       │   S3   │ GameContext.jsx (state management)  │
  State Management           │        │ GameConfig.jsx (3 modes UI)         │
                             │        │ Classic / Random / Custom logic      │ User Review
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
Phase 4: Core Interactive    │   S4   │ ItemCard component (proportional)    │
  UI (Drag & Drop)           │        │ @dnd-kit drag-and-drop working       │
                             │        │ Capacity enforcement (bounce-back)   │
                             │        │ ProgressBar + Value counter          │ Playtest
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
Phase 5: Polish &            │   S5   │ HintToast wired to hintEngine.js    │
  Integration                │        │ VictoryModal with confetti           │
                             │        │ Educational summary (post-game)      │
                             │        │ Final micro-animation pass           │
                             │        │ End-to-end flow playtest             │ Full Review
─────────────────────────────┼────────┼─────────────────────────────────────┼──────────────
```

## Milestone Gates

| Milestone | Gate Criteria | User Stories Covered | Approver |
|-----------|--------------|---------------------|----------|
| **M0: Docs Complete** | All 12 documents in `/docs` reviewed and consistent | — | User |
| **M1: Vibe Established** | Hub landing page renders with premium dark glassmorphic aesthetic. User confirms "wow factor." | US-1.1 | User |
| **M2: Brain Verified** | `dpSolver` returns **$1,166** for classic 12-item problem. `hintEngine` returns valid hints for 3+ test states and confirms optimality when appropriate. | US-4.1, US-5.1 (foundation) | Automated + User |
| **M3: Config Working** | All 3 modes (Classic / Random / Custom) generate valid game state with correct `optimalValue`. | US-2.1, US-2.2, US-2.3 | User |
| **M4: Game Playable** | Full drag-and-drop loop works. Capacity enforcement works. Weight bar and value counter update in real-time. | US-3.1, US-3.2, US-3.3 | User Playtest |
| **M5: Ship It** | Hint, victory, and educational summary all wired. No visual bugs. End-to-end flow: Hub → Config → Play → Hint → Victory → Play Again is seamless. | US-4.1, US-5.1, US-6.1 | User Final Review |

## Dependency Chain

```
Phase 0 (Docs) ✅
    │
    ▼
Phase 1 (Setup & Vibe)
    │
    ├──────────────────────┐
    ▼                      ▼
Phase 2 (Algorithms)    Phase 3 (Config & State)
    │                      │
    └──────────┬───────────┘
               ▼
         Phase 4 (Drag & Drop UI)
               │
               ▼
         Phase 5 (Polish & Integration)
```

> **Note:** Phases 2 and 3 are independent and can be completed in either order. Phase 4 requires both Phase 2 and Phase 3 to be complete. Phase 5 requires Phase 4.
