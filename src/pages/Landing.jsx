import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DoorOpen, Loader2, PlusCircle, Shield, Skull, Sparkles, Users } from 'lucide-react';
import { useGame } from '../context/GameContext';

export default function Landing() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { actions, playerName, rememberName, setToast, connected } = useGame();

  const [mode, setMode] = useState(params.get('room') ? 'join' : null);
  const [name, setName] = useState(playerName);
  const [roomId, setRoomId] = useState(params.get('room') || '');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setName(playerName);
  }, [playerName]);

  const submit = async (e) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) return setToast({ type: 'error', text: 'Enter a player name.' });
    if (mode === 'join' && !roomId.trim()) {
      return setToast({ type: 'error', text: 'Enter a Room ID.' });
    }

    setBusy(true);
    const res =
      mode === 'create'
        ? await actions.createRoom(cleanName)
        : await actions.joinRoom(cleanName, roomId.trim().toUpperCase());
    setBusy(false);

    if (res?.error) return setToast({ type: 'error', text: res.error });
    rememberName(cleanName);
    return navigate(`/room/${res.roomId}`);
  };

  return (
    <main className="relative isolate min-h-screen overflow-hidden">
      {/* decorative background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 size-[26rem] rounded-full bg-blood-600/20 blur-[88px]" />
        <div className="absolute -right-24 top-1/3 size-[22rem] rounded-full bg-indigo-600/15 blur-[80px]" />
        <div className="absolute bottom-0 left-1/3 size-[18rem] rounded-full bg-gold-400/10 blur-[72px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '52px 52px',
          }}
        />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center px-4 py-12">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/60 backdrop-blur-sm animate-fade-up">
            <Sparkles className="size-4 text-gold-400" />
            <span>Up to 8 players · AI fills empty seats</span>
          </div>

          <div className="mx-auto mb-6 grid size-20 place-items-center rounded-3xl border border-blood-600/40 bg-blood-600/15 shadow-[0_0_40px_-10px_rgba(224,57,62,0.45)] text-blood-500 animate-fade-up">
            <Skull className="size-10" />
          </div>

          <h1 className="animate-fade-up text-6xl font-black tracking-tighter text-white drop-shadow-2xl sm:text-8xl">
            MAFIA
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-white/55 animate-fade-up">
            A real-time game of deception. One Terrorist strikes at night, one Doctor tries to save
            the village, and everyone else hunts the killer before it is too late.
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold uppercase tracking-widest animate-fade-up">
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
              <span className="size-2 rounded-full bg-blood-500" />
              Terrorist
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
              <span className="size-2 rounded-full bg-emerald-400" />
              Doctor
            </span>
            <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-white/70">
              <span className="size-2 rounded-full bg-sky-400" />
              Villager
            </span>
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-white/30 animate-fade-up">
            {connected ? (
              <span className="text-emerald-400">● Connected to server</span>
            ) : (
              <span className="text-blood-500">● Server offline — start the backend</span>
            )}
          </p>
        </div>

        {!mode && (
          <div className="grid w-full max-w-2xl gap-5 sm:grid-cols-2 animate-fade-up">
            <button
              type="button"
              onClick={() => setMode('create')}
              className="group relative overflow-hidden rounded-3xl border border-blood-600/30 bg-gradient-to-br from-night-800/90 to-night-900/90 p-8 text-left shadow-2xl transition hover:-translate-y-1 hover:border-blood-600/60 hover:shadow-blood-600/20"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(224,57,62,0.12),transparent_60%)]" />
              <div className="relative">
                <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-blood-600/40 bg-blood-600/15 text-blood-500 shadow-lg">
                  <PlusCircle className="size-6" />
                </div>
                <p className="text-2xl font-bold text-white">Create Room</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Host a private lobby, get a shareable Room ID, and fill any empty seats with bots
                  when you are ready.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blood-500 transition group-hover:translate-x-1">
                  Host a game <span aria-hidden>→</span>
                </span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode('join')}
              className="group relative overflow-hidden rounded-3xl border border-sky-500/30 bg-gradient-to-br from-night-800/90 to-night-900/90 p-8 text-left shadow-2xl transition hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-sky-500/20"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.12),transparent_60%)]" />
              <div className="relative">
                <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-sky-500/40 bg-sky-500/15 text-sky-400 shadow-lg">
                  <DoorOpen className="size-6" />
                </div>
                <p className="text-2xl font-bold text-white">Join Room</p>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  Have a Room ID? Drop your name in and take a seat at the table.
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-400 transition group-hover:translate-x-1">
                  Enter the lobby <span aria-hidden>→</span>
                </span>
              </div>
            </button>
          </div>
        )}

        {mode && (
          <form
            onSubmit={submit}
            className="relative w-full max-w-md animate-fade-up rounded-3xl border border-white/10 bg-night-800/80 p-8 shadow-2xl backdrop-blur"
          >
            <div className="mx-auto mb-5 grid size-12 place-items-center rounded-2xl bg-white/5 text-white">
              <Shield className="size-6" />
            </div>
            <h2 className="text-center text-2xl font-bold text-white">
              {mode === 'create' ? 'Create a new room' : 'Join an existing room'}
            </h2>

            <div className="mt-6">
              <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                Player name
              </label>
              <input
                autoFocus
                value={name}
                maxLength={16}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul"
                className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/25 transition focus:border-blood-500/60 focus:bg-white/[0.07] focus:outline-none"
              />
            </div>

            {mode === 'join' && (
              <div className="mt-4">
                <label className="block text-xs font-semibold uppercase tracking-widest text-white/40">
                  Room ID
                </label>
                <input
                  value={roomId}
                  maxLength={8}
                  onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                  placeholder="ABC123"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-lg tracking-[0.25em] text-white placeholder:tracking-normal placeholder:text-white/25 transition focus:border-sky-500/60 focus:bg-white/[0.07] focus:outline-none"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={busy || !connected}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blood-600 to-blood-500 px-5 py-3 font-bold text-white shadow-lg shadow-blood-600/25 transition hover:from-blood-500 hover:to-blood-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? <Loader2 className="size-4 animate-spin" /> : <Users className="size-4" />}
              {mode === 'create' ? 'Create room' : 'Join room'}
            </button>

            <button
              type="button"
              onClick={() => setMode(null)}
              className="mt-4 w-full text-sm text-white/40 transition hover:text-white"
            >
              Back
            </button>
          </form>
        )}

        <footer className="mt-12 text-center text-xs text-white/25">
          Computer Game Handler controls all phases. No manual game master needed.
        </footer>
      </div>
    </main>
  );
}
