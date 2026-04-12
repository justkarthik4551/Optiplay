# 05 — Code Explained

> **OptiPlay — Gamified Operations Research Learning Platform**
> Department of Management Studies · IIT Roorkee
>
> **Cross-references:** [03 Algorithms](./03-algorithms.md) · [04 System Architecture](./04-system-architecture.md) · [06 Decisions](./06-decisions.md)
>
> *Read this alongside the actual source files in `optiplay/src/`.*

---

## 1. `dpSolver.js` — Game 1 Exact Solver

**Purpose:** Solve the 0/1 Knapsack problem exactly using bottom-up Dynamic Programming. Called once at game start; result is stored in context.

**Location:** `optiplay/src/utils/dpSolver.js`

### Key Function

```javascript
/**
 * Solves the 0/1 Knapsack problem using bottom-up dynamic programming.
 *
 * @param {Array<{id: string, weight: number, value: number}>} items
 * @param {number} capacity - W (integer, kg)
 * @returns {{ optimalValue: number, optimalSet: string[] }}
 *   optimalSet: array of item IDs in one optimal solution
 */
export function dpSolver(items, capacity) {
```

### How It Works

1. Builds a 2D table `dp[i][w]` where `i` = item index, `w` = remaining capacity
2. Fills bottom-up: each cell is the max value achievable with items 0..i and weight limit w
3. Traceback: walks the table backwards to identify which items were included
4. Returns `{ optimalValue, optimalSet }`

### Example I/O

```javascript
// Three items: A(weight=2, value=6), B(weight=3, value=10), C(weight=4, value=12)
// Capacity = 5

Input:
  items    = [ {id:'a', weight:2, value:6},
               {id:'b', weight:3, value:10},
               {id:'c', weight:4, value:12} ]
  capacity = 5

DP table (rows = items 0..3, cols = capacity 0..5):
       w=0  w=1  w=2  w=3  w=4  w=5
  i=0   0    0    0    0    0    0
  i=1   0    0    6    6    6    6   ← only item A fits at w≥2
  i=2   0    0    6   10   10   16   ← A+B=5 fits at w=5 → 16
  i=3   0    0    6   10   12   16   ← C alone at w=4, A+B still best at w=5

Output:
  { optimalValue: 16, optimalSet: ['b', 'a'] }
  // Items A(v=6) + B(v=10) = 16, total weight = 2+3 = 5 ≤ 5 ✔
```

**Traceback:** Starting from DP[3][5]=16: 
- i=3: DP[3][5]=16 = DP[2][5]=16 → item C excluded
- i=2: DP[2][5]=16 ≠ DP[1][5]=6 → item B **included**, w = 5-3 = 2  
- i=1: DP[1][2]=6 ≠ DP[0][2]=0 → item A **included**

### Why This Matters in the Viva

If asked "why not just try all combinations?" — point to O(2ⁿ) vs O(N×W). For N=12, that's 4,096 vs 312 operations. For N=30, it's a billion vs 3,000.

---

## 2. `truckSolver.js` — Game 2 Exact Solver

**Purpose:** Solve the 2-dimensional 0/1 Knapsack problem using 3D DP. Same structure as `dpSolver.js` with one extra dimension for volume.

**Location:** `optiplay/src/utils/truckSolver.js`

### Key Function

```javascript
/**
 * Solves the multi-constraint 0/1 Knapsack (weight + volume) using
 * 3D bottom-up dynamic programming.
 *
 * @param {Array<{id, weight, volume, value}>} items
 * @param {number} maxWeight - W
 * @param {number} maxVolume  - U
 * @returns {{ optimalValue: number, optimalSet: string[] }}
 */
export function truckSolver(items, maxWeight, maxVolume) {
```

### Key Implementation Detail

Uses `Int32Array` for each row of the 3D table instead of plain JavaScript arrays:

```javascript
dp[i][w] = new Int32Array(U + 1);  // typed array — faster, memory-contiguous
```

**Why?** JavaScript's standard arrays are dynamic objects. For a 100×60 grid accessed 12 times, typed arrays reduce GC pressure and improve cache performance.

### Example I/O

```javascript
Input:
  items = TRUCK_ITEMS  (12 items)
  maxWeight = 100, maxVolume = 60

Output:
  {
    optimalValue: 2730,
    optimalSet: ['led-tv', 'microwave', 'air-conditioner',
                 'study-desk', 'cricket-kit-bag', 'suitcase']
  }
```

---

## 3. `hintEngine.js` — Game 1 Hint Engine

**Purpose:** Given the current game state, return exactly one actionable, value-improving suggestion. Returns `{ type, message }`.

**Location:** `optiplay/src/utils/hintEngine.js`

### Key Function

```javascript
/**
 * @param {Array<{id, name, weight, value, inBag}>} items
 * @param {number} capacity
 * @returns {{ type: 'add'|'swap'|'optimal', message: string }}
 */
export function hintEngine(items, capacity) {
```

### Logic Flow

```
Tier 1: Are there items not in bag that fit? → Suggest best by v/w ratio
Tier 2: Are there 1-for-1 swaps that gain value? → Suggest best gain swap
Tier 3: Are there 2-opt moves (1-for-2, 2-for-1) that gain value? → Suggest
Tier 4: No improvement possible → "You're optimal!"
```

### Example I/O

