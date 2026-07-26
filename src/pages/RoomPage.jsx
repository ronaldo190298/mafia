import { useEffect, useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PHASES } from '../lib/constants';
import Lobby from '../components/Lobby';
import GameBoard from '../components/GameBoard';

export default function RoomPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { state, actions, connected, setToast } = useGame();
  const [checking, setChecking] = useState(!state);

  useEffect(() => {
    if (state?.roomId === roomId) {
      setChecking(false);
      return;
    }
    if (!connected) return;
    let cancelled = false;
    (async () => {
      const res = await actions.sync(roomId);
      if (cancelled) return;
      if (res?.error) {
        setToast({ type: 'error', text: `${res.error} Rejoin with your name.` });
        navigate(`/?room=${roomId}`, { replace: true });
      }
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [roomId, state?.roomId, connected, actions, navigate, setToast]);

  if (!connected && !state) {
    return <Centered text="Connecting to the game server..." />;
  }
  if (checking || !state) {
    return <Centered text="Entering the room..." />;
  }
  if (state.roomId !== roomId) {
    return <Navigate to={`/room/${state.roomId}`} replace />;
  }

  return state.phase === PHASES.LOBBY ? <Lobby /> : <GameBoard />;
}

function Centered({ text }) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="flex items-center gap-3 text-white/60">
        <Loader2 className="size-5 animate-spin" />
        {text}
      </div>
    </main>
  );
}
