import './ProgressBar.css';

/**
 * ProgressBar — Animated weight/capacity gauge.
 * Turns green below 80%, yellow at 80–99%, red at 100%.
 */
export default function ProgressBar({ current, max, danger = false }) {
  const pct = max > 0 ? Math.min((current / max) * 100, 100) : 0;
  const level = danger ? 'danger' : pct >= 100 ? 'full' : pct >= 80 ? 'warn' : 'ok';

  return (
    <div className={`progress ${danger ? 'progress--danger' : ''}`} id="weight-progress">
      <div
        className={`progress__fill progress__fill--${level}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