```javascript
// State: bag has [Mixer Grinder (₹240, 5kg)], capacity = 10kg remaining
Input: items (with Sandwich Maker and BT Speaker outside, fitting)
Output: { type: 'add', message: 'Add the BT Speaker (₹230, 6 kg)' }
```

---

## 4. `truckHintEngine.js` — Game 2 Hint Engine

**Purpose:** Same as `hintEngine.js` but with dual-constraint feasibility checks throughout.

**Location:** `optiplay/src/utils/truckHintEngine.js`

### Key Difference from Game 1

```javascript
// Game 1: single constraint check
const fits = (item) => usedWeight + item.weight <= maxWeight;

// Game 2: dual constraint check
const fits = (item, extraW = 0, extraU = 0) =>
  usedWeight + extraW + item.weight <= maxWeight &&
  usedVolume + extraU + item.volume <= maxVolume;
```

Everything else — tier logic, message format, return shape — is identical to `hintEngine.js`.

---

## 5. `useKnapsackDnD.js` — Shared DnD Hook

**Purpose:** Encapsulate all drag-and-drop logic so that game pages stay lean. Both `PackThatBag.jsx` and `PackTheTruck.jsx` use this hook.

**Location:** `optiplay/src/hooks/useKnapsackDnD.js`

### Key Function

```javascript
/**
 * @param {object} cfg
 * @param {Array}    cfg.items            - Full item array
 * @param {number}   cfg.optimalValue     - Winning threshold
 * @param {Function} cfg.dispatch         - Context dispatch
 * @param {string}   cfg.containerZoneId  - Drop target for bag/truck
 * @param {string}   cfg.inventoryZoneId  - Drop target for inventory
 * @param {Function} cfg.canAdd           - (item) => boolean
 * @param {Function} cfg.onVictory        - Called when player hits optimalValue
 * @returns {{ activeId, capacityFlash, sensors, handleDragStart, handleDragEnd }}
 */
export function useKnapsackDnD(cfg) {
```

### What This Hook Manages

1. **Sensor setup** — PointerSensor (desktop), TouchSensor (mobile), KeyboardSensor (accessibility)
2. **Active drag state** — `activeId` drives the `DragOverlay` ghost element
3. **Capacity flash** — 400ms red-flash animation when user drops an item that doesn't fit
4. **Optimistic victory check** — Computes new value after drop *before* context state updates (React state is async)

### Before vs. After (Refactoring Impact)

Before this hook, each game page had ~45 lines of duplicated DnD logic. After:
- `PackThatBag.jsx` reduced by 45 lines
- `PackTheTruck.jsx` never needed to duplicate it
- All future games get DnD for free by calling this hook

---

## 6. `GameContext.jsx` & `TruckContext.jsx` — State Management

**Purpose:** Provide game state to all components within a game's route tree. Prevent state from leaking between games.

### Reducer Pattern (both contexts)

```javascript
function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': { /* run solver, init items */ }
    case 'TOGGLE_ITEM': { /* flip item.inBag */ }
    case 'USE_HINT':    { /* increment hintsUsed */ }
    case 'PACK_OPTIMAL_SOLUTION': { /* set all optimal items inBag=true */ }
    case 'RESET_BAG':   { /* clear all inBag */ }
    case 'RESET_GAME':  { /* full reset */ }
  }
}
```

### Why `useReducer` over `useState`?

- State transitions are explicit and predictable (every change goes through the reducer)
- Easy to add new actions without introducing bugs in existing ones
- The reducer is a pure function — trivially unit-testable
- Natural fit for complex, interdependent state (items array + multiple derived values)

---

## 7. `VictoryModal.jsx` — Shared Win Screen

**Purpose:** Display win condition. Supports both games via optional props.

### Props

```javascript
VictoryModal({
  show,          // boolean — controls visibility
  value,         // number — final value achieved
  weight,        // number — weight used
  capacity,      // number — weight limit
  volumeUsed,    // number? — Game 2 only (optional)
  maxVolume,     // number? — Game 2 only (optional)
  hintsUsed,     // number
  mode,          // string — game mode badge
  autoSolved,    // boolean — true if Show Optimal was used
  onClose,       // () => void — "View Board" button
  onPlayAgain,   // () => void — "Play Again" button
})
```

### Auto-Solved State

When `autoSolved = true`:
- Stars rating is replaced with a "🤖 Auto-Solved" badge
- Message reads "You used the AI to find the answer!"
- No celebratory language — the victory was not earned

This is intentional: the game rewards genuine problem-solving. Auto-solve is a learning tool, not a cheat code.

---

## 8. Design System (`styles/`)

All visual design is driven by CSS Custom Properties (design tokens).

**Key token groups in `variables.css`:**

```css
/* Colors */
--accent-primary: #8b5cf6;          /* Purple — primary actions */
--accent-success: #10b981;          /* Green  — positive states */
--accent-danger:  #ef4444;          /* Red    — errors/overflow */

/* Surfaces (glassmorphism) */
--surface-glass:      rgba(255,255,255,0.04);
--surface-glass-hover: rgba(255,255,255,0.07);
--surface-border:     rgba(255,255,255,0.08);
--surface-blur:       blur(12px);

/* Spacing scale */
--space-xs: 4px;  --space-sm: 8px;   --space-md: 12px;
--space-lg: 16px; --space-xl: 24px;  --space-2xl: 32px;
--space-3xl: 48px;
```

Any component in the app uses these tokens, never hardcoded values. This means the entire visual theme can be changed by editing `variables.css` alone.
