# Documentation Index

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee

---

This folder contains the complete academic and technical documentation for OptiPlay. It is organized for two audiences:

- **Viva evaluation:** A structured reference system so every question has a home
- **Technical continuation:** Future developers can understand every architectural and algorithmic decision

---

## Reading Order

### For a Viva Examiner (15-minute overview)
1. [README.md](../README.md) — What the project is and why it exists
2. [problem-definition.md](./problem-definition.md) — The OR education gap and the gamification hypothesis
3. [algorithms.md](./algorithms.md) — The mathematics behind the solvers
4. [DECISIONS.md](./DECISIONS.md) — Why these choices were made

### For Deep Technical Review
1. [system-architecture.md](./system-architecture.md) — Component model, state management, data flow
2. [code-explained.md](./code-explained.md) — Module-by-module code walkthrough
3. [game-design.md](./game-design.md) — OR problem mapping and UX rationale
4. [experiments.md](./experiments.md) — Algorithm verification and observations

### For Rapid Oral Examination Prep
- [FAQ.md](./FAQ.md) — 20 anticipated viva questions with spoken answers

### For Balanced Assessment
- [limitations.md](./limitations.md) — Honest scope boundaries
- [future-work.md](./future-work.md) — Roadmap and research directions

---

## Document Map

| Document | What It Answers |
|----------|----------------|
| [problem-definition.md](./problem-definition.md) | Why OR? Why gamification? What's the hypothesis? |
| [game-design.md](./game-design.md) | How each game maps to OR theory. UX decisions. Learning outcomes. |
| [algorithms.md](./algorithms.md) | Formal problem statements. Greedy failure proof. DP derivation. Hint engine design. |
| [system-architecture.md](./system-architecture.md) | Tech stack. Folder structure. State management. Data flow diagram. |
| [code-explained.md](./code-explained.md) | Every module: purpose, key functions, example I/O. |
| [DECISIONS.md](./DECISIONS.md) | DP vs. Greedy. No backend. React vs. Power BI. Vanilla CSS. Indian localization. |
| [experiments.md](./experiments.md) | Algorithm correctness verification. User testing observations. Performance benchmarks. |
| [limitations.md](./limitations.md) | Scale limits. No persistence. No formal validation. Mobile UX. |
| [future-work.md](./future-work.md) | AI adaptation. New games. Analytics. Multi-player. PWA. |
| [FAQ.md](./FAQ.md) | 20 viva Q&As covering theory, design, technical, and business relevance. |

---

## What Happened to the Old Docs?

The original documentation was organized into strategic folders (`01_strategy/`, `02_product/`, `03_engineering/`, `04_delivery/`) reflecting a product development process. Those documents capture the **process** of building OptiPlay.

The new documentation (this folder's root-level files) is organized by **intellectual content** — designed for a viva audience that needs to quickly locate answers to specific questions, not trace a development timeline.

Both sets of documents are preserved in the repository.

---

*Last updated: April 2026*
