import './GameCard.css';

export default function GameCard({ title, tagline, emoji, available, onClick }) {
  return (
    <button
      className={`game-card glass animate-scale-pop ${!available ? 'game-card--disabled' : ''}`}
      onClick={available ? onClick : undefined}
      disabled={!available}
      id={`game-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="game-card__icon">{emoji}</div>
      <h3 className="game-card__title">{title}</h3>
      <p className="game-card__tagline">{tagline}</p>
      <div className="game-card__action">
        {available ? (
          <span className="game-card__btn">
            Play <span className="game-card__arrow">▶</span>
          </span>
        ) : (
          <span className="game-card__coming-soon">Coming Soon</span>
        )}
      </div>
    </button>
  );
}
