import { Navigate, Route, Routes } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Landing from './pages/Landing';
import RoomPage from './pages/RoomPage';
import Toast from './components/Toast';
import Loader from './components/Loader';

export default function App() {
  return (
    <GameProvider>
      <div className="min-h-full bg-night-950 bg-[radial-gradient(ellipse_at_top,#1b2039_0%,#06070f_60%)]">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/room/:roomId" element={<RoomPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toast />
        <Loader />
      </div>
    </GameProvider>
  );
}
