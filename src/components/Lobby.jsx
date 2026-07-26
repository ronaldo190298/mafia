import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, Check, Copy, LogOut, Play, Trash2, Users } from 'lucide-react';
import { useGame } from '../context/GameContext';
import PlayerCard from './PlayerCard';
import ChatPanel from './ChatPanel';

export default function Lobby() {
  const navigate = useNavigate();
  const { state, actions, setToast } = useGame();
  const [copied, setCopied] = useState(false);

  const { players, maxPlayers, minPlayers, you, roomId } = state;
  const isHost = Boolean(you?.isHost);
  const botCount = players.filter((p) => p.isBot).length;
  const emptySlots = maxPlayers - players.length;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setToast({ type: 'error', text: 'Could not copy. Room ID: ' + roomId });
    }
  };

  const leave = () => {
    actions.leave();
    navigate('/');
  };

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/40">Room ID</p>
          <div className="flex items-center gap-3">
            <h1 className="font-mono text-4xl font-black tracking-[0.2em] text-white">{roomId}</h1>
            <button
              type="button"
              onClick={copy}
              className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/60 transition hover:text-white"
              title="Copy Room ID"
            >
              {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
            </button>
          </div>
          <p className="mt-1 text-sm text-white/40">Share this code so friends can join.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/70">
            <Users className="size-4" />
            <span className="tabular-nums">
              {players.length}/{maxPlayers}
            </span>
          </div>
          <button
            type="button"
            onClick={leave}
            className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/50 transition hover:border-blood-600/50 hover:text-blood-500"
          >
            <LogOut className="size-4" /> Leave
          </button>
        </div>
      </header>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section>
          <div className="grid gap-2 sm:grid-cols-2">
            {players.map((p) => (
              <PlayerCard
                key={p.id}
                player={p}
                isYou={p.id === you?.id}
                badge={
                  p.ready ? (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">
                      READY
                    </span>
                  ) : (
                    <span className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-white/40">
                      waiting
                    </span>
                  )
                }
              />
            ))}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div
                key={`empty-${i}`}
                className="flex items-center gap-3 rounded-xl border border-dashed border-white/10 p-3 text-white/25"
              >
                <div className="grid size-10 place-items-center rounded-lg border border-white/5">
                  <Users className="size-4" />
                </div>
                <span className="text-sm">Empty seat</span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-night-800/60 p-4">
            {isHost ? (
              <>
                <p className="text-sm font-semibold text-white">Host controls</p>
                <p className="mt-0.5 text-xs text-white/40">
                  {emptySlots > 0
                    ? `Fill the remaining ${emptySlots} slot${emptySlots > 1 ? 's' : ''} with computer bots?`
                    : 'The table is full. Start whenever you are ready.'}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={emptySlots === 0}
                    onClick={() => actions.addBots(emptySlots)}
                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-40"
                  >
                    <Bot className="size-4" /> Fill with bots
                  </button>
                  <button
                    type="button"
                    disabled={emptySlots === 0}
                    onClick={() => actions.addBots(1)}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-40"
                  >
                    + 1 bot
                  </button>
                  <button
                    type="button"
                    disabled={botCount === 0}
                    onClick={() => actions.removeBots()}
                    className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-white/60 transition hover:border-blood-600/50 hover:text-blood-500 disabled:opacity-40"
                  >
                    <Trash2 className="size-4" /> Remove bots
                  </button>
                  <button
                    type="button"
                    disabled={players.length < minPlayers}
                    onClick={() => actions.startGame()}
                    className="ml-auto flex items-center gap-2 rounded-lg bg-blood-600 px-4 py-2 font-semibold text-white transition hover:bg-blood-500 disabled:opacity-40"
                  >
                    <Play className="size-4" /> Start game
                  </button>
                </div>
                {players.length < minPlayers && (
                  <p className="mt-2 text-xs text-blood-500">
                    At least {minPlayers} players are required to start.
                  </p>
                )}
              </>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-white/50">Waiting for the host to start the game...</p>
                <button
                  type="button"
                  onClick={() => actions.setReady(!you?.ready)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    you?.ready
                      ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {you?.ready ? 'Ready ✓' : 'Mark ready'}
                </button>
              </div>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-white/10 bg-night-800/40 p-4 text-sm text-white/50">
            <p className="font-semibold text-white/80">Roles in an 8 player game</p>
            <p className="mt-1">6 Villagers · 1 Terrorist · 1 Doctor — assigned secretly at start.</p>
          </div>
        </section>

        <section className="h-[28rem] lg:h-auto">
          <ChatPanel channel="public" title="Lobby chat" subtitle="Warm up before the night falls" />
        </section>
      </div>
    </main>
  );
}
