import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTruck } from '../context/TruckContext';
import { TRUCK_ITEMS, TRUCK_MAX_WEIGHT, TRUCK_MAX_VOLUME } from '../utils/truckItems';
import './GameConfig.css';        // shared config page layout styles
import './TruckConfig.css';       // truck-specific overrides

// ── Random item name pool (Indian household / moving context) ──
const RANDOM_TRUCK_NAMES = [
  { name: 'Refrigerator',    emoji: '🧊' }, { name: 'Washing Machine', emoji: '🫧' },
  { name: 'LED TV',          emoji: '📺' }, { name: 'Sofa',            emoji: '🛋️' },
  { name: 'Dining Table',    emoji: '🍽️' }, { name: 'Microwave',       emoji: '🍲' },
  { name: 'Air Conditioner', emoji: '❄️' }, { name: 'Study Desk',      emoji: '🖥️' },
  { name: 'Bookshelf',       emoji: '📚' }, { name: 'Cricket Kit Bag', emoji: '🏏' },
  { name: 'Suitcase',        emoji: '🧳' }, { name: 'Exercise Bike',   emoji: '🚲' },
  { name: 'Guitar',          emoji: '🎸' }, { name: 'Aquarium',        emoji: '🐠' },
  { name: 'Coffee Table',    emoji: '☕' }, { name: 'Floor Lamp',      emoji: '💡' },
  { name: 'Bean Bag',        emoji: '🛋️' }, { name: 'Wall Cabinet',    emoji: '🗄️' },
  { name: 'Treadmill',       emoji: '🏃' }, { name: 'Computer Setup',  emoji: '💻' },
];

function generateRandomTruckItems() {
  const count = 8 + Math.floor(Math.random() * 8); // 8–15 items
  const shuffled = [...RANDOM_TRUCK_NAMES].sort(() => Math.random() - 0.5);
  const items = shuffled.slice(0, count).map((item, idx) => ({
    id: `random-${idx}`,
    name: item.name,
    emoji: item.emoji,
    weight: 5 + Math.floor(Math.random() * 46),      // 5–50 kg
    volume: 3 + Math.floor(Math.random() * 28),       // 3–30 cu.ft.
    value:  100 + Math.floor(Math.random() * 901),    // ₹100–₹1000
  }));
  const totalW = items.reduce((s, i) => s + i.weight, 0);
  const totalU = items.reduce((s, i) => s + i.volume, 0);
  const maxWeight = Math.max(Math.floor(totalW * (0.4 + Math.random() * 0.25)), 10);
  const maxVolume  = Math.max(Math.floor(totalU * (0.4 + Math.random() * 0.25)), 5);
  return { items, maxWeight, maxVolume };
}

const MODES = [
  {
    id: 'classic',
    label: 'Classic',
    emoji: '📋',
    desc: '12 Indian household items. 100 kg · 60 cu.ft. truck.',
    default: true,
  },
  {
    id: 'random',
    label: 'Random',
    emoji: '🎲',
    desc: 'Fresh random cargo every time. 8–15 items.',
  },
  {
    id: 'custom',
    label: 'Custom',
    emoji: '✏️',
    desc: 'Define your own items, weights, volumes, and truck size.',
  },
];

