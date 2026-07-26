export const PHASES = {
  LOBBY: 'lobby',
  ROLE_REVEAL: 'role-reveal',
  NIGHT_TERRORIST: 'night-terrorist',
  NIGHT_DOCTOR: 'night-doctor',
  NIGHT_OUTCOME: 'night-outcome',
  DAY_DISCUSSION: 'day-discussion',
  VOTING: 'voting',
  VOTE_RESULT: 'vote-result',
  GAME_OVER: 'game-over',
};

export const PHASE_LABEL = {
  [PHASES.LOBBY]: 'Lobby',
  [PHASES.ROLE_REVEAL]: 'Role Reveal',
  [PHASES.NIGHT_TERRORIST]: 'Night — Terrorist',
  [PHASES.NIGHT_DOCTOR]: 'Night — Doctor',
  [PHASES.NIGHT_OUTCOME]: 'Night Outcome',
  [PHASES.DAY_DISCUSSION]: 'Day — Discussion',
  [PHASES.VOTING]: 'Voting',
  [PHASES.VOTE_RESULT]: 'Verdict',
  [PHASES.GAME_OVER]: 'Game Over',
};

export const ROLE_INFO = {
  terrorist: {
    label: 'Terrorist',
    tagline: 'Eliminate one player each night. Survive the vote.',
    color: 'text-blood-500',
    ring: 'ring-blood-500/60',
    badge: 'bg-blood-600/20 text-blood-500 border-blood-600/40',
  },
  doctor: {
    label: 'Doctor',
    tagline: 'Save one player each night. You may save yourself.',
    color: 'text-emerald-400',
    ring: 'ring-emerald-400/60',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40',
  },
  villager: {
    label: 'Villager',
    tagline: 'Talk, deduce and vote out the Terrorist.',
    color: 'text-sky-300',
    ring: 'ring-sky-400/60',
    badge: 'bg-sky-500/15 text-sky-300 border-sky-500/40',
  },
};

export const isNight = (phase) =>
  phase === PHASES.NIGHT_TERRORIST ||
  phase === PHASES.NIGHT_DOCTOR ||
  phase === PHASES.NIGHT_OUTCOME;
