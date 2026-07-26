import { useEffect, useState } from 'react';
import { Crosshair, HeartPulse, Moon, Vote } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { PHASES } from '../lib/constants';
import PlayerCard from './PlayerCard';

function Shell({ icon, title, description, children }) {
  return (
    <div className="animate-fade-up rounded-xl border border-white/10 bg-night-800/60 p-4">
      <div className="flex items-start gap-3">
        <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-white/5 text-blood-500">
          {icon}
        </div>
        <div>
          <p className="font-semibold text-white">{title}</p>
          <p className="text-sm text-white/50">{description}</p>
        </div>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Selector({ candidates, youId, onConfirm, confirmLabel, locked, lockedText }) {
  const [choice, setChoice] = useState(null);

  useEffect(() => {
    if (locked) setChoice(null);
  }, [locked]);

  if (locked) {
    return <p className="rounded-lg bg-white/5 px-3 py-2 text-sm text-white/60">{lockedText}</p>;
  }

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-2">
        {candidates.map((p) => (
          <PlayerCard
            key={p.id}
            player={p}
            selectable
            selected={choice === p.id}
            onSelect={setChoice}
            isYou={p.id === youId}
          />
        ))}
      </div>
      <button
        type="button"
        disabled={!choice}
        onClick={() => onConfirm(choice)}
        className="mt-3 w-full rounded-lg bg-blood-600 px-4 py-2.5 font-semibold text-white transition hover:bg-blood-500 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {confirmLabel}
      </button>
    </>
  );
}

export default function ActionPanel() {
  const { state, actions } = useGame();
  if (!state?.you) return null;

  const { phase, players, you } = state;
  const alive = players.filter((p) => p.alive);
  const nameOf = (id) => players.find((p) => p.id === id)?.name || 'someone';

  if (phase === PHASES.NIGHT_TERRORIST) {
    if (you.role === 'terrorist' && you.alive) {
      return (
        <Shell
          icon={<Crosshair className="size-5" />}
          title="Choose a player to eliminate"
          description="Only you can see this. Pick your victim before the timer ends."
        >
          <Selector
            candidates={alive.filter((p) => p.id !== you.id)}
            youId={you.id}
            confirmLabel="Confirm elimination"
            locked={Boolean(state.nightAction.killChosen)}
            lockedText={`You marked ${nameOf(state.nightAction.killChosen)}. Waiting for the night to unfold...`}
            onConfirm={(id) => actions.kill(id)}
          />
        </Shell>
      );
    }
    return (
      <Shell
        icon={<Moon className="size-5" />}
        title="Night falls..."
        description="The Terrorist is planning an attack. Stay quiet and hope you survive."
      >
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/3 animate-pulse rounded-full bg-blood-600/70" />
        </div>
      </Shell>
    );
  }

  if (phase === PHASES.NIGHT_DOCTOR) {
    if (you.role === 'doctor' && you.alive) {
      return (
        <Shell
          icon={<HeartPulse className="size-5" />}
          title="Choose one player to save"
          description="You may protect yourself. If you guess right, nobody dies tonight."
        >
          <Selector
            candidates={alive}
            youId={you.id}
            confirmLabel="Save"
            locked={Boolean(state.nightAction.saveChosen)}
            lockedText={`You are protecting ${
              state.nightAction.saveChosen === you.id ? 'yourself' : nameOf(state.nightAction.saveChosen)
            }.`}
            onConfirm={(id) => actions.save(id)}
          />
        </Shell>
      );
    }
    return (
      <Shell
        icon={<HeartPulse className="size-5" />}
        title="The Doctor is deciding whom to save"
        description="A life may be spared tonight."
      >
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-500/60" />
        </div>
      </Shell>
    );
  }

  if (phase === PHASES.VOTING) {
    if (!you.alive) {
      return (
        <Shell icon={<Vote className="size-5" />} title="Voting in progress" description="The dead do not vote.">
          <p className="text-sm text-white/40">Watching from the grave.</p>
        </Shell>
      );
    }
    return (
      <Shell
        icon={<Vote className="size-5" />}
        title="Vote for the Terrorist"
        description="Votes stay anonymous until everyone has decided."
      >
        <Selector
          candidates={alive.filter((p) => p.id !== you.id)}
          youId={you.id}
          confirmLabel="Cast vote"
          locked={Boolean(state.myVote)}
          lockedText={`You voted for ${nameOf(state.myVote)}. Waiting for the rest of the village...`}
          onConfirm={(id) => actions.vote(id)}
        />
      </Shell>
    );
  }

  if (phase === PHASES.VOTE_RESULT && state.voteTally?.length) {
    return (
      <Shell icon={<Vote className="size-5" />} title="Final tally" description={state.lastResult?.text || ''}>
        <ul className="space-y-1.5">
          {state.voteTally.map((t) => (
            <li key={t.id} className="flex items-center gap-3 text-sm">
              <span className="w-24 shrink-0 truncate text-white/70">{t.name}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-blood-600"
                  style={{ width: `${(t.count / state.voteTally[0].count) * 100}%` }}
                />
              </div>
              <span className="w-6 text-right tabular-nums text-white/60">{t.count}</span>
            </li>
          ))}
        </ul>
      </Shell>
    );
  }

  return null;
}
