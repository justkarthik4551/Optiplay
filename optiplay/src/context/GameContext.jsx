import { createContext, useContext, useReducer, useMemo } from 'react';
import { dpSolver } from '../utils/dpSolver';

/**
 * GameContext — Shared state for the Pack That Bag game.
 * Ref: docs/02_System_Architecture.md §3 (State Shape)
 */

const GameContext = createContext(null);

const initialState = {
  mode: null,           // 'classic' | 'random' | 'custom'
  capacity: 0,
  items: [],            // { id, name, weight, value, emoji, inBag: boolean }
  optimalValue: 0,
  hintsUsed: 0,
  gameStarted: false,
};

function gameReducer(state, action) {
  switch (action.type) {
    case 'START_GAME': {
      const { mode, items, capacity } = action.payload;
      const gameItems = items.map(item => ({ ...item, inBag: false }));
      const { optimalValue } = dpSolver(gameItems, capacity);
      return {
        ...state,
        mode,
        capacity,
        items: gameItems,
        optimalValue,
        hintsUsed: 0,
        gameStarted: true,
      };
    }

    case 'TOGGLE_ITEM': {
      const { itemId, inBag } = action.payload;
      return {
        ...state,
        items: state.items.map(item =>
          item.id === itemId ? { ...item, inBag } : item
        ),
      };
    }

    case 'USE_HINT':
      return { ...state, hintsUsed: state.hintsUsed + 1 };

    case 'RESET_BAG':
      return {
        ...state,
        items: state.items.map(item => ({ ...item, inBag: false })),
      };

    case 'RESET_GAME':
      return { ...initialState };

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Derived state (computed, not stored)
  const derived = useMemo(() => {
    const bagItems = state.items.filter(i => i.inBag);
    const inventoryItems = state.items.filter(i => !i.inBag);
    const currentWeight = bagItems.reduce((sum, i) => sum + i.weight, 0);
    const currentValue = bagItems.reduce((sum, i) => sum + i.value, 0);
    const isOptimal = state.optimalValue > 0 && currentValue === state.optimalValue;

    return { bagItems, inventoryItems, currentWeight, currentValue, isOptimal };
  }, [state.items, state.optimalValue]);

  return (
    <GameContext.Provider value={{ state, dispatch, ...derived }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
