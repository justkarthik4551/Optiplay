# Documentation Hub

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee

---

This folder contains the complete documentation for OptiPlay, organized into two layers:

| Layer | Purpose |
|-------|---------|
| **Root docs** (numbered `01` – `09`) | Academic & technical reference — organized for viva evaluation |
| **`archive/`** | Process documentation from the build lifecycle — sprint logs, wireframes, risk registers |

---

## Reading Order

### For a Viva Examiner (15-minute overview)
→ [README.md](../README.md) (root) — Product pitch, games overview, run guide

↓ then:

1. [01 — Problem Definition](./01-problem-definition.md) — Why OR? Why gamification? What is the hypothesis?
2. [02 — Game Design](./02-game-design.md) — How each game maps to OR. UX decisions. Learning outcomes.
3. [03 — Algorithms](./03-algorithms.md) — Formal proofs, DP derivation, greedy failure counter-example.
4. [06 — Decisions](./06-decisions.md) — Why DP over greedy? Why web over Power BI? (The "why" file)

### For Deep Technical Grilling
5. [04 — System Architecture](./04-system-architecture.md) — Data flow, component model, state management
6. [05 — Code Explained](./05-code-explained.md) — Module-by-module breakdown with example I/O

### For Honest Evaluation
7. [07 — Experiments](./07-experiments.md) — Algorithm verification + user testing observations
8. [08 — Limitations](./08-limitations.md) — Honest scope boundaries (7 documented limitations)
9. [09 — Future Work](./09-future-work.md) — AI adaptation, new games, analytics roadmap

### For Rapid Q&A Prep
→ [FAQ](./FAQ.md) — 20 anticipated viva questions with spoken, defensible answers

---

## Document Map

| # | Document | Key Questions Answered |
|---|----------|----------------------|
| 01 | [Problem Definition](./01-problem-definition.md) | What is OR? Why do students struggle? Why gamification? What's the hypothesis? |
| 02 | [Game Design](./02-game-design.md) | How do the games map to OR problems? What are the UX decisions? What do students learn? |
| 03 | [Algorithms](./03-algorithms.md) | What are the formal formulations? Why does greedy fail? How does DP work? What is the complexity? |
| 04 | [System Architecture](./04-system-architecture.md) | What is the tech stack? How is state managed? How does data flow? |
| 05 | [Code Explained](./05-code-explained.md) | What does each module do? What are key functions? Example I/O for every solver. |
| 06 | [Decisions](./06-decisions.md) | Why DP not B&B? Why client-side? Why React not Power BI? Why Indian items? |
| 07 | [Experiments](./07-experiments.md) | How was correctness verified? What did users do? What were the benchmarks? |
| 08 | [Limitations](./08-limitations.md) | What are the scope boundaries? What doesn't work at scale? |
| 09 | [Future Work](./09-future-work.md) | Where does this go next? AI adaptation, new games, analytics, PWA? |
| — | [FAQ](./FAQ.md) | 20 Q&As: theory, design, technical, business relevance |

---

## Cross-Reference Map

The documents are designed to be read together. Here are the key cross-references:

```
01-problem-definition ──▶ 02-game-design  (hypothesis → implementation)
02-game-design        ──▶ 03-algorithms   (item data → formal proofs)
03-algorithms         ──▶ 06-decisions    (approach → why that approach)
03-algorithms         ──▶ 07-experiments  (theory → verification)
04-system-architecture──▶ 05-code-explained (architecture → code walkthrough)
06-decisions          ──▶ 03-algorithms   (decisions reference algorithm tradeoffs)
07-experiments        ──▶ 08-limitations  (observations → honest scope)
08-limitations        ──▶ 09-future-work  (every limitation has a resolution)
FAQ                   ──▶ all numbered docs (every answer links to its source)
```

---

## Archive Documentation

The `archive/` folder preserves the process documents created during the build lifecycle. These are useful for understanding the *journey* rather than the *outcome*.

| Folder | Contents |
|--------|---------|
| [archive/01_strategy/](./archive/01_strategy/) | Project Charter, Competitive Analysis |
| [archive/02_product/](./archive/02_product/) | PRD, Design System, Personas, User Stories, Wireframes |
| [archive/03_engineering/](./archive/03_engineering/) | Original Architecture & Algorithms docs (now superseded by numbered docs) |
| [archive/04_delivery/](./archive/04_delivery/) | Sprint Backlog, Risk Register, Timeline, Deployment Guide, Walkthrough |

> **Note:** The archive engineering docs (`03_engineering/`) are superseded by the numbered root docs. They are preserved for audit trail purposes but may be slightly out of date.

---

*Last updated: April 2026 · All item data verified against source code in `optiplay/src/utils/`*
