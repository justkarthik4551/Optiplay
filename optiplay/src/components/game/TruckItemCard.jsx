import './TruckItemCard.css';

/**
 * TruckItemCard — Item card for the Pack the Truck game.
 *
 * Extends ItemCard (Game 1) by showing a third stat: volume.
 * Left-border colour encodes volume density (compact → bulky).
 *
 * @param {{ id, name, emoji, weight, volume, value }} item
 * @param {number} maxWeight   - heaviest item's weight (for width scaling)
 * @param {number} maxVolume   - largest item's volume (for density border)
 * @param {boolean} isDragging
 */
export default function TruckItemCard({ item, maxWeight = 10, maxVolume = 30, isDragging = false }) {
  const BASE_WIDTH = 120;
  const SCALE_FACTOR = 80;
  const cardWidth = BASE_WIDTH + (item.weight / maxWeight) * SCALE_FACTOR;

  // Volume density → border hue: green (compact) to amber (bulky)
  const densityRatio = maxVolume > 0 ? item.volume / maxVolume : 0;
  const borderColor = densityRatio < 0.35
    ? 'var(--accent-success)'        // compact — green
    : densityRatio < 0.65
      ? '#f59e0b'                    // medium — amber
      : 'var(--accent-danger)';      // bulky — red

  return (
    <div
      className={`truck-card ${isDragging ? 'truck-card--dragging' : ''}`}
      style={{ width: `${cardWidth}px`, borderLeftColor: borderColor }}
      id={`item-${item.id}`}
    >
      <span className="truck-card__emoji">{item.emoji}</span>
      <span className="truck-card__name">{item.name}</span>
      <div className="truck-card__stats">
        <span className="truck-card__value">₹{item.value}</span>
        <span className="truck-card__meta">{item.weight} kg · {item.volume} cu.ft.</span>
      </div>
    </div>
  );
}
