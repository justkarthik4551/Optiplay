import { useState, useEffect } from 'react';
import './HintToast.css';

/**
 * HintToast — Animated toast that slides in with the hint message.
 * Auto-hides after 6 seconds or on click.
 *
 * @param {{ type: 'add' | 'swap' | 'optimal', message: string } | null} hint
 * @param {Function} onClose
 */
export default function HintToast({ hint, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (hint) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for slide-out animation
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [hint, onClose]);

  if (!hint) return null;

  const icon = hint.type === 'add' ? '➕' : hint.type === 'swap' ? '🔀' : '🏆';
  const levelClass = hint.type === 'optimal' ? 'hint-toast--optimal' : '';

  const handleClick = () => {
    setVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`hint-toast ${levelClass} ${visible ? 'hint-toast--visible' : ''}`} onClick={handleClick}>
      <span className="hint-toast__icon">{icon}</span>
      <div className="hint-toast__body">
        <span className="hint-toast__label">
          {hint.type === 'optimal' ? 'CONGRATULATIONS' : 'HINT'}
        </span>
        <p className="hint-toast__message">{hint.message}</p>
      </div>
      <span className="hint-toast__close">✕</span>
    </div>
  );
}
