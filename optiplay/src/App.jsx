import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import { TruckProvider } from './context/TruckContext';
import Navbar from './components/layout/Navbar';
import Hub from './pages/Hub';
import GameConfig from './pages/GameConfig';
import PackThatBag from './pages/PackThatBag';
import TruckConfig from './pages/TruckConfig';
import PackTheTruck from './pages/PackTheTruck';

/**
 * App — Root routing shell.
 *
 * Architecture note: each game owns its own context provider, scoped to
 * only the routes that need it. This prevents state leakage between games
 * and keeps context trees lean.
 */
export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Hub */}
        <Route path="/" element={<Hub />} />

        {/* Game 1 — Pack That Bag (1-constraint knapsack) */}
        <Route path="/pack-that-bag/*" element={
          <GameProvider>
            <Routes>
              <Route path="config" element={<GameConfig />} />
              <Route path="play"   element={<PackThatBag />} />
            </Routes>
          </GameProvider>
        } />

        {/* Game 2 — Pack the Truck (2-constraint knapsack) */}
        <Route path="/pack-the-truck/*" element={
          <TruckProvider>
            <Routes>
              <Route path="config" element={<TruckConfig />} />
              <Route path="play"   element={<PackTheTruck />} />
            </Routes>
          </TruckProvider>
        } />
      </Routes>
    </Router>
  );
}
