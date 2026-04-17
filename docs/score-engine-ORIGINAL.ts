// Joshie's List — Score Engine
// lib/score-engine.ts

export interface ReviewScores {
  score_payment: number;       // 1–5
  score_post_job: number;      // 1–5
  score_scope: number;         // 1–5
  score_professionalism: number; // 1–5
  score_access: number;        // 1–5
}

export interface WeightedResult {
  weighted_score: number;      // 0–100
  grade: string;               // A | B | C | D | F
}

const WEIGHTS = {
  payment: 0.30,
  post_job: 0.25,
  scope: 0.25,
  professionalism: 0.10,
  access: 0.10,
} as const;

export function calculateWeightedScore(scores: ReviewScores): number {
  const raw =
    scores.score_payment * WEIGHTS.payment +
    scores.score_post_job * WEIGHTS.post_job +
    scores.score_scope * WEIGHTS.scope +
    scores.score_professionalism * WEIGHTS.professionalism +
    scores.score_access * WEIGHTS.access;
  return Math.round(raw * 20 * 10) / 10; // Convert 1-5 to 0-100, round to 1dp
}

export function calculateClientScore(weightedScores: number[]): number {
  if (weightedScores.length === 0) return 0;
  const avg = weightedScores.reduce((sum, s) => sum + s, 0) / weightedScores.length;
  return Math.round(avg * 10) / 10;
}

export function getGrade(score: number): string {
  if (score >= 85) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 50) return 'D';
  return 'F';
}

export function scoreToResult(scores: ReviewScores): WeightedResult {
  const weighted_score = calculateWeightedScore(scores);
  const grade = getGrade(weighted_score);
  return { weighted_score, grade };
}
