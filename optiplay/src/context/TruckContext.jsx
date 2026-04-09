import { createContext, useContext, useReducer, useMemo } from 'react';
import { truckSolver } from '../utils/truckSolver';

/**
 * TruckContext — Shared state for the "Pack the Truck!" game (Game 2).
 * Ref: docs/03_engineering/05_Pack_The_Truck_GDD.md
 *
 * Architecture note
 * -----------------
 * Items use `inBag: boolean` (same key as Game 1) so that the shared
 * `useKnapsackDnD` hook's TOGGLE_ITEM action works with both contexts.
 * The truck-specific extensions are `maxWeight`, `maxVolume`, and the
 * 3D DP solver. Everything else mirrors GameContext.
 */

const TruckContext = createContext(null);

const initialState = {
  mode: null,           // 'classic' | 'random' | 'custom'
  maxWeight: 0,
  maxVolume: 0,
  items: [],            // { id, name, emoji, weight, volume, value, inBag: boolean }
  optimalValue: 0,
  optimalItemIds: [],   // IDs of the optimal item set (from truckSolver traceback)
  hintsUsed: 0,
  gameStarted: false,
};

function truckReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const { mode, items, maxWeight, maxVolume } = action.payload;
      const gameItems = items.map((item) => ({ ...item, inBag: false }));
      const { optimalValue, optimalSet } = truckSolver(gameItems, maxWeight, maxVolume);
      return {
        ...state,
        mode,
        maxWeight,
        maxVolume,
        items: gameItems,
        optimalValue,
        optimalItemIds: optimalSet,
        hintsUsed: 0,
        gameStarted: true,
      };
    }

    // Shared action name with GameContext — works with useKnapsackDnD hook
    case 'TOGGLE_ITEM': {
      const { itemId, inBag } = action.payload;
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === itemId ? { ...item, inBag } : item
        ),
      };
    }

    case 'USE_HINT':
      return { ...state, hintsUsed: state.hintsUsed + 1 };

    case 'PACK_OPTIMAL_SOLUTION': {
      const optimalSet = new Set(state.optimalItemIds);
      return {
        ...state,
        items: state.items.map((item) => ({
          ...item,
          inBag: optimalSet.has(item.id),
        })),
      };
    }

    case 'RESET_BAG':
      return {
        ...state,
        items: state.items.map((item) => ({ ...item, inBag: false })),
      };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export function TruckProvider({ children }) {
  const [state, dispatch] = useReducer(truckReducer, initialState);

  const derived = useMemo(() => {
    const truckItems = state.items.filter((i) => i.inBag);
    const inventoryItems = state.items.filter((i) => !i.inBag);
    const currentWeight = truckItems.reduce((s, i) => s + i.weight, 0);
    const currentVolume = truckItems.reduce((s, i) => s + i.volume, 0);
    const currentValue = truckItems.reduce((s, i) => s + i.value, 0);
    const isOptimal =
      state.optimalValue > 0 && currentValue === state.optimalValue;

    return { truckItems, inventoryItems, currentWeight, currentVolume, currentValue, isOptimal };
  }, [state.items, state.optimalValue]);

  return (
    <TruckContext.Provider value={{ state, dispatch, ...derived }}>
      {children}
    </TruckContext.Provider>
  );
}

export function useTruck() {
  const context = useContext(TruckContext);
  if (!context) {
    throw new Error('useTruck must be used within a TruckProvider');
  }
  return context;
}
