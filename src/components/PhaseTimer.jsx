import { useEffect, useState } from 'react';
import { Timer } from 'lucide-react';

export default function PhaseTimer({ endsAt }) {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  if (!endsAt) return null;
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));
  const urgent = remaining <= 10;

  return (
    <div
      className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 font-mono text-sm tabular-nums ${
        urgent
          ? 'border-blood-600/60 bg-blood-600/15 text-blood-500'
          : 'border-white/10 bg-white/5 text-white/70'
      }`}
    >
      <Timer className="size-4" />
      {String(Math.floor(remaining / 60)).padStart(2, '0')}:{String(remaining % 60).padStart(2, '0')}
    </div>
  );
}
