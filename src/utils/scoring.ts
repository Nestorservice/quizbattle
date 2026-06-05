const BASE_SCORE = 100;
const MAX_SPEED_BONUS = 300;

export function calculateScore(
  isCorrect: boolean,
  responseTimeMs: number,
  timerSeconds: number,
): number {
  if (!isCorrect) return 0;
  const timeRatio = Math.max(0, 1 - responseTimeMs / (timerSeconds * 1000));
  const speedBonus = Math.round(timeRatio * MAX_SPEED_BONUS);
  return BASE_SCORE + speedBonus;
}

export function rankTeams(
  scores: Record<string, number>,
): Array<{ teamId: string; score: number; rank: number }> {
  return Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .map(([teamId, score], index) => ({ teamId, score, rank: index + 1 }));
}
