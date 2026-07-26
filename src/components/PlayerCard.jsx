import { Bot, Crown, Skull, User, WifiOff } from 'lucide-react';
import { ROLE_INFO } from '../lib/constants';

export default function PlayerCard({
  player,
  selectable = false,
  selected = false,
  onSelect,
  badge = null,
  isYou = false,
}) {
  const role = player.role ? ROLE_INFO[player.role] : null;
  const Icon = player.isBot ? Bot : User;

  return (
    <button
      type="button"
      disabled={!selectable}
      onClick={() => selectable && onSelect?.(player.id)}
      className={`group relative flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
        player.alive ? 'bg-white/[0.03]' : 'bg-black/40 opacity-55'
      } ${
        selected
          ? 'border-blood-500 ring-2 ring-blood-500/50'
          : 'border-white/10 hover:border-white/25'
      } ${selectable ? 'cursor-pointer hover:bg-white/[0.07]' : 'cursor-default'}`}
    >
      <div
        className={`grid size-10 shrink-0 place-items-center rounded-lg border border-white/10 bg-night-700 ${
          role ? role.color : 'text-white/60'
        }`}
      >
        {player.alive ? <Icon className="size-5" /> : <Skull className="size-5 text-white/50" />}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className={`truncate font-medium ${player.alive ? 'text-white' : 'text-white/50 line-through'}`}>
            {player.name}
          </span>
          {isYou && <span className="text-[10px] font-semibold text-gold-400">YOU</span>}
          {player.isHost && <Crown className="size-3.5 shrink-0 text-gold-400" />}
          {!player.connected && !player.isBot && <WifiOff className="size-3.5 text-white/40" />}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px]">
          {player.isBot && <span className="text-white/40">Computer</span>}
          {role && (
            <span className={`rounded border px-1.5 py-px font-semibold uppercase tracking-wide ${role.badge}`}>
              {role.label}
            </span>
          )}
          {!player.alive && <span className="text-white/40">eliminated</span>}
        </div>
      </div>

      {badge}
    </button>
  );
}
