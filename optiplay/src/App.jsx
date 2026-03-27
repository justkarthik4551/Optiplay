import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Navbar from './components/layout/Navbar';
import Hub from './pages/Hub';
import GameConfig from './pages/GameConfig';
import PackThatBag from './pages/PackThatBag';

export default function App() {
  return (
    <Router>
      <GameProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hub />} />
          <Route path="/pack-that-bag/config" element={<GameConfig />} />
          <Route path="/pack-that-bag/play" element={<PackThatBag />} />
        </Routes>
      </GameProvider>
    </Router>
  );
}
