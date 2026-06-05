import { create } from 'zustand';
import { Question, QuizConfig } from '../types/quiz';

type GameStatus = 'idle' | 'generating' | 'playing' | 'finished';

interface GameStore {
  config: QuizConfig | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  timestamps: Record<number, number>;
  questionStartTime: number;
  status: GameStatus;
  setConfig: (c: QuizConfig) => void;
  setQuestions: (q: Question[]) => void;
  setStatus: (s: GameStatus) => void;
  markQuestionStart: () => void;
  submitAnswer: (answerIndex: number) => void;
  nextQuestion: () => void;
  reset: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  config: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  timestamps: {},
  questionStartTime: 0,
  status: 'idle',

  setConfig: (c: QuizConfig) => set({ config: c }),

  setQuestions: (q: Question[]) => set({ questions: q, currentIndex: 0 }),

  setStatus: (s: GameStatus) => set({ status: s }),

  markQuestionStart: () => set({ questionStartTime: Date.now() }),

  submitAnswer: (answerIndex: number) => {
    const { currentIndex, questionStartTime, answers, timestamps } = get();
    const elapsed = Date.now() - questionStartTime;
    set({
      answers: { ...answers, [currentIndex]: answerIndex },
      timestamps: { ...timestamps, [currentIndex]: elapsed },
    });
  },

  nextQuestion: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      set({ status: 'finished' });
    }
  },

  reset: () =>
    set({
      config: null,
      questions: [],
      currentIndex: 0,
      answers: {},
      timestamps: {},
      questionStartTime: 0,
      status: 'idle',
    }),
}));
