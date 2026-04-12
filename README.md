# OptiPlay — Interactive Operations Research Learning Platform

> *"What if you could learn Dynamic Programming by packing a bag?"*

[![Live Demo](https://img.shields.io/badge/▶%20Play%20Live-OptiPlay-8b5cf6?style=for-the-badge)](https://optiplay.vercel.app)
[![Dept. of Management Studies](https://img.shields.io/badge/DoMS-IIT%20Roorkee-blue?style=flat-square)](https://www.iitr.ac.in)
[![MBA IS/IT Project](https://img.shields.io/badge/MBA-IS%2FIT%20Project-purple?style=flat-square)]()

---

## The Problem We're Solving

Operations Research is a core subject in every MBA programme — yet most students leave their degree unable to intuitively *feel* why Dynamic Programming beats Greedy, or why adding one more constraint makes a problem exponentially harder.

The gap is not intelligence. It is **abstraction**. Textbooks present optimization as equations on a page. Students memorise algorithms for exams and forget them the next week.

**OptiPlay bridges that gap.** Instead of teaching the algorithm first and hoping intuition follows, we flip the model: put students inside the problem, let them experience the constraint, and let the algorithm reveal itself as the answer.

---

## The Solution

OptiPlay is a **web-based gamified learning platform** where each game is a precisely mapped Operations Research problem. Students interact with the problem through drag-and-drop mechanics, receive real-time algorithmic coaching, and can compare their own solution to the mathematical optimum — all without writing a single line of code.

```
Student → Plays game → Gets stuck → Uses hint → Learns why → Tries again → Finds optimal
```

Every game is backed by an exact solver running entirely in the browser. There is no backend, no latency, no setup. The feedback is instant.

---

## Games Available

### 🎒 Pack That Bag! — 0/1 Knapsack
Pack the most valuable bag without exceeding the weight limit. A direct, playable instance of the classic **0/1 Knapsack Problem**.

| Attribute | Details |
|-----------|---------|
| OR Problem | 0/1 Knapsack |
| Constraint | 1 (weight) |
| Solver | 2D Bottom-Up Dynamic Programming |
| Complexity | O(N × W) |
| Items | 12 Indian household items |
| Capacity | 26 kg |

**Key Features:** Drag & drop · AI hint engine (4 tiers) · Show Optimal · 3 game modes (Classic / Random / Custom) · Victory modal with DP explanation

---

### 🚚 Pack the Truck! — Multi-Constraint Knapsack
Load the most valuable cargo into a truck with **two** limits: weight AND volume. An extension to the standard knapsack that mirrors real logistics problems.

| Attribute | Details |
|-----------|---------|
| OR Problem | Multi-Dimensional 0/1 Knapsack |
| Constraints | 2 (weight + volume) |
| Solver | 3D Bottom-Up Dynamic Programming |
| Complexity | O(N × W × U) |
| Items | 12 Indian moving-day items |
| Capacity | 100 kg · 60 cu.ft. |

**Key Features:** Dual progress bars · Volume-density colour coding · 4-tier hint engine (2-constraint aware) · Auto-solve · Custom mode with full parameter control

---

## Screenshots

> *(Play live at [optiplay.vercel.app](https://optiplay.vercel.app) for the full interactive experience)*

| Hub | Pack That Bag | Pack the Truck |
|-----|--------------|----------------|
| Game selection screen | Drag items into the bag | Dual-constraint truck loading |

---

## Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| UI Framework | React 18 + Vite | Fast HMR, component model maps well to game state |
| Drag & Drop | @dnd-kit/core | Accessible, pointer + touch + keyboard sensor support |
| Styling | Vanilla CSS 3 | Full design-token control; glassmorphism without framework lock-in |
| Algorithms | Pure JavaScript (client-side) | Zero backend; instant feedback; fully auditable |
| State Management | React Context + useReducer | Predictable, flux-style game state without Redux overhead |
| Hosting | Vercel | Auto-deploy from `main`; CDN edge delivery |
| Typography | Inter (Google Fonts) | Legibility at all sizes; modern sans-serif |

---

## How to Run Locally

```bash
# Clone the repository
git clone https://github.com/justkarthik4551/Optiplay.git
cd Optiplay

# Install dependencies
cd optiplay
npm install

# Start development server
npm run dev
# → Open http://localhost:5173/
```

**Requirements:** Node.js 18+, npm 9+

---

## Documentation

Full academic and technical documentation lives in [`/docs`](./docs/README.md).

| Document | Purpose | Viva Use |
|----------|---------|----------|
| [Problem Definition](./docs/problem-definition.md) | Why OR, why gamification | Business relevance questions |
| [Game Design](./docs/game-design.md) | How each game maps to OR theory | UX + pedagogy questions |
| [Algorithms](./docs/algorithms.md) | Formal proofs, DP derivations, complexity | "Explain the algorithm" |
| [System Architecture](./docs/system-architecture.md) | Data flow, component model | "How does the code work?" |
| [Code Explained](./docs/code-explained.md) | Module-by-module breakdown | "Walk me through the code" |
| [Decisions](./docs/DECISIONS.md) | Why DP over greedy, why web vs. BI tools | "Why did you choose this?" |
| [Limitations](./docs/limitations.md) | Honest scope boundaries | "What are the weaknesses?" |
| [Future Work](./docs/future-work.md) | AI-adaptive roadmap | "Where does this go next?" |
| [FAQ](./docs/FAQ.md) | Anticipated viva questions | Rapid-fire Q&A |
| [Experiments](./docs/experiments.md) | Testing & observations | "How did you validate it?" |

---

## Project Positioning

This project is not "a game built for a course."

It is an **interactive optimization learning system** grounded in Operations Research theory, implemented through evidence-based gamification principles, and engineered using modern web architecture patterns. Every design decision — from the DP solver choice to the 4-tier hint pedagogy — is documented and defensible.

---

## Credits & Acknowledgements

- **Original Problem Concept:** Prof. Tallys Yunes — *"Pack That Bag!"* (0/1 Knapsack as a classroom game)
- **Institution:** Department of Management Studies, Indian Institute of Technology Roorkee
- **Development Methodology:** Documentation-first AI-assisted development ("Vibe Coding")

---

*© 2026 · Department of Management Studies · IIT Roorkee · All rights reserved.*
