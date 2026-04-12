# 00 — Project Charter

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 00 of 11 · Project Charter
> **Cross-references:** [01 PRD](../02_product/01_PRD.md) · [02 System Architecture](../03_engineering/02_System_Architecture.md) · [11 Timeline](../04_delivery/11_Project_Timeline.md)

---

## 1. Executive Summary

**Project Name:** OptiPlay
**Domain:** Information Systems (IS) / Educational Technology (EdTech)
**Objective:** To design, document, and develop a highly interactive, web-based platform that gamifies Operations Research (OR) problems — demonstrating the full product lifecycle from an IS/IT MBA specialization perspective.

**Strategic Value:** Classical OR problems (like the 0/1 Knapsack) are typically taught through dry mathematical formulations. OptiPlay converts them into visual, tactile, drag-and-drop games with real-time algorithmic coaching. This project showcases:
- How modern frontend web technologies can make quantitative methods accessible.
- The rigorous documentation-first approach (this doc set) as a thesis on "Vibe Coding" — building production-quality software through AI-assisted, iterative development guided by comprehensive specifications.

**MBA Thesis Angle:** The project simultaneously serves as the product *and* the case study. The documentation set itself demonstrates IS/IT project management best practices, while the final product demonstrates applied optimization and premium UX design.

## 2. Scope

### In Scope (MVP)
- **Platform Hub:** A centralized landing page listing available OR games.
- **Game: "Pack That Bag!"** — An interactive 0/1 Knapsack game with:
  - Three configuration modes: Classic, Random, and Custom.
  - Drag-and-drop gameplay with real-time weight/value feedback.
  - An intelligent Hint Engine that suggests exactly one improving move.
  - Automatic victory detection when the user reaches the DP-optimal value.
  - A post-game educational summary explaining the OR concept.

### Out of Scope (Future)
- Additional OR games (shown as "Coming Soon" in the Hub).
- User accounts, leaderboards, or persistent data.
- Backend server or database.

## 3. Technology Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| **Framework** | React 18+ via Vite | SPA for fluid routing; Vite for fast HMR during development. |
| **Styling** | Vanilla CSS 3 | CSS Variables, Flexbox, Grid, `@keyframes`. No CSS frameworks — full control over the premium "Vibe." |
| **Drag & Drop** | `@dnd-kit/core` | React-native DnD library with built-in keyboard and touch sensor support. |
| **Algorithms** | Client-side JavaScript | DP solver runs in O(N×W) time; trivial for N ≤ 20, W ≤ 100. No server needed. |
| **Typography** | Inter (Google Fonts) | Geometric sans-serif; highly legible; modern. |

## 4. Key Constraints

| Constraint | Value | Source |
|------------|-------|--------|
| Classic Mode items | 12 (from the original PDF by Prof. Tallys Yunes) | [Session_1_game.pdf](../Session_1_game.pdf) |
| Classic Mode capacity | **26 kg** | PDF (localized: original was lbs) |
| Classic Mode optimal value | **₹1,166** (7 items, 26 kg) | Verified via DP solver |
| Custom Mode item cap | 20 items max | UX + performance safeguard |
| Hint Engine latency | < 50 ms | Imperceptible to user |

## 5. Success Criteria

1. A user with zero setup can open a URL, select "Pack That Bag!", and start playing in under 10 seconds.
2. The Hint Engine always suggests a valid, strictly improving move (or confirms optimality).
3. The platform achieves a "wow factor" premium aesthetic — dark glassmorphic design, micro-animations, and tactile drag-and-drop.
4. The documentation set (this `/docs` folder) is complete, consistent, and cross-referenced — demonstrating MBA-grade IS/IT project management.
