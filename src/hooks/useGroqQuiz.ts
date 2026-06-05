import { useState, useCallback } from 'react';
import { generateQuiz } from '../api/groq';
import { parseQuizJSON } from '../utils/questionParser';
import { Question, QuizConfig } from '../types/quiz';
import { Profile } from '../types/profile';
import { FALLBACK_QUESTIONS } from '../constants/fallbackQuestions';

interface UseGroqQuizResult {
  loading: boolean;
  error: string | null;
  isFallback: boolean;
  generate: (config: QuizConfig, profile: Profile) => Promise<Question[]>;
}

export function useGroqQuiz(): UseGroqQuizResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const generate = useCallback(
    async (config: QuizConfig, profile: Profile): Promise<Question[]> => {
      setLoading(true);
      setError(null);
      setIsFallback(false);

      try {
        const raw = await generateQuiz(config, profile);
        const quiz = parseQuizJSON(raw);
        setLoading(false);
        return quiz.questions.slice(0, config.questionCount);
      } catch (err) {
        setIsFallback(true);
        const shuffled = [...FALLBACK_QUESTIONS].sort(() => Math.random() - 0.5);
        setLoading(false);
        return shuffled.slice(0, config.questionCount);
      }
    },
    [],
  );

  return { loading, error, isFallback, generate };
}
