import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';
import { CLASSIC_ITEMS, CLASSIC_CAPACITY } from '../utils/classicItems';
import './GameConfig.css';

// ── Random item name pool ──
const RANDOM_NAMES = [
  { name: 'Laptop', emoji: '💻' }, { name: 'Headphones', emoji: '🎧' },
  { name: 'Watch', emoji: '⌚' }, { name: 'Drone', emoji: '🚁' },
  { name: 'Guitar', emoji: '🎸' }, { name: 'Sneakers', emoji: '👟' },
  { name: 'Backpack', emoji: '🎒' }, { name: 'Sunglasses', emoji: '🕶️' },
  { name: 'Book Set', emoji: '📚' }, { name: 'Telescope', emoji: '🔭' },
  { name: 'Skateboard', emoji: '🛹' }, { name: 'Ukulele', emoji: '🪕' },
  { name: 'Perfume', emoji: '🧴' }, { name: 'Lamp', emoji: '💡' },
  { name: 'Binoculars', emoji: '🔍' }, { name: 'Blender', emoji: '🫙' },
  { name: 'Clock', emoji: '🕰️' }, { name: 'Jacket', emoji: '🧥' },
  { name: 'Toolkit', emoji: '🧰' }, { name: 'Vase', emoji: '🏺' },
];

function generateRandomItems() {
  const count = 8 + Math.floor(Math.random() * 8); // 8–15 items
  const shuffled = [...RANDOM_NAMES].sort(() => Math.random() - 0.5);
  const items = shuffled.slice(0, count).map((item, idx) => ({
    id: `random-${idx}`,
    name: item.name,
    emoji: item.emoji,
    weight: 1 + Math.floor(Math.random() * 10),   // 1–10 lbs
    value: 50 + Math.floor(Math.random() * 451),   // $50–$500
  }));
  const totalWeight = items.reduce((sum, i) => sum + i.weight, 0);
  const capacity = Math.floor(totalWeight * (0.4 + Math.random() * 0.3)); // 40–70%
  return { items, capacity: Math.max(capacity, 5) };
}

const MODES = [
  {
    id: 'classic',
    label: 'Classic',
    emoji: '📋',
    desc: 'The original 12 items from the OR textbook. 26 lbs bag.',
    default: true,
  },
  {
    id: 'random',
    label: 'Random',
    emoji: '🎲',
    desc: 'A fresh random problem every time. 8–15 items.',
  },
  {
    id: 'custom',
    label: 'Custom',
    emoji: '✏️',
    desc: 'Design your own items and bag capacity.',
  },
];

