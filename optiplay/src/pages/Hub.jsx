import { useNavigate } from 'react-router-dom';
import GameCard from '../components/common/GameCard';
import './Hub.css';

const GAMES = [
  {
    id: 'pack-that-bag',
    title: 'Pack That Bag!',
    tagline: 'Can you pack the most valuable bag? A knapsack optimization challenge.',
    emoji: '🎒',
    available: true,
    route: '/pack-that-bag/config',
  },
  {
    id: 'traveling-salesman',
    title: 'Find the Route',
    tagline: 'Discover the shortest path visiting every city. The classic TSP challenge.',
    emoji: '🗺️',
    available: false,
  },
  {
    id: 'job-scheduler',
    title: 'Schedule It!',
    tagline: 'Assign jobs to machines to minimize total time. A scheduling puzzle.',
    emoji: '📅',
    available: false,
  },
];

export default function Hub() {
  const navigate = useNavigate();

  return (
    <main className="hub" id="hub-page">
      {/* Background decoration orbs */}
      <div className="hub__orb hub__orb--1" />
      <div className="hub__orb hub__orb--2" />
      <div className="hub__orb hub__orb--3" />

      {/* Hero Section */}
      <section className="hub__hero animate-fade-in">
        <p className="hub__badge">✨ Operations Research, Gamified</p>
        <h1 className="hub__title">
          Welcome to <span className="hub__title-accent">OptiPlay</span>
        </h1>
        <p className="hub__subtitle">
          Master Operations Research through play. Drag, drop, and discover optimal solutions to classic optimization problems.
        </p>
        <p className="hub__affiliation">
          Department of Management Studies · IIT Roorkee
        </p>
      </section>

      {/* Divider */}
      <div className="hub__divider">
        <span className="hub__divider-dot" />
        <span className="hub__divider-line" />
        <span className="hub__divider-text">Choose a Challenge</span>
        <span className="hub__divider-line" />
        <span className="hub__divider-dot" />
      </div>

      {/* Game Grid */}
      <section className="hub__grid" id="game-grid">
        {GAMES.map((game, index) => (
          <div key={game.id} className={`delay-${index + 1}`}>
            <GameCard
              title={game.title}
              tagline={game.tagline}
              emoji={game.emoji}
              available={game.available}
              onClick={() => game.route && navigate(game.route)}
            />
          </div>
        ))}
      </section>

      {/* Stats / Social Proof */}
      <section className="hub__stats animate-fade-in delay-4">
        <div className="hub__stat glass">
          <span className="hub__stat-value">1</span>
          <span className="hub__stat-label">Game Live</span>
        </div>
        <div className="hub__stat glass">
          <span className="hub__stat-value">OR</span>
          <span className="hub__stat-label">Powered by Optimization</span>
        </div>
        <div className="hub__stat glass">
          <span className="hub__stat-value">0</span>
          <span className="hub__stat-label">Setup Required</span>
        </div>
      </section>

      {/* Footer */}
      <footer className="hub__footer animate-fade-in delay-5">
        <p>
          Built with 💜 as an MBA (IS/IT) Project · Powered by Vibe Coding
        </p>
        <p className="hub__footer-credit">
          © 2026 · Department of Management Studies · Indian Institute of Technology, Roorkee
        </p>
      </footer>
    </main>
  );
}
