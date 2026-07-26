import { useGame } from '../context/GameContext';

export default function Loader() {
  const { pending } = useGame();
  if (!pending) return null;
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/20 border-t-white" />
      <p className="mt-4 text-sm font-semibold text-white/90">Loading...</p>
    </div>
  );
}
