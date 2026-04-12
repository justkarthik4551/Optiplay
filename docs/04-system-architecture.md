# 04 — System Architecture

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> **Cross-references:** [03 Algorithms](./03-algorithms.md) · [05 Code Explained](./05-code-explained.md) · [06 Decisions](./06-decisions.md)

---

## 1. Architecture Overview

OptiPlay is a **pure client-side Single Page Application (SPA)**. There is no backend, no database, and no server-side computation. Every algorithm runs in the user's browser.

```
┌─────────────────────────────────────────────────────────┐
│                        Browser                          │
│                                                         │
│  ┌──────────┐   ┌───────────────┐   ┌────────────────┐ │
│  │  React   │   │  Game Context │   │  Solver Layer  │ │
│  │  Router  │──▷│  (State Mgmt) │──▷│  (DP Algorithms│ │
│  │          │   │               │   │   + Hints)     │ │
│  └──────────┘   └───────────────┘   └────────────────┘ │
│        │                │                              │
│   ┌────▽────────────────▽──────────────────────────┐   │
│   │              Component Tree                    │   │
│   │  Hub → GameConfig → PlayPage                   │   │
│   │  (Navbar, DroppableZone, DraggableItem,        │   │
│   │   ItemCard, ProgressBar, HintToast,            │   │
│   │   VictoryModal)                                │   │
│   └────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
         ↓  served as static files
    ┌─────────────┐
    │   Vercel    │  (CDN Edge Delivery)
    │   Hosting   │
    └─────────────┘
```

---

## 2. Technology Stack

| Layer | Technology | Version | Rationale |
|-------|-----------|---------|-----------|
| Build Tool | Vite | 5+ | Sub-second HMR; ES modules native; fast production builds |
| UI Framework | React | 18+ | Component model; Context API for state; wide ecosystem |
| Drag & Drop | @dnd-kit/core | 6+ | Accessible (pointer + touch + keyboard); no DOM manipulation |
| Routing | React Router | v6 | Nested routes; scoped context providers |
| Styling | Vanilla CSS 3 | — | CSS custom properties (design tokens); no framework lock-in |
| Algorithms | Pure JavaScript | — | Client-side; no latency; fully auditable |
| Typography | Inter | — | Google Fonts CDN; legible at all sizes |
| Hosting | Vercel | — | Auto-deploy from `main`; free tier; edge CDN |

---

## 3. Folder Structure

```
optiplay/src/
│
├── assets/                       # Static media
│   ├── iitr_logo.png             # IIT Roorkee white wordmark (navbar desktop)
│   ├── iitr_seal.png             # IIT Roorkee seal (navbar mobile)
│   └── hero.png                  # Hub hero background
│
├── components/
│   ├── common/
│   │   ├── GameCard.jsx          # Hub game tile (available / coming-soon states)
│   │   ├── GameCard.css
│   │   └── ProgressBar.jsx       # Reusable animated progress bar
│   │
│   ├── layout/
│   │   ├── Navbar.jsx            # Top navigation with IITR logo
│   │   └── Navbar.css
│   │
│   └── game/                     # Shared game UI components
│       ├── DraggableItem.jsx     # @dnd-kit draggable wrapper
│       ├── DroppableZone.jsx     # @dnd-kit drop target (icon prop for customization)
│       ├── DroppableZone.css
│       ├── HintToast.jsx         # Animated hint notification
│       ├── HintToast.css
│       ├── ItemCard.jsx          # Game 1: 2-stat card (value + weight)
│       ├── ItemCard.css
│       ├── TruckItemCard.jsx     # Game 2: 3-stat card (value + weight + volume)
│       ├── TruckItemCard.css
│       ├── VictoryModal.jsx      # Shared win screen (optional volume stat)
│       └── VictoryModal.css
│
├── context/
│   ├── GameContext.jsx           # Game 1 state (items, capacity, optimalValue)
│   └── TruckContext.jsx          # Game 2 state (items, maxWeight, maxVolume)
│
├── hooks/
│   └── useKnapsackDnD.js         # Shared DnD hook for all knapsack games
│
├── pages/
│   ├── Hub.jsx                   # Landing page — game selection
│   ├── Hub.css
│   ├── GameConfig.jsx            # Game 1 config (mode + custom items)
│   ├── GameConfig.css
│   ├── PackThatBag.jsx           # Game 1 play screen
│   ├── PackThatBag.css
│   ├── TruckConfig.jsx           # Game 2 config (mode + dual capacity)
│   ├── TruckConfig.css
│   ├── PackTheTruck.jsx          # Game 2 play screen
│   └── PackTheTruck.css
│
├── utils/
│   ├── dpSolver.js               # 2D DP — Game 1 exact solver
│   ├── hintEngine.js             # Game 1 hint engine (1-constraint)
│   ├── classicItems.js           # Game 1 item dataset (12 Indian items)
│   ├── truckSolver.js            # 3D DP — Game 2 exact solver
│   ├── truckHintEngine.js        # Game 2 hint engine (2-constraint)
│   └── truckItems.js             # Game 2 item dataset (12 moving-day items)
│
├── styles/
│   ├── variables.css             # Design tokens (colors, spacing, radii, fonts)
│   ├── animations.css            # @keyframes (fade, slide, float, confetti)
│   ├── theme.css                 # Global resets, body, glassmorphism surfaces
│   └── index.css                 # Master import (tokens → theme → utilities)
│
├── App.jsx                       # Root router + scoped context providers
└── main.jsx                      # Vite entry point
```

---

## 4. State Management Architecture

### Design Pattern: Flux (React Context + useReducer)

Each game has its own isolated context provider. Providers are scoped to game routes in `App.jsx`, preventing state leakage between games.