export default function TruckConfig() {
  const navigate = useNavigate();
  const { dispatch } = useTruck();
  const [selectedMode, setSelectedMode] = useState('classic');

  // Custom mode state
  const [customItems, setCustomItems] = useState([
    { name: '', weight: '', volume: '', value: '', emoji: '📦' },
    { name: '', weight: '', volume: '', value: '', emoji: '📦' },
  ]);
  const [customMaxWeight, setCustomMaxWeight] = useState('');
  const [customMaxVolume, setCustomMaxVolume] = useState('');
  const [customError, setCustomError] = useState('');

  const addCustomRow = () => {
    if (customItems.length >= 20) return;
    setCustomItems([...customItems, { name: '', weight: '', volume: '', value: '', emoji: '📦' }]);
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
    const mw = parseInt(customMaxWeight);
    const mu = parseInt(customMaxVolume);
    if (!mw || mw <= 0) return 'Truck max weight must be a positive number.';
    if (!mu || mu <= 0) return 'Truck max volume must be a positive number.';
    for (let i = 0; i < customItems.length; i++) {
      const item = customItems[i];
      if (!item.name.trim()) return `Item ${i + 1}: Name is required.`;
      if (!parseInt(item.weight) || parseInt(item.weight) <= 0)
        return `Item ${i + 1}: Weight must be a positive number.`;
      if (!parseInt(item.volume) || parseInt(item.volume) <= 0)
        return `Item ${i + 1}: Volume must be a positive number.`;
      if (!parseInt(item.value) || parseInt(item.value) <= 0)
        return `Item ${i + 1}: Value must be a positive number.`;
    }
    return null;
  };

  const handleStartGame = () => {
    let items, maxWeight, maxVolume;

    if (selectedMode === 'classic') {
      items = TRUCK_ITEMS;
      maxWeight = TRUCK_MAX_WEIGHT;
      maxVolume  = TRUCK_MAX_VOLUME;
    } else if (selectedMode === 'random') {
      const gen = generateRandomTruckItems();
      items = gen.items; maxWeight = gen.maxWeight; maxVolume = gen.maxVolume;
    } else {
      const err = validateCustom();
      if (err) { setCustomError(err); return; }
      items = customItems.map((item, idx) => ({
        id: `custom-${idx}`,
        name: item.name.trim(),
        emoji: item.emoji,
        weight: parseInt(item.weight),
        volume: parseInt(item.volume),
        value:  parseInt(item.value),
      }));
      maxWeight = parseInt(customMaxWeight);
      maxVolume  = parseInt(customMaxVolume);
    }

    dispatch({ type: 'START_GAME', payload: { mode: selectedMode, items, maxWeight, maxVolume } });
    navigate('/pack-the-truck/play');
  };

  return (
    <main className="config" id="truck-config-page">
      <div className="config__header animate-fade-in">
        <button className="config__back" onClick={() => navigate('/')}>
          ← Back to Hub
        </button>
        <h2 className="config__title">🚚 Pack the Truck!</h2>
        <p className="config__subtitle">Choose your challenge mode</p>
      </div>

      {/* Mode Cards */}
      <div className="config__modes animate-fade-in delay-1">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            className={`config__mode-card glass ${selectedMode === mode.id ? 'config__mode-card--active' : ''}`}
            onClick={() => setSelectedMode(mode.id)}
            id={`truck-mode-${mode.id}`}
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

          <div className="truck-config__capacities">
            <div className="config__custom-capacity">
              <label>Max Weight (kg)</label>
              <input type="number" min="1" placeholder="e.g. 100" value={customMaxWeight}
                onChange={(e) => { setCustomMaxWeight(e.target.value); setCustomError(''); }}
                className="config__input" id="truck-max-weight-input" />
            </div>
            <div className="config__custom-capacity">
              <label>Max Volume (cu.ft.)</label>
              <input type="number" min="1" placeholder="e.g. 60" value={customMaxVolume}
                onChange={(e) => { setCustomMaxVolume(e.target.value); setCustomError(''); }}
                className="config__input" id="truck-max-volume-input" />
            </div>
          </div>

          <div className="config__custom-table">
            <div className="config__custom-row config__custom-row--header truck-config__row--header">
              <span>#</span>
              <span>Name</span>
              <span>Weight (kg)</span>
              <span>Volume (cu.ft.)</span>
              <span>Value (₹)</span>
              <span></span>
            </div>
            {customItems.map((item, idx) => (
              <div key={idx} className="config__custom-row truck-config__row">
                <span className="config__custom-idx">{idx + 1}</span>
                <input type="text" placeholder="Item name" value={item.name}
                  onChange={(e) => updateCustomItem(idx, 'name', e.target.value)}
                  className="config__input" />
                <input type="number" min="1" placeholder="kg" value={item.weight}
                  onChange={(e) => updateCustomItem(idx, 'weight', e.target.value)}
                  className="config__input config__input--sm" />
                <input type="number" min="1" placeholder="ft³" value={item.volume}
                  onChange={(e) => updateCustomItem(idx, 'volume', e.target.value)}
                  className="config__input config__input--sm" />
                <input type="number" min="1" placeholder="₹" value={item.value}
                  onChange={(e) => updateCustomItem(idx, 'value', e.target.value)}
                  className="config__input config__input--sm" />
                <button className="config__remove-btn" onClick={() => removeCustomRow(idx)}
                  disabled={customItems.length <= 2} title="Remove item">✕</button>
              </div>
            ))}
          </div>

          <button className="config__add-btn" onClick={addCustomRow}
            disabled={customItems.length >= 20}>
            + Add Item {customItems.length >= 20 && '(max 20)'}
          </button>
          {customError && <p className="config__error">{customError}</p>}
        </div>
      )}

      <button className="config__start-btn animate-fade-in delay-2"
        onClick={handleStartGame} id="start-truck-game-btn">
        Start Game ▶
      </button>
    </main>
  );
}
