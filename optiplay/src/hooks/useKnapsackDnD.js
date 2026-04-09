import { useState } from 'react';
import {
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

/**
 * useKnapsackDnD — Generic drag-and-drop logic for OptiPlay knapsack games.
 *
 * Encapsulates sensor setup, drag state, capacity-exceeded flash, and
 * victory detection so that every knapsack game page stays lean.
 *
 * Contract
 * --------
 * - All items in `items` must have an `inBag: boolean` field.
 * - Both context reducers must accept TOGGLE_ITEM with payload `{ itemId, inBag }`.
 * - The caller provides a `canAdd(item)` predicate that checks all constraints.
 *
 * @param {object}   cfg
 * @param {Array}    cfg.items            - Full item array (game context state.items)
 * @param {number}   cfg.optimalValue     - Winning value threshold
 * @param {Function} cfg.dispatch         - Context dispatch
 * @param {string}   cfg.containerZoneId  - Drop-zone id for the container  (e.g. 'bag-zone')
 * @param {string}   cfg.inventoryZoneId  - Drop-zone id for inventory (e.g. 'inventory-zone')
 * @param {Function} cfg.canAdd           - (item) => boolean — all constraints check
 * @param {Function} cfg.onVictory        - Called once when player hits optimalValue
 *
 * @returns {{ activeId, capacityFlash, sensors, handleDragStart, handleDragEnd }}
 */
export function useKnapsackDnD({
  items,
  optimalValue,
  dispatch,
  containerZoneId,
  inventoryZoneId,
  canAdd,
  onVictory,
}) {
  const [activeId, setActiveId] = useState(null);
  const [capacityFlash, setCapacityFlash] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const item = items.find((i) => i.id === active.id);
    if (!item) return;

    if (over.id === containerZoneId && !item.inBag) {
      // Constraint check — delegate to caller
      if (!canAdd(item)) {
        setCapacityFlash(true);
        setTimeout(() => setCapacityFlash(false), 400);
        return;
      }

      dispatch({ type: 'TOGGLE_ITEM', payload: { itemId: item.id, inBag: true } });

      // Optimistic victory check (state update from dispatch is async)
      const newValue = items.reduce((sum, i) => {
        const effectivelyInBag = i.id === item.id ? true : i.inBag;
        return effectivelyInBag ? sum + i.value : sum;
      }, 0);

      if (newValue === optimalValue) {
        onVictory();
      }
    } else if (over.id === inventoryZoneId && item.inBag) {
      dispatch({ type: 'TOGGLE_ITEM', payload: { itemId: item.id, inBag: false } });
    }
  };

  return { activeId, capacityFlash, sensors, handleDragStart, handleDragEnd };
}