export default function GameConfig() {
  const navigate = useNavigate();
  const { dispatch } = useGame();
  const [selectedMode, setSelectedMode] = useState('classic');

  // Custom mode state
  const [customItems, setCustomItems] = useState([
    { name: '', weight: '', value: '', emoji: '📦' },
    { name: '', weight: '', value: '', emoji: '📦' },
  ]);
  const [customCapacity, setCustomCapacity] = useState('');
  const [customError, setCustomError] = useState('');

  const addCustomRow = () => {
    if (customItems.length >= 20) return;
    setCustomItems([...customItems, { name: '', weight: '', value: '', emoji: '📦' }]);
  };

  const removeCustomRow = (idx) => {
    if (customItems.length <= 2) return;
    setCustomItems(customItems.filter((_, i) => i !== idx));
  };

  const updateCustomItem = (idx, field, val) => {
    setCustomItems(customItems.map((item, i) =>
      i === idx ? { ...item, [field]: val } : item
    ));
    setCustomError('');
  };

  const validateCustom = () => {
    const cap = parseInt(customCapacity);
    if (!cap || cap <= 0) return 'Bag capacity must be a positive number.';

    for (let i = 0; i < customItems.length; i++) {
      const item = customItems[i];
      if (!item.name.trim()) return `Item ${i + 1}: Name is required.`;
      const w = parseInt(item.weight);
      const v = parseInt(item.value);
      if (!w || w <= 0) return `Item ${i + 1}: Weight must be a positive number.`;
      if (!v || v <= 0) return `Item ${i + 1}: Value must be a positive number.`;
    }
    return null;
  };

  const handleStartGame = () => {
    let items, capacity;

    if (selectedMode === 'classic') {
      items = CLASSIC_ITEMS;
      capacity = CLASSIC_CAPACITY;
    } else if (selectedMode === 'random') {
      const generated = generateRandomItems();
      items = generated.items;
      capacity = generated.capacity;
    } else {
      // Custom
      const err = validateCustom();
      if (err) {
        setCustomError(err);
        return;
      }
      items = customItems.map((item, idx) => ({
        id: `custom-${idx}`,
        name: item.name.trim(),
        emoji: item.emoji,
        weight: parseInt(item.weight),
        value: parseInt(item.value),
      }));
      capacity = parseInt(customCapacity);
    }

    dispatch({ type: 'START_GAME', payload: { mode: selectedMode, items, capacity } });
    navigate('/pack-that-bag/play');
  };

  return (
    <main className="config" id="game-config-page">
      <div className="config__header animate-fade-in">
        <button className="config__back" onClick={() => navigate('/')}>
          ← Back to Hub
        </button>
        <h2 className="config__title">
          🎒 Pack That Bag!
        </h2>
        <p className="config__subtitle">Choose your challenge mode</p>
      </div>

      {/* Mode Cards */}
      <div className="config__modes animate-fade-in delay-1">
        {MODES.map(mode => (
          <button
            key={mode.id}
            className={`config__mode-card glass ${selectedMode === mode.id ? 'config__mode-card--active' : ''}`}
            onClick={() => setSelectedMode(mode.id)}
            id={`mode-${mode.id}`}
          >
            <span className="config__mode-emoji">{mode.emoji}</span>
            <h3 className="config__mode-label">{mode.label}</h3>
            <p className="config__mode-desc">{mode.desc}</p>
            <span className={`config__mode-radio ${selectedMode === mode.id ? 'config__mode-radio--selected' : ''}`}>
              {selectedMode === mode.id ? '●' : '○'}
            </span>
          </button>
        ))}
      </div>

      {/* Custom Mode Form */}
      {selectedMode === 'custom' && (
        <div className="config__custom animate-slide-up">
          <h3 className="config__custom-title">Define Your Problem</h3>

          <div className="config__custom-capacity">
            <label>Bag Capacity (lbs)</label>
            <input
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={customCapacity}
              onChange={e => { setCustomCapacity(e.target.value); setCustomError(''); }}
              className="config__input"
              id="custom-capacity-input"
            />
          </div>

          <div className="config__custom-table">
            <div className="config__custom-row config__custom-row--header">
              <span>#</span>
              <span>Name</span>
              <span>Weight (lbs)</span>
              <span>Value ($)</span>
              <span></span>
            </div>
            {customItems.map((item, idx) => (
              <div key={idx} className="config__custom-row">
                <span className="config__custom-idx">{idx + 1}</span>
                <input
                  type="text"
                  placeholder="Item name"
                  value={item.name}
                  onChange={e => updateCustomItem(idx, 'name', e.target.value)}
                  className="config__input"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="lbs"
                  value={item.weight}
                  onChange={e => updateCustomItem(idx, 'weight', e.target.value)}
                  className="config__input config__input--sm"
                />
                <input
                  type="number"
                  min="1"
                  placeholder="$"
                  value={item.value}
                  onChange={e => updateCustomItem(idx, 'value', e.target.value)}
                  className="config__input config__input--sm"
                />
                <button
                  className="config__remove-btn"
                  onClick={() => removeCustomRow(idx)}
                  disabled={customItems.length <= 2}
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <button
            className="config__add-btn"
            onClick={addCustomRow}
            disabled={customItems.length >= 20}
          >
            + Add Item {customItems.length >= 20 && '(max 20)'}
          </button>

          {customError && (
            <p className="config__error">{customError}</p>
          )}
        </div>
      )}

      {/* Start Button */}
      <button
        className="config__start-btn animate-fade-in delay-2"
        onClick={handleStartGame}
        id="start-game-btn"
      >
        Start Game ▶
      </button>
    </main>
  );
}
