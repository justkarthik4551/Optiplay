# 02 — System Architecture & Code Structure

> **Project:** OptiPlay — Gamified Operations Research Platform
> **Document:** 02 of 11 · System Architecture
> **Cross-references:** [00 Project Charter](../01_strategy/00_Project_Charter.md) · [04 Algorithms & Logic](./04_Algorithms_and_Logic.md) · [05 Design System](../02_product/05_UI_UX_Design_System.md)

---

## 1. Technology Stack

| Layer | Technology | Version/Details |
|-------|-----------|-----------------|
| **Build Tool** | Vite | Latest stable |
| **UI Framework** | React | 18+ |
| **Styling** | Vanilla CSS 3 | CSS Variables, Flexbox, Grid, `@keyframes`. No CSS frameworks. |
| **Drag & Drop** | `@dnd-kit/core` + `@dnd-kit/sortable` | React DnD library with keyboard + touch sensor support |
| **Routing** | React Router v6 | Client-side SPA routing |
| **Typography** | Inter | Loaded via Google Fonts CDN |
| **Algorithms** | Pure JavaScript | Client-side only; no backend |

## 2. Folder Structure

```text
optiplay/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/                  # Images, SVGs, icons
│   ├── components/
│   │   ├── common/              # Button, Modal, Card, ProgressBar
│   │   ├── layout/              # Navbar, Footer, PageWrapper
│   │   └── game/                # ItemCard, BagZone, InventoryZone, HintToast, VictoryModal
│   ├── pages/
│   │   ├── Hub.jsx              # Landing page (route: /)
│   │   ├── GameConfig.jsx       # Mode selection (route: /pack-that-bag/config)
│   │   └── PackThatBag.jsx      # Main game screen (route: /pack-that-bag/play)
│   ├── context/
│   │   └── GameContext.jsx      # React Context for game state
│   ├── hooks/
│   │   └── useKnapsack.js       # Custom hook wrapping solver + hint logic
│   ├── utils/
│   │   ├── dpSolver.js          # Dynamic Programming 0/1 Knapsack solver
│   │   ├── hintEngine.js        # Tiered hint generation logic
│   │   └── classicItems.js      # The 12 classic items data from the PDF
│   ├── styles/
│   │   ├── variables.css        # Design tokens (colors, spacing, fonts)
│   │   ├── animations.css       # @keyframes definitions
│   │   ├── theme.css            # Glassmorphic surfaces, global resets
│   │   └── index.css            # Master import file
│   ├── App.jsx                  # Root component with React Router
│   └── main.jsx                 # Vite entry point
├── index.html
├── package.json
└── vite.config.js
```

## 3. State Management

State is managed via React Context (`GameContext`) to share game data across the Config and Play screens.

### State Shape
```javascript
{
  mode: 'classic' | 'random' | 'custom',       // Selected game mode
  capacity: 26,                                  // Bag weight limit
  items: [                                       // All items in the problem
    { id: 'computer', name: 'Computer', weight: 7, value: 290, inBag: false },
    // ... more items
  ],
  optimalValue: 1166,                            // Pre-computed on game start
  hintsUsed: 0                                   // Hint counter
}
```

### Derived State (computed, not stored)
```javascript
bagItems      = items.filter(i => i.inBag)
inventoryItems = items.filter(i => !i.inBag)
currentWeight = sum(bagItems.map(i => i.weight))
currentValue  = sum(bagItems.map(i => i.value))
isOptimal     = (currentValue === optimalValue)
```

## 4. Data Flow

```
User Drag/Drop ──→ GameContext updates item.inBag
                        │
                        ├──→ Derived state recalculated
                        │        ├──→ Weight bar re-renders
                        │        ├──→ Value counter re-renders
                        │        └──→ If currentValue === optimalValue → Victory Modal
                        │
                        └──→ On "Hint" click:
                                 ├──→ hintEngine.js receives (items, capacity)
                                 ├──→ Returns { type, message } (e.g., "Swap X for Y")
                                 └──→ HintToast component renders the suggestion
```

## 5. Routing

| Route | Component | Screen |
|-------|-----------|--------|
| `/` | `Hub.jsx` | Landing page with game cards |
| `/pack-that-bag/config` | `GameConfig.jsx` | Mode selection (Classic / Random / Custom) |
| `/pack-that-bag/play` | `PackThatBag.jsx` | Main drag-and-drop game |
