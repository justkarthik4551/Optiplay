# Future Work

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee

---

## Overview

OptiPlay's current implementation is a proof-of-concept with full game functionality for the knapsack family. The architecture was designed with extensibility in mind. This document outlines the most impactful directions for future development, ranging from near-term enhancements to long-term research directions.

---

## F-01: AI-Adaptive Problem Generation

**Current state:** Random mode generates problems by sampling weights and values from uniform distributions. There is no feedback loop to the generator.

**Proposed enhancement:** Implement an adaptive difficulty engine that:

1. Tracks a student's hint usage and time-to-optimal across sessions
2. Computes a difficulty score for the student's current ability level
3. Generates new problem instances tuned to be challenging but not overwhelming

**Technical approach:**
- Difficulty is parameterized by the "greedy gap" — the percentage difference between the greedy solution and the DP optimal. Higher gap = harder problem.
- A hill-climbing generator can produce instances with a target greedy gap by tuning the weight-to-value correlation of items.

**Learning impact:** Adaptive difficulty prevents both boredom (problem too easy) and frustration (problem too hard) — the two failure modes of static educational content.

---

## F-02: Additional OR Games

The platform is an extensible shell. Planned future games:

### 🗺️ Find the Route — Travelling Salesman Problem (TSP)
Students drag a path between cities on a map. The solver (exact for N ≤ 12 via brute force or Held-Karp DP; heuristic for larger N) reveals the optimal route. The hint engine suggests 2-opt improvements (swap two edges to reduce tour length).

**OR concept:** NP-hard combinatorial optimization; exponential exact methods; polynomial approximations.

### 📅 Schedule It! — Job Scheduling
Students assign jobs to machines by dragging tasks onto a timeline. The solver (SPT rule for single machine; more complex for parallel machines) finds the makespan-minimizing schedule.

**OR concept:** Operations scheduling; priority rules; preemption.

### 💼 Allocate the Budget! — Capital Budgeting
Students select investment projects under a budget constraint. The solver uses 0/1 DP. Multiple time periods become a multi-dimensional knapsack.

**OR concept:** Capital budgeting under resource constraints; NPV maximization.

---

## F-03: Learning Analytics Dashboard

**Current state:** No persistent tracking. No instructor visibility.

**Proposed enhancement:** A lightweight analytics layer with:

- **Student view:** Personal history of attempts (value achieved, hints used, time taken)
- **Instructor view:** Cohort heatmap (which items students always / never select; where they get stuck)
- **Automated insights:** "80% of students skip the Mixer Grinder — this may indicate confusion about weight efficiency"

**Technical approach:** Firebase Firestore for persistence; React admin dashboard; anonymous student IDs (no authentication required for privacy compliance).

---

## F-04: AI Explanation Agent ("Prof. Optimus")

**Proposed enhancement:** An in-game AI tutor character that:

1. Watches the student's moves
2. Identifies specific misconceptions (e.g., "You keep choosing the heaviest items — let me explain value density")
3. Gives personalized, contextual explanations (not just generic hint messages)

**Technical approach:** Connect student session data (items selected, order of selection, items removed) to an LLM API (Gemini / GPT) with a structured prompt that frames the student's behavior as OR problem-solving context.

**Learning impact:** Socratic questioning at scale — every student gets a personalized tutor experience.

---

## F-05: Multi-Player Mode

**Proposed enhancement:** Two students race to find the optimal solution first. Real-time collaboration using WebSockets (e.g., Supabase Realtime or Socket.io).

**Game modes:**
- **Competition:** Both students see the same problem; first to reach optimal wins
- **Collaboration:** Students take turns adding items; must communicate to coordinate

**Learning impact:** Social learning; articulating strategy to a peer reinforces understanding; competition increases engagement.

---

## F-06: Formal Learning Outcome Validation

**Proposed enhancement:** A structured pre/post assessment embedded in the platform:

1. Pre-game: 5 multiple-choice questions on knapsack concepts
2. Student plays the game
3. Post-game: Same 5 questions (different instances)
4. Score improvement is tracked

**Research value:** Enables proper A/B testing of game-based vs. traditional instruction. Results publishable in educational technology or OR pedagogy journals.

---

## F-07: Internationalisation (i18n)

**Proposed enhancement:** Language packs for Hindi, Tamil, Telugu, and other major Indian languages. The item descriptions and hint messages are the primary content — these are straightforward to externalize into JSON language files.

**Impact:** Widens accessibility to students not comfortable with English-medium OR instruction.

---

## F-08: Offline-First Progressive Web App (PWA)

**Proposed enhancement:** Convert OptiPlay to a PWA with a service worker cache. Students in low-connectivity environments (rural campuses, slow mobile data) can load the app once and play offline indefinitely.

**Technical effort:** Low — add `vite-plugin-pwa` and configure the service worker to cache all static assets. The game has no backend calls to worry about.
