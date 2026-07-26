import { AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function Toast() {
  const { toast, setToast } = useGame();
  if (!toast) return null;

  const error = toast.type === 'error';

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-[min(92vw,26rem)] -translate-x-1/2 animate-fade-up">
      <div
        className={`flex items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl backdrop-blur ${
          error
            ? 'border-blood-600/50 bg-blood-600/15 text-red-200'
            : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-200'
        }`}
      >
        {error ? (
          <AlertTriangle className="mt-0.5 size-5 shrink-0" />
        ) : (
          <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
        )}
        <p className="flex-1 text-sm leading-snug">{toast.text}</p>
        <button
          type="button"
          onClick={() => setToast(null)}
          className="rounded p-0.5 text-white/50 transition hover:text-white"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
