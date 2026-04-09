import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCenter,
} from '@dnd-kit/core';

import { useGame } from '../context/GameContext';
import { hintEngine } from '../utils/hintEngine';
import DroppableZone from '../components/game/DroppableZone';
import DraggableItem from '../components/game/DraggableItem';
import ItemCard from '../components/game/ItemCard';
import ProgressBar from '../components/common/ProgressBar';
import HintToast from '../components/game/HintToast';
import VictoryModal from '../components/game/VictoryModal';
import './PackThatBag.css';

export default function PackThatBag() {
  const navigate = useNavigate();
  const { state, dispatch, bagItems, inventoryItems, currentWeight, currentValue, isOptimal } = useGame();
  const [activeId, setActiveId] = useState(null);
  const [capacityFlash, setCapacityFlash] = useState(false);
  const [hint, setHint] = useState(null);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryShown, setVictoryShown] = useState(false);
  const [usedAutoSolve, setUsedAutoSolve] = useState(false);

  const maxWeight = Math.max(...state.items.map(i => i.weight), 1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor)
  );

  // Redirect if no game
  if (!state.gameStarted) {
    return (
      <main className="game__empty">
        <p>No game in progress.</p>
        <button className="game__go-config" onClick={() => navigate('/pack-that-bag/config')}>
          Go to Config
        </button>
      </main>
    );
  }

  const activeItem = activeId ? state.items.find(i => i.id === activeId) : null;

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const item = state.items.find(i => i.id === active.id);
    if (!item) return;

    const targetZone = over.id;

    if (targetZone === 'bag-zone' && !item.inBag) {
      if (currentWeight + item.weight > state.capacity) {
        setCapacityFlash(true);
        setTimeout(() => setCapacityFlash(false), 400);
        return;
      }
      dispatch({ type: 'TOGGLE_ITEM', payload: { itemId: item.id, inBag: true } });

      // Check for victory AFTER adding this item
      const updatedItems = state.items.map(i =>
        i.id === item.id ? { ...i, inBag: true } : i
      );
      const newValue = updatedItems.filter(i => i.inBag).reduce((s, i) => s + i.value, 0);
      if (newValue === state.optimalValue && !victoryShown) {
        setTimeout(() => {
          setShowVictory(true);
          setVictoryShown(true);
        }, 500);
      }
    } else if (targetZone === 'inventory-zone' && item.inBag) {
      dispatch({ type: 'TOGGLE_ITEM', payload: { itemId: item.id, inBag: false } });
    }
  };

  const handleHint = useCallback(() => {
    const result = hintEngine(state.items, state.capacity);
    setHint(result);
    dispatch({ type: 'USE_HINT' });
  }, [state.items, state.capacity, dispatch]);

  const handleReset = () => {
    dispatch({ type: 'RESET_BAG' });
    setHint(null);
    setShowVictory(false);
    setVictoryShown(false);
    setUsedAutoSolve(false);
  };

  const handleShowOptimal = () => {
    dispatch({ type: 'PACK_OPTIMAL_SOLUTION' });
    setHint(null);
    setVictoryShown(false);
    setUsedAutoSolve(true);
    // Slight delay so the items animate into the bag first
    setTimeout(() => {
      setShowVictory(true);
      setVictoryShown(true);
    }, 400);
  };

  const handlePlayAgain = () => {
    setShowVictory(false);
    setVictoryShown(false);
    setUsedAutoSolve(false);
    navigate('/pack-that-bag/config');
  };

  return (
    <main className="game" id="game-page">
      {/* Header bar */}
      <div className="game__header animate-fade-in">
        <button className="game__back" onClick={() => navigate('/pack-that-bag/config')}>
          ← Config
        </button>
        <h2 className="game__title">
          🎒 Pack That Bag! <span className="game__mode-badge">{state.mode}</span>
        </h2>
        <div className="game__actions">
          <button className="game__hint-btn" onClick={handleHint} id="hint-btn">
            💡 Hint
          </button>
          <button className="game__optimal-btn" onClick={handleShowOptimal} id="optimal-btn">
            ✨ Show Optimal
          </button>
          <button className="game__reset-btn" onClick={handleReset} id="reset-btn">
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="game__stats animate-fade-in delay-1">
        <div className="game__stat-item">
          <span className="game__stat-label">Weight</span>
          <ProgressBar current={currentWeight} max={state.capacity} danger={capacityFlash} />
          <span className="game__stat-value">{currentWeight} / {state.capacity} kg</span>
        </div>
        <div className="game__stat-item game__stat-item--hints">
          <span className="game__stat-label">Hints</span>
          <span className="game__stat-value">{state.hintsUsed}</span>
        </div>
        <div className="game__stat-item game__stat-item--value">
          <span className="game__stat-label">Value</span>
          <span className="game__stat-value game__stat-value--big">₹{currentValue}</span>
        </div>
      </div>

      {/* DnD Zones */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="game__zones animate-fade-in delay-2">
          {/* Inventory */}
          <DroppableZone id="inventory-zone" label="Inventory" itemCount={inventoryItems.length}>
            <div className="game__items-grid">
              {inventoryItems.map(item => (
                <DraggableItem key={item.id} id={item.id}>
                  <ItemCard item={item} maxWeight={maxWeight} isDragging={activeId === item.id} />
                </DraggableItem>
              ))}
              {inventoryItems.length === 0 && (
                <p className="game__zone-empty">All items packed!</p>
              )}
            </div>
          </DroppableZone>

          {/* Bag */}
          <DroppableZone
            id="bag-zone"
            label="Your Bag"
            itemCount={bagItems.length}
            isBag
            flash={capacityFlash}
          >
            <div className="game__items-grid">
              {bagItems.map(item => (
                <DraggableItem key={item.id} id={item.id}>
                  <ItemCard item={item} maxWeight={maxWeight} isDragging={activeId === item.id} />
                </DraggableItem>
              ))}
              {bagItems.length === 0 && (
                <p className="game__zone-empty">Drag items here</p>
              )}
            </div>
          </DroppableZone>
        </div>

        <DragOverlay>
          {activeItem ? (
            <ItemCard item={activeItem} maxWeight={maxWeight} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Hint Toast */}
      <HintToast hint={hint} onClose={() => setHint(null)} />

      {/* Victory Modal */}
      <VictoryModal
        show={showVictory}
        value={currentValue}
        weight={currentWeight}
        capacity={state.capacity}
        hintsUsed={state.hintsUsed}
        mode={state.mode}
        autoSolved={usedAutoSolve}
        onClose={() => setShowVictory(false)}
        onPlayAgain={handlePlayAgain}
      />
    </main>
  );
}
