# 🎒 OptiPlay — Gamified Operations Research

> **Master Operations Research through play.** Drag, drop, and discover optimal solutions to classic optimization problems.

[![Department of Management Studies](https://img.shields.io/badge/DoMS-IIT%20Roorkee-blue)](https://www.iitr.ac.in/Departments/Management%20Studies%20Department/index.html)
[![MBA IS/IT Project](https://img.shields.io/badge/MBA-IS%2FIT%20Project-purple)]()
[![Powered by](https://img.shields.io/badge/Powered%20by-Vibe%20Coding-green)]()

---

## 🎮 Play Now

**[▶ Launch OptiPlay](https://optiplay.vercel.app)** *(link active after deployment)*

---

## What is OptiPlay?

OptiPlay transforms dry Operations Research textbook problems into **interactive, visual games** with real-time algorithmic coaching. Built as an MBA (IS/IT) project at the Department of Management Studies, IIT Roorkee.

### 🎒 Pack That Bag! (0/1 Knapsack)
The first game challenges you to pack the most valuable bag without exceeding the weight limit — a classic **0/1 Knapsack Problem** solved using **Dynamic Programming**.

**Features:**
- 🖱️ **Drag & Drop** items between inventory and bag
- 💡 **AI Hint Engine** — tiered suggestions (Add → Swap → Multi-swap)
- 🎯 **3 Game Modes** — Classic (12 textbook items), Random, Custom
- 🏆 **Victory Detection** with confetti, star rating, and DP educational insight
- 📊 **Real-time stats** — weight progress bar, value counter, hints used

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite |
| Styling | Vanilla CSS 3 (Design Tokens, Glassmorphism) |
| Drag & Drop | @dnd-kit/core |
| Algorithms | Client-side Dynamic Programming |
| Typography | Inter (Google Fonts) |
| Hosting | Vercel (Free Tier) |

---

## 📁 Project Structure

```
├── docs/                    # 15 project documents (Strategy → Product → Engineering → Delivery)
│   └── README.md            # Documentation index & reading order
├── optiplay/                # React/Vite application
│   ├── src/
│   │   ├── utils/           # DP solver, hint engine, classic items
│   │   ├── context/         # Game state (React Context + useReducer)
│   │   ├── pages/           # Hub, GameConfig, PackThatBag
│   │   └── components/      # ItemCard, DroppableZone, HintToast, VictoryModal
│   └── package.json
└── Session_1_game.pdf       # Original OR problem source
```

---

## 🚀 Run Locally

```bash
cd optiplay
npm install
npm run dev
# → http://localhost:5173/
```

---

## 📚 Documentation

The complete documentation suite is in [`/docs`](./docs/README.md), organized into four layers:

| Layer | Contains |
|-------|----------|
| **01 Strategy** | Project Charter, Competitive Analysis |
| **02 Product** | PRD, Design System, Personas, User Stories, Wireframes |
| **03 Engineering** | System Architecture, Algorithms & Logic |
| **04 Delivery** | Dev Plan, Sprint Backlog, Risk Register, Timeline, Walkthrough, Deployment Guide |

---

## 🤝 Credits

- **Original Problem:** Prof. Tallys Yunes — "Pack That Bag!" (0/1 Knapsack game)
- **Institution:** Department of Management Studies, Indian Institute of Technology Roorkee
- **Development Approach:** Documentation-first "Vibe Coding" with AI-assisted development

---

## 📄 License

This project is developed as an academic project at IIT Roorkee. All rights reserved.