```jsx
// App.jsx — scoped provider pattern
<Route path="/pack-that-bag/*" element={
  <GameProvider>        {/* ← Game 1 state only available here */}
    <Routes>
      <Route path="config" element={<GameConfig />} />
      <Route path="play"   element={<PackThatBag />} />
    </Routes>
  </GameProvider>
} />

<Route path="/pack-the-truck/*" element={
  <TruckProvider>       {/* ← Game 2 state only available here */}
    <Routes>
      <Route path="config" element={<TruckConfig />} />
      <Route path="play"   element={<PackTheTruck />} />
    </Routes>
  </TruckProvider>
} />
```

### Game 1 State Shape (GameContext)

```javascript
{
  mode: 'classic' | 'random' | 'custom',
  capacity: 26,                    // bag weight limit (kg)
  items: [
    { id, name, emoji, weight, value, inBag: boolean },
    ...
  ],
  optimalValue: 1166,              // pre-computed at START_GAME
  optimalItemIds: ['dslr', ...],   // traceback result
  hintsUsed: 0,
  gameStarted: boolean
}
```

### Game 2 State Shape (TruckContext)

```javascript
{
  mode: 'classic' | 'random' | 'custom',
  maxWeight: 100,                  // truck weight limit (kg)
  maxVolume: 60,                   // truck volume limit (cu.ft.)
  items: [
    { id, name, emoji, weight, volume, value, inBag: boolean },
    ...
  ],
  optimalValue: 2730,
  optimalItemIds: ['led-tv', ...],
  hintsUsed: 0,
  gameStarted: boolean
}
```

### Reducer Actions (both contexts)

| Action | Payload | Effect |
|--------|---------|--------|
| `START_GAME` | `{ mode, items, capacity/maxWeight/maxVolume }` | Initializes game, runs solver |
| `TOGGLE_ITEM` | `{ itemId, inBag }` | Moves item between inventory and bag/truck |
| `USE_HINT` | — | Increments `hintsUsed` |
| `PACK_OPTIMAL_SOLUTION` | — | Sets all optimal items to `inBag: true` |
| `RESET_BAG` | — | Clears all items back to inventory |
| `RESET_GAME` | — | Full reset to `initialState` |

### Derived State (useMemo, not stored)

```javascript
bagItems      = items.filter(i => i.inBag)
inventoryItems = items.filter(i => !i.inBag)
currentWeight = sum(bagItems.map(i => i.weight))
currentVolume = sum(truckItems.map(i => i.volume))   // Game 2
currentValue  = sum(bagItems.map(i => i.value))
isOptimal     = currentValue === optimalValue
```

---

## 5. Shared DnD Hook Architecture

A key architectural decision is the `useKnapsackDnD` hook, which encapsulates all drag-and-drop logic shared between games:

```javascript
// useKnapsackDnD.js — contract
useKnapsackDnD({
  items,           // full item array from context
  optimalValue,    // winning threshold
  dispatch,        // context reducer
  containerZoneId, // e.g. 'bag-zone' or 'truck-zone'
  inventoryZoneId, // e.g. 'inventory-zone'
  canAdd,          // (item) => boolean — all constraints check
  onVictory,       // callback when optimal value is matched
})
// returns: { activeId, capacityFlash, sensors, handleDragStart, handleDragEnd }
```

Game 1's `canAdd`:
```javascript
(item) => currentWeight + item.weight <= state.capacity
```

Game 2's `canAdd`:
```javascript
(item) => currentWeight + item.weight <= state.maxWeight &&
          currentVolume + item.volume <= state.maxVolume
```

The hook delegates all constraint logic to the caller. It handles sensors, active state, flash animation, and optimistic victory detection. Neither game page duplicates this logic.

---

## 6. Routing Table

| Route | Component | Provider |
|-------|-----------|----------|
| `/` | Hub.jsx | None |
| `/pack-that-bag/config` | GameConfig.jsx | GameProvider |
| `/pack-that-bag/play` | PackThatBag.jsx | GameProvider |
| `/pack-the-truck/config` | TruckConfig.jsx | TruckProvider |
| `/pack-the-truck/play` | PackTheTruck.jsx | TruckProvider |

---

## 7. Data Flow Diagram

```
User drags item
      │
      ▼
useKnapsackDnD.handleDragEnd
      │
      ├─ canAdd(item) = false? ──▶ setCapacityFlash(true) → red border pulse → STOP
      │
      ├─ canAdd(item) = true
      │       │
      │       ▼
      │  dispatch(TOGGLE_ITEM { itemId, inBag: true })
      │       │
      │       ▼
      │  Context reducer → new items array
      │       │
      │       ▼
      │  useMemo recomputes: currentWeight, currentVolume, currentValue
      │       │
      │       ├──▶ ProgressBar re-renders (new fill %)
      │       ├──▶ Value counter re-renders
      │       └──▶ currentValue === optimalValue? → onVictory() → VictoryModal
      │
      └─ Over inventory zone? → dispatch(TOGGLE_ITEM { itemId, inBag: false })


User clicks "💡 Hint"
      │
      ▼
hintEngine(items, capacity)   OR   truckHintEngine(items, maxW, maxU)
      │
      ▼
{ type: 'add'|'swap'|'optimal', message: string }
      │
      ▼
setHint(result) → HintToast renders → auto-dismisses after 4s


User clicks "✨ Show Optimal"
      │
      ▼
dispatch(PACK_OPTIMAL_SOLUTION)
      │
      ▼
Reducer sets inBag=true for all optimalItemIds, false for rest
      │
      ▼
setTimeout 400ms → setShowVictory(true) + setUsedAutoSolve(true)
      │
      ▼
VictoryModal renders with autoSolved=true → shows 🤖 Auto-Solved
```
