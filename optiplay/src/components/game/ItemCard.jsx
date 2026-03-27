import './ItemCard.css';

/**
 * ItemCard — A draggable item block.
 * Width is proportional to weight (ref: docs/05_UI_UX_Design_System.md §6).
 *
 * @param {{ id, name, emoji, weight, value }} item
 * @param {number} maxWeight — the heaviest item's weight (for proportional scaling)
 * @param {boolean} isDragging — true when this card is being dragged
 */
export default function ItemCard({ item, maxWeight = 10, isDragging = false }) {
  const BASE_WIDTH = 110;
  const SCALE_FACTOR = 90;
  const cardWidth = BASE_WIDTH + (item.weight / maxWeight) * SCALE_FACTOR;

  return (
    <div
      className={`item-card ${isDragging ? 'item-card--dragging' : ''}`}
      style={{ width: `${cardWidth}px` }}
      id={`item-${item.id}`}
    >
      <span className="item-card__emoji">{item.emoji}</span>
      <span className="item-card__name">{item.name}</span>
      <div className="item-card__stats">
        <span className="item-card__value">${item.value}</span>
        <span className="item-card__weight">{item.weight} lb</span>
      </div>
    </div>
  );
}
