import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './VictoryModal.css';

/**
 * VictoryModal — Celebratory overlay with confetti effect.
 *
 * @param {boolean} show
 * @param {number} value — total value achieved
 * @param {number} weight — total weight used
 * @param {number} capacity
 * @param {number} hintsUsed
 * @param {number}   [volumeUsed]  - total volume used (Game 2 only)
 * @param {number}   [maxVolume]   - volume capacity (Game 2 only)
 * @param {boolean}  autoSolved
 * @param {Function} onClose
 * @param {Function} onPlayAgain
 */
export default function VictoryModal({ show, value, weight, capacity, volumeUsed, maxVolume, hintsUsed, mode, autoSolved, onClose, onPlayAgain }) {
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      // Generate confetti pieces
      const pieces = Array.from({ length: 60 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1.5,
        size: 6 + Math.random() * 8,
        color: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#c084fc'][i % 6],
        rotation: Math.random() * 360,
      }));
      setConfetti(pieces);
      // Delay modal entrance for dramatic effect
      setTimeout(() => setVisible(true), 200);
    } else {
      setVisible(false);
      setConfetti([]);
    }
  }, [show]);

  if (!show) return null;

  const rating = autoSolved ? '🤖 Auto-Solved' : (hintsUsed === 0 ? '⭐⭐⭐' : hintsUsed <= 2 ? '⭐⭐' : '⭐');
  const ratingLabel = autoSolved ? 'You used the AI to find the answer!' : (hintsUsed === 0 ? 'Perfect — No hints used!' : hintsUsed <= 2 ? 'Great job!' : 'Good effort!');

  return (
    <div className={`victory-overlay ${visible ? 'victory-overlay--visible' : ''}`}>
      {/* Confetti */}
      <div className="victory-confetti" aria-hidden="true">
        {confetti.map(p => (
          <span
            key={p.id}
            className="victory-confetti__piece"
            style={{
              left: `${p.left}%`,
              animationDelay: `${p.delay}s`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              transform: `rotate(${p.rotation}deg)`,
            }}
          />
        ))}
      </div>

      {/* Modal Card */}
      <div className={`victory-card glass ${visible ? 'victory-card--visible' : ''}`}>
        <div className="victory-card__celebration">🎉</div>
        <h2 className="victory-card__title">Optimal Solution Found!</h2>
        <p className="victory-card__rating">{rating}</p>
        <p className="victory-card__rating-label">{ratingLabel}</p>

        <div className="victory-card__stats">
          <div className="victory-card__stat">
            <span className="victory-card__stat-value">₹{value}</span>
            <span className="victory-card__stat-label">Total Value</span>
          </div>
          <div className="victory-card__stat">
            <span className="victory-card__stat-value">{weight}/{capacity}</span>
            <span className="victory-card__stat-label">Weight (kg)</span>
          </div>
          {volumeUsed != null && maxVolume != null && (
            <div className="victory-card__stat">
              <span className="victory-card__stat-value">{volumeUsed}/{maxVolume}</span>
              <span className="victory-card__stat-label">Volume (cu.ft.)</span>
            </div>
          )}
          <div className="victory-card__stat">
            <span className="victory-card__stat-value">{hintsUsed}</span>
            <span className="victory-card__stat-label">Hints Used</span>
          </div>
        </div>

        {/* Educational insight */}
        <div className="victory-card__insight">
          <h4>💡 The Algorithm Behind It</h4>
          <p>
            This problem was solved using <strong>Dynamic Programming</strong> — a technique
            that breaks the problem into overlapping sub-problems. The DP table has{' '}
            <strong>O(N × W)</strong> cells, where N is the number of items and W is the
            bag capacity. Each cell stores the best value achievable with a given subset
            and weight limit.
          </p>
        </div>

        <div className="victory-card__actions">
          <button className="victory-card__btn victory-card__btn--primary" onClick={onPlayAgain}>
            🔄 Play Again
          </button>
          <button className="victory-card__btn victory-card__btn--ghost" onClick={onClose}>
            👀 View Board
          </button>
          <button className="victory-card__btn victory-card__btn--ghost" onClick={() => navigate('/')}>
            🏠 Hub
          </button>
        </div>
      </div>
    </div>
  );
}
