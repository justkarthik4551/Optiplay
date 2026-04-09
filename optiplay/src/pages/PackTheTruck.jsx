import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, closestCenter } from '@dnd-kit/core';

import { useTruck } from '../context/TruckContext';
import { truckHintEngine } from '../utils/truckHintEngine';
import { useKnapsackDnD } from '../hooks/useKnapsackDnD';

import DroppableZone from '../components/game/DroppableZone';
import DraggableItem from '../components/game/DraggableItem';
import TruckItemCard from '../components/game/TruckItemCard';
import ProgressBar from '../components/common/ProgressBar';
import HintToast from '../components/game/HintToast';
import VictoryModal from '../components/game/VictoryModal';

import './PackThatBag.css';    // shared game page layout styles
import './PackTheTruck.css';   // truck-specific overrides

export default function PackTheTruck() {
  const navigate = useNavigate();
  const {
    state, dispatch,
    truckItems, inventoryItems,
    currentWeight, currentVolume, currentValue,
  } = useTruck();

  const [hint, setHint] = useState(null);
  const [showVictory, setShowVictory] = useState(false);
  const [victoryShown, setVictoryShown] = useState(false);
  const [usedAutoSolve, setUsedAutoSolve] = useState(false);

  const maxWeight = Math.max(...state.items.map((i) => i.weight), 1);
  const maxVolume = Math.max(...state.items.map((i) => i.volume), 1);

  // ── Shared DnD hook — same as PackThatBag but with 2-constraint canAdd ──
  const { activeId, capacityFlash, sensors, handleDragStart, handleDragEnd } =
    useKnapsackDnD({
      items: state.items,
      optimalValue: state.optimalValue,
      dispatch,
      containerZoneId: 'truck-zone',
      inventoryZoneId: 'inventory-zone-truck',
      canAdd: (item) =>
        currentWeight + item.weight <= state.maxWeight &&
        currentVolume + item.volume <= state.maxVolume,
      onVictory: () => {
        if (!victoryShown) {
          setTimeout(() => {
            setShowVictory(true);
            setVictoryShown(true);
          }, 500);
        }
      },
    });

  const activeItem = activeId ? state.items.find((i) => i.id === activeId) : null;

  // Redirect if no game started
  if (!state.gameStarted) {
    return (
      <main className="game__empty">
        <p>No game in progress.</p>
        <button className="game__go-config" onClick={() => navigate('/pack-the-truck/config')}>
          Go to Config
        </button>
      </main>
    );
  }

  const handleHint = useCallback(() => {
    const result = truckHintEngine(state.items, state.maxWeight, state.maxVolume);
    setHint(result);
    dispatch({ type: 'USE_HINT' });
  }, [state.items, state.maxWeight, state.maxVolume, dispatch]);

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
    setTimeout(() => {
      setShowVictory(true);
      setVictoryShown(true);
    }, 400);
  };

  const handlePlayAgain = () => {
    setShowVictory(false);
    setVictoryShown(false);
    setUsedAutoSolve(false);
    navigate('/pack-the-truck/config');
  };

  const weightPct = state.maxWeight > 0 ? (currentWeight / state.maxWeight) * 100 : 0;
  const volumePct = state.maxVolume > 0 ? (currentVolume / state.maxVolume) * 100 : 0;

  return (
    <main className="game" id="truck-game-page">
      {/* Header bar */}
      <div className="game__header animate-fade-in">
        <button className="game__back" onClick={() => navigate('/pack-the-truck/config')}>
          ← Config
        </button>
        <h2 className="game__title">
          🚚 Pack the Truck! <span className="game__mode-badge">{state.mode}</span>
        </h2>
        <div className="game__actions">
          <button className="game__hint-btn" onClick={handleHint} id="truck-hint-btn">
            💡 Hint
          </button>
          <button className="game__optimal-btn" onClick={handleShowOptimal} id="truck-optimal-btn">
            ✨ Show Optimal
          </button>
          <button className="game__reset-btn" onClick={handleReset} id="truck-reset-btn">
            🔄 Reset
          </button>
        </div>
      </div>

      {/* Dual Stats bar */}
      <div className="game__stats game__stats--truck animate-fade-in delay-1">
        <div className="game__stat-item">
          <span className="game__stat-label">Weight</span>
          <ProgressBar current={currentWeight} max={state.maxWeight} danger={capacityFlash && weightPct >= 100} />
          <span className="game__stat-value">{currentWeight} / {state.maxWeight} kg</span>
        </div>
        <div className="game__stat-item game__stat-item--volume">
          <span className="game__stat-label">Volume</span>
          <ProgressBar current={currentVolume} max={state.maxVolume} danger={capacityFlash && volumePct >= 100} />
          <span className="game__stat-value">{currentVolume} / {state.maxVolume} cu.ft.</span>
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
          <DroppableZone
            id="inventory-zone-truck"
            label="Inventory"
            itemCount={inventoryItems.length}
          >
            <div className="game__items-grid">
              {inventoryItems.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                  <TruckItemCard item={item} maxWeight={maxWeight} maxVolume={maxVolume}
                    isDragging={activeId === item.id} />
                </DraggableItem>
              ))}
              {inventoryItems.length === 0 && (
                <p className="game__zone-empty">All items loaded!</p>
              )}
            </div>
          </DroppableZone>

          {/* Truck */}
          <DroppableZone
            id="truck-zone"
            label="Your Truck"
            icon="🚚"
            isBag
            flash={capacityFlash}
            itemCount={truckItems.length}
          >
            <div className="game__items-grid">
              {truckItems.map((item) => (
                <DraggableItem key={item.id} id={item.id}>
                  <TruckItemCard item={item} maxWeight={maxWeight} maxVolume={maxVolume}
                    isDragging={activeId === item.id} />
                </DraggableItem>
              ))}
              {truckItems.length === 0 && (
                <p className="game__zone-empty">Drag items here</p>
              )}
            </div>
          </DroppableZone>
        </div>

        <DragOverlay>
          {activeItem ? (
            <TruckItemCard item={activeItem} maxWeight={maxWeight} maxVolume={maxVolume} isDragging />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Hint Toast — shared component */}
      <HintToast hint={hint} onClose={() => setHint(null)} />

      {/* Victory Modal — shared component with extra volume stat */}
      <VictoryModal
        show={showVictory}
        value={currentValue}
        weight={currentWeight}
        capacity={state.maxWeight}
        volumeUsed={currentVolume}
        maxVolume={state.maxVolume}
        hintsUsed={state.hintsUsed}
        mode={state.mode}
        autoSolved={usedAutoSolve}
        onClose={() => setShowVictory(false)}
        onPlayAgain={handlePlayAgain}
      />
    </main>
  );
}
