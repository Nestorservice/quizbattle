import { create } from 'zustand';
import { Team } from '../types/team';
import { Config } from '../constants/config';

interface TeamsStore {
  teams: Team[];
  scores: Record<string, number>;
  errors: Record<string, number>;
  eliminated: Record<string, boolean>;
  addTeam: (t: Team) => void;
  removeTeam: (id: string) => void;
  updateScore: (teamId: string, points: number) => void;
  incrementError: (teamId: string) => void;
  eliminateTeam: (teamId: string) => void;
  checkAutoElimination: () => string | null;
  reset: () => void;
}

export const useTeamsStore = create<TeamsStore>((set, get) => ({
  teams: [],
  scores: {},
  errors: {},
  eliminated: {},

  addTeam: (t: Team) => {
    set(state => ({
      teams: [...state.teams, t],
      scores: { ...state.scores, [t.id]: 0 },
      errors: { ...state.errors, [t.id]: 0 },
      eliminated: { ...state.eliminated, [t.id]: false },
    }));
  },

  removeTeam: (id: string) => {
    set(state => ({
      teams: state.teams.filter(t => t.id !== id),
    }));
  },

  updateScore: (teamId: string, points: number) => {
    set(state => ({
      scores: { ...state.scores, [teamId]: (state.scores[teamId] ?? 0) + points },
    }));
  },

  incrementError: (teamId: string) => {
    const { errors } = get();
    const newCount = (errors[teamId] ?? 0) + 1;
    set(state => ({
      errors: { ...state.errors, [teamId]: newCount },
    }));
    if (newCount >= Config.eliminationErrorCount) {
      get().eliminateTeam(teamId);
    }
  },

  eliminateTeam: (teamId: string) => {
    set(state => ({
      eliminated: { ...state.eliminated, [teamId]: true },
    }));
  },

  checkAutoElimination: (): string | null => {
    const { scores, eliminated, teams } = get();
    const active = teams.filter(t => !eliminated[t.id]);
    if (active.length <= 2) return null;
    const sorted = [...active].sort((a, b) => scores[a.id] - scores[b.id]);
    return sorted[0].id;
  },

  reset: () =>
    set({
      teams: [],
      scores: {},
      errors: {},
      eliminated: {},
    }),
}));
