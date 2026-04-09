# 05 — Game Design Document: Pack the Truck!

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 05 of 11 · Game Design Document (GDD) — Game 2
> **Cross-references:** [02 System Architecture](./02_System_Architecture.md) · [04 Algorithms & Logic](./04_Algorithms_and_Logic.md) · [Sprint Backlog](../04_delivery/Sprint_Backlog.md)

---

## 1. Game Identity

| Field | Value |
|-------|-------|
| **Title** | Pack the Truck! |
| **Route** | `/pack-the-truck/config` → `/pack-the-truck/play` |
| **Problem Type** | Multi-Dimensional 0/1 Knapsack (2 constraints) |
| **Pedagogical Goal** | Teach trade-offs between multiple resource constraints and why greedy fails |
| **Target Audience** | MBA / Engineering students studying OR/integer programming |
| **Difficulty vs. Game 1** | Higher — two constraints forces more complex reasoning |

---

## 2. Problem Formulation

### Decision Variables
- $x_i \in \{0, 1\}$ — whether item $i$ is loaded into the truck

### Objective
$$\max \sum_{i=1}^{n} v_i x_i$$

### Constraints
$$\sum_{i=1}^{n} w_i x_i \leq W \quad \text{(Weight capacity)}$$
$$\sum_{i=1}^{n} u_i x_i \leq U \quad \text{(Volume capacity)}$$

### Item Data Model
```javascript
Item {
  id:     string,   // unique identifier
  name:   string,   // display name
  emoji:  string,   // visual icon
  weight: number,   // in kg
  volume: number,   // in cubic feet (cu.ft.)
  value:  number,   // in ₹
}
```

### Truck Data Model
```javascript
Truck {
  maxWeight: number,   // W — max kg
  maxVolume: number,   // U — max cu.ft.
}
```

---

## 3. Classic Mode Dataset (Indian Localization)

**Truck Capacity:** 100 kg weight, 60 cu.ft. volume

| # | Item | Emoji | Weight (kg) | Volume (cu.ft.) | Value (₹) |
|---|------|-------|-------------|-----------------|-----------|
| 1 | Refrigerator | 🧊 | 40 | 20 | 850 |
| 2 | Washing Machine | 🫧 | 35 | 18 | 780 |
| 3 | LED TV (55") | 📺 | 20 | 15 | 650 |
| 4 | Sofa Set | 🛋️ | 45 | 25 | 900 |
| 5 | Dining Table | 🍽️ | 30 | 20 | 720 |
| 6 | Microwave | 🍲 | 12 | 6 | 340 |
| 7 | Air Conditioner | ❄️ | 28 | 12 | 680 |
| 8 | Study Desk | 🖥️ | 22 | 14 | 560 |
| 9 | Almirah | 🗄️ | 50 | 28 | 950 |
| 10 | Bookshelf | 📚 | 18 | 16 | 480 |
| 11 | Cricket Kit Bag | 🏏 | 8 | 5 | 220 |
| 12 | Suitcase | 🧳 | 10 | 7 | 280 |

> **Note:** Classic mode optimal value will be computed by the Branch & Bound solver at game initialization and stored in context state.

---

## 4. Game Modes

### Classic Mode
- Fixed 12-item Indian-themed dataset
- Truck constraints: W = 100 kg, U = 60 cu.ft.
- Optimal solution pre-computed by solver on `START_GAME`

### Random Mode
- Generate N = 8–15 items with randomized weights (5–50 kg), volumes (3–30 cu.ft.), values (₹100–₹1000)
- Truck capacity set to 40–65% of total weight and volume respectively
- Solver runs on `START_GAME` to confirm feasibility and store optimal

### Custom Mode
- User defines each item's name, weight, volume, value
- User sets truck max weight and volume
- Solver runs on `START_GAME` with user-defined data

---

## 5. UI/UX Layout

```
┌──────────────────────────────────────────────────────────────┐
│  ← Config     🚚 Pack the Truck!  [random]                   │
│               [💡 Hint]  [✨ Show Optimal]  [🔄 Reset]       │
├──────────────────────────────────────────────────────────────┤
│  WEIGHT ████████░░░░  65/100 kg    VOLUME ██████░░░  38/60   │
│                                    VALUE ₹2,340              │
├────────────────────┬─────────────────────────────────────────┤
│                    │                                         │
│   📦 Inventory     │       🚚 Your Truck                     │
│   (draggable       │       (droppable zone)                  │
│    item cards)     │       Item cards show here              │
│                    │       when dropped                      │
│                    │                                         │
└────────────────────┴─────────────────────────────────────────┘
```

### Item Card Design (Enhanced for 2 constraints)
Each card shows:
- Emoji + Name
- ₹ Value (prominent)
- `Wt: X kg  Vol: Y cu.ft.` — two stat lines

Width proportional to **weight** (same as Game 1)
Border color indicates **volume density** (light = low volume, amber = high)

---

## 6. Gameplay Mechanics

### Drag-and-Drop
- Same `@dnd-kit` infrastructure as Game 1 (reuse `DraggableItem`, `DroppableZone`)
- Zone IDs: `inventory-zone-truck` and `truck-zone`

### Constraint Enforcement
- An item is **blocked** from the truck if either constraint would be exceeded
- Visual "double flash" on the relevant progress bar (weight, volume, or both)
- Item snaps back to inventory

### Victory Condition
- Player's current value === `state.optimalValue` (same pattern as Game 1)
- Victory Modal fires with stats: Value, Weight Used, Volume Used, Hints

---

## 7. Hint System

Same 4-tier pattern as Game 1's `hintEngine.js`, adapted for 2 constraints:

| Tier | Name | Logic |
|------|------|-------|
| **T1** | ADD | Find the highest value/weight-ratio item that fits within **both** constraints |
| **T2** | SWAP 1-for-1 | Find the best single-item swap that improves value and stays feasible |
| **T3** | SWAP multi | Remove 1, add 2 (or remove 2, add 1) — same pattern, using both constraint checks |
| **T4** | OPTIMAL | "Your solution is already optimal! 🎉" |

---

## 8. Show Optimal Solution

Identical to Game 1:
- `PACK_OPTIMAL_TRUCK` dispatch → sets all optimal items `inTruck: true`
- Victory Modal fires after 400ms
- Shows "🤖 Auto-Solved" badge, "👀 View Board" button

---

## 9. Pedagogical Differentiators from Game 1

| Feature | Game 1 (Pack That Bag) | Game 2 (Pack the Truck) |
|---------|------------------------|-------------------------|
| Constraints | 1 (weight) | 2 (weight + volume) |
| Solver | DP table (O(N×W)) | Branch & Bound |
| Complexity | Polynomial | NP-Hard (in general) |
| Visual metaphor | Backpack | Truck |
| Key lesson | DP optimization | Trade-offs, infeasibility |

---

*Document created: April 2026*
*Status: Approved for Implementation (Phase 8)*
