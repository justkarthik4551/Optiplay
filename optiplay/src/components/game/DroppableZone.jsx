import { useDroppable } from '@dnd-kit/core';
import './DroppableZone.css';

/**
 * DroppableZone — A drop target (Inventory or Bag).
 */
export default function DroppableZone({ id, label, itemCount, isBag = false, flash = false, children }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  const classNames = [
    'zone',
    isBag ? 'zone--bag' : 'zone--inventory',
    isOver ? 'zone--over' : '',
    flash ? 'zone--flash' : '',
  ].filter(Boolean).join(' ');

  return (
    <div ref={setNodeRef} className={classNames} id={id}>
      <div className="zone__header">
        <h3 className="zone__label">
          {isBag ? '🎒' : '📦'} {label}
        </h3>
        <span className="zone__count">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
      </div>
      <div className="zone__content">
        {children}
      </div>
    </div>
  );
}
