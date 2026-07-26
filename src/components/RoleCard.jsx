import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { ROLE_INFO } from '../lib/constants';

export default function RoleCard({ role, alive }) {
  const [hidden, setHidden] = useState(false);
  const info = ROLE_INFO[role];
  if (!info) return null;

  return (
    <div className={`rounded-xl border border-white/10 bg-night-800/70 p-4 ring-1 ${info.ring}`}>
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
          Your secret role
        </span>
        <button
          type="button"
          onClick={() => setHidden((h) => !h)}
          className="text-white/40 transition hover:text-white"
          title={hidden ? 'Show role' : 'Hide role'}
        >
          {hidden ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      {hidden ? (
        <p className="mt-2 text-2xl font-bold tracking-tight text-white/20">HIDDEN</p>
      ) : (
        <>
          <p className={`mt-1 text-2xl font-bold tracking-tight ${info.color}`}>{info.label}</p>
          <p className="mt-1 text-sm text-white/50">{info.tagline}</p>
        </>
      )}
      {!alive && (
        <p className="mt-3 rounded-lg bg-black/40 px-3 py-2 text-xs text-white/50">
          You are dead. You can watch everything but cannot speak or vote.
        </p>
      )}
    </div>
  );
}
