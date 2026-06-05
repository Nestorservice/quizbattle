import { create } from 'zustand';
import { FinalResult } from '../types/quiz';
import { storageGet, storageSet } from '../utils/storage';
import { supabase } from '../api/supabase';
import { Config } from '../constants/config';

interface GameHistory {
  id: string;
  subject: string;
  difficulty: string;
  playedAt: string;
  playerCount: number;
  results: FinalResult[];
}

interface HistoryStore {
  history: GameHistory[];
  loadHistory: () => void;
  addGame: (game: GameHistory) => Promise<void>;
  syncFromSupabase: (deviceId: string) => Promise<void>;
}

const HISTORY_KEY = 'game_history';

export const useHistoryStore = create<HistoryStore>((set, get) => ({
  history: [],

  loadHistory: () => {
    const saved = storageGet<GameHistory[]>(HISTORY_KEY) ?? [];
    set({ history: saved });
  },

  addGame: async (game: GameHistory) => {
    const current = get().history;
    const updated = [game, ...current].slice(0, Config.maxHistoryItems);
    storageSet(HISTORY_KEY, updated);
    set({ history: updated });

    try {
      await supabase.from('game_sessions').insert({
        id: game.id,
        subject: game.subject,
        difficulty: game.difficulty,
        played_at: game.playedAt,
        player_count: game.playerCount,
        question_count: game.results[0]?.totalQuestions ?? 0,
        elimination_mode: 'none',
        host_device_id: 'local',
      });
    } catch {
      // Sauvegarde locale déjà faite, sync silencieuse
    }
  },

  syncFromSupabase: async (deviceId: string) => {
    try {
      const { data } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('host_device_id', deviceId)
        .order('played_at', { ascending: false })
        .limit(Config.maxHistoryItems);

      if (data && data.length > 0) {
        const mapped: GameHistory[] = data.map((s: Record<string, unknown>) => ({
          id: s.id as string,
          subject: s.subject as string,
          difficulty: s.difficulty as string,
          playedAt: s.played_at as string,
          playerCount: s.player_count as number,
          results: [],
        }));
        set({ history: mapped });
        storageSet(HISTORY_KEY, mapped);
      }
    } catch {
      // Garde l'historique local si offline
    }
  },
}));
