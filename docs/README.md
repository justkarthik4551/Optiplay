# 📚 OptiPlay Documentation

> A gamified Operations Research platform — MBA (IS/IT) Project, Department of Management Studies, IIT Roorkee.

---

## Documentation Structure

The docs are organized into four layers, reflecting the natural flow from *why → what → how → when*:

```
docs/
├── 01_strategy/       ← WHY are we building this?
├── 02_product/        ← WHAT are we building?
├── 03_engineering/    ← HOW do we build it?
└── 04_delivery/       ← WHEN and how did we deliver?
```

---

### 📐 01 — Strategy
High-level vision, positioning, and competitive landscape.

| # | Document | Description |
|---|----------|-------------|
| 00 | [Project Charter](./01_strategy/00_Project_Charter.md) | Executive summary, scope, tech stack, constraints, success criteria |
| 09 | [Competitive Analysis](./01_strategy/09_Competitive_Analysis.md) | Landscape review of existing OR/optimization learning tools |

---

### 🎯 02 — Product
User-facing specifications: who uses it, what they see, how it feels.

| # | Document | Description |
|---|----------|-------------|
| 01 | [Product Requirements (PRD)](./02_product/01_PRD.md) | Features, functional requirements, MVP definition |
| 05 | [UI/UX Design System](./02_product/05_UI_UX_Design_System.md) | Dark glassmorphic theme, design tokens, component patterns |
| 06 | [User Personas & Journey](./02_product/06_User_Personas_and_Journey.md) | Target users, needs, and end-to-end journey maps |
| 07 | [User Stories & Acceptance](./02_product/07_User_Stories_and_Acceptance_Criteria.md) | BDD-style stories with testable acceptance criteria |
| 08 | [Wireframes & Screen Flow](./02_product/08_Wireframes_and_Screen_Flow.md) | ASCII wireframes and navigation flow diagrams |

---

### ⚙️ 03 — Engineering
Technical specifications: architecture, algorithms, data models.

| # | Document | Description |
|---|----------|-------------|
| 02 | [System Architecture](./03_engineering/02_System_Architecture.md) | Folder structure, component hierarchy, state management |
| 04 | [Algorithms & Logic](./03_engineering/04_Algorithms_and_Logic.md) | DP solver specification, hint engine tiers, verified reference values |

---

### 🚀 04 — Delivery
Planning, execution tracking, and post-build documentation.

| # | Document | Description |
|---|----------|-------------|
| 03 | [Iterative Development Plan](./04_delivery/03_Iterative_Development_Plan.md) | 5-phase build plan with verification gates |
| 10 | [Risk Register](./04_delivery/10_Risk_Register.md) | Identified risks, mitigations, and contingencies |
| 11 | [Project Timeline](./04_delivery/11_Project_Timeline.md) | Gantt-style timeline with milestones |
| — | [Sprint Backlog](./04_delivery/Sprint_Backlog.md) | Live task tracker (all phases ✅ complete) |
| — | [Build Walkthrough](./04_delivery/Build_Walkthrough.md) | Post-build summary with verification evidence |
| — | [Deployment Guide](./04_delivery/Deployment_Guide.md) | Vercel hosting setup, repo structure, cost analysis |

---

## Quick Links

| Resource | Path |
|----------|------|
| 🏠 Application source code | [`/optiplay/`](../optiplay/) |
| 🧮 DP Solver | [`/optiplay/src/utils/dpSolver.js`](../optiplay/src/utils/dpSolver.js) |
| 💡 Hint Engine | [`/optiplay/src/utils/hintEngine.js`](../optiplay/src/utils/hintEngine.js) |
| 🧪 Algorithm Tests | [`/optiplay/src/utils/testAlgorithms.mjs`](../optiplay/src/utils/testAlgorithms.mjs) |
| 📄 Original OR Problem | [`/Session_1_game.pdf`](../Session_1_game.pdf) |

---

## Reading Order

For a first-time reader (e.g., thesis reviewer), the recommended reading order is:

1. **Project Charter** → understand the "why"
2. **PRD** → understand the "what"
3. **User Personas** → understand the "who"
4. **Algorithms & Logic** → understand the OR core
5. **System Architecture** → understand the code structure
6. **Build Walkthrough** → see what was actually delivered
