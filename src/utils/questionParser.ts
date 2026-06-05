import { Question, Quiz } from '../types/quiz';

function isValidQuestion(q: unknown): q is Question {
  if (!q || typeof q !== 'object') return false;
  const obj = q as Record<string, unknown>;
  return (
    typeof obj.id === 'number' &&
    typeof obj.question === 'string' &&
    Array.isArray(obj.options) &&
    obj.options.length === 4 &&
    typeof obj.correct_index === 'number' &&
    obj.correct_index >= 0 &&
    obj.correct_index <= 3 &&
    typeof obj.explanation === 'string' &&
    typeof obj.category === 'string'
  );
}

export function parseQuizJSON(raw: string): Quiz {
  let cleaned = raw.trim();
  cleaned = cleaned.replace(/^```json?\n?/, '').replace(/\n?```$/, '');

  const parsed = JSON.parse(cleaned);

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('JSON invalide');
  }
  if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
    throw new Error('Aucune question trouvée');
  }
  const validQuestions = parsed.questions.filter(isValidQuestion);
  if (validQuestions.length === 0) {
    throw new Error('Questions invalides');
  }

  return {
    quiz_title: parsed.quiz_title ?? 'Quiz',
    difficulty: parsed.difficulty ?? 'medium',
    questions: validQuestions,
  };
}
