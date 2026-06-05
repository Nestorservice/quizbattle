export interface Question {
  id: number;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  category: string;
}

export interface Quiz {
  quiz_title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questions: Question[];
}

export type EliminationMode = 'errors' | 'last' | 'none';

export interface QuizConfig {
  subject: string;
  questionCount: number;
  difficulty: 'easy' | 'medium' | 'hard';
  eliminationMode: EliminationMode;
  timerSeconds: number;
}

export interface FinalResult {
  teamId: string;
  teamName: string;
  members: string[];
  score: number;
  rank: number;
  correctAnswers: number;
  totalQuestions: number;
  avgResponseTime: number;
}
