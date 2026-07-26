import { useNavigate } from 'react-router-dom';
import { LogOut, Moon, RotateCcw, Sun, Trophy } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PHASE_LABEL, PHASES, isNight } from '../lib/constants';
import PhaseTimer from './PhaseTimer';
import PlayerCard from './PlayerCard';
import RoleCard from './RoleCard';
import ChatPanel from './ChatPanel';
import ActionPanel from './ActionPanel';

export default function GameBoard() {
  const navigate = useNavigate();
  const { state, actions } = useGame();
  const { phase, players, you, dayNumber, announcement, winner } = state;

  const night = isNight(phase);
  const canChat = you?.alive && (phase === PHASES.DAY_DISCUSSION || phase === PHASES.VOTING);
  const isTerrorist = you?.role === 'terrorist';
  const aliveCount = players.filter((p) => p.alive).length;

  const leave = () => {
    actions.leave();
    navigate('/');
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className={`grid size-10 place-items-center rounded-xl border ${
              night
                ? 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300'
                : 'border-gold-400/40 bg-gold-400/10 text-gold-400'
            }`}
          >
            {night ? <Moon className="size-5" /> : <Sun className="size-5" />}
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-white/40">
              Room {state.roomId} · Round {dayNumber}
            </p>
            <h1 className="text-lg font-bold text-white">{PHASE_LABEL[phase] || phase}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/60">
            {aliveCount} alive
          </span>
          <PhaseTimer endsAt={state.phaseEndsAt} />
          <button
            type="button"
            onClick={leave}
            className="rounded-lg border border-white/10 p-2 text-white/40 transition hover:border-blood-600/50 hover:text-blood-500"
            title="Leave game"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {announcement && (
        <div
          key={announcement}
          className="mt-5 animate-fade-up rounded-xl border border-white/10 bg-gradient-to-r from-night-800 to-night-900 px-5 py-4 text-center"
        >
          <p className="text-lg font-semibold text-white">{announcement}</p>
        </div>
      )}

      {phase === PHASES.GAME_OVER && winner && (
        <div
          className={`mt-5 animate-fade-up rounded-xl border p-6 text-center ${
            winner.side === 'villagers'
              ? 'border-emerald-500/40 bg-emerald-500/10'
              : 'border-blood-600/50 bg-blood-600/10'
          }`}
        >
          <Trophy
            className={`mx-auto size-8 ${
              winner.side === 'villagers' ? 'text-emerald-400' : 'text-blood-500'
            }`}
          />
          <p className="mt-2 text-2xl font-black tracking-tight text-white">
            {winner.side === 'villagers' ? 'Victory!' : 'Defeat!'}
          </p>
          <p className="mt-1 text-white/60">{winner.text}</p>
          {you?.isHost && (
            <button
              type="button"
              onClick={() => actions.restart()}
              className="mx-auto mt-4 flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-semibold text-white transition hover:bg-white/20"
            >
              <RotateCcw className="size-4" /> Back to lobby
            </button>
          )}
        </div>
      )}

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        <section className="space-y-5">
          {you?.role && <RoleCard role={you.role} alive={you.alive} />}
          <ActionPanel />

          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-white/40">
              Players
            </p>
            <div className="grid gap-2 sm:grid-cols-2">
              {players.map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  isYou={p.id === you?.id}
                  badge={
                    phase === PHASES.VOTING && p.alive && p.hasVoted ? (
                      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/60">
                        VOTED
                      </span>
                    ) : null
                  }
                />
              ))}
            </div>
          </div>
        </section>

        <section className="flex h-[34rem] flex-col gap-4 lg:h-[42rem]">
          <div className="min-h-0 flex-1">
            <ChatPanel
              channel="public"
              title="Village square"
              subtitle={
                canChat
                  ? 'Everyone alive can talk right now'
                  : you?.alive
                    ? 'The village is asleep — chat opens during the day'
                    : 'You are dead and cannot speak'
              }
              disabled={!canChat}
              placeholder={canChat ? 'Accuse, defend, deduce...' : 'Chat is closed'}
            />
          </div>

          {isTerrorist && (
            <div className="h-48 shrink-0">
              <ChatPanel
                channel="mafia"
                title="Terrorist notes"
                subtitle="Private — only you can read this"
                placeholder="Plan your next move..."
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
