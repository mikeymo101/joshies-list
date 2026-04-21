// Score Engine — calculates weighted client scores from reviews
// Categories: Pays on Time, No Surprises After, Sticks to the Plan, Easy to Work With, Site Ready & On Time

import type { Review } from '@/types';

const WEIGHTS = {
  payment: 0.30,
  post_job: 0.20,
  scope: 0.20,
  professionalism: 0.15,
  access: 0.15,
};

export function calculateWeightedScore(review: {
  score_payment: number;
  score_post_job: number;
  score_scope: number;
  score_professionalism: number;
  score_access: number;
}): number {
  const weighted =
    review.score_payment * WEIGHTS.payment +
    review.score_post_job * WEIGHTS.post_job +
    review.score_scope * WEIGHTS.scope +
    review.score_professionalism * WEIGHTS.professionalism +
    review.score_access * WEIGHTS.access;

  return Math.round(weighted * 10) / 10;
}

export function calculateClientScore(reviews: Review[]): number | null {
  if (reviews.length === 0) return null;

  const total = reviews.reduce((sum, r) => sum + r.weighted_score, 0);
  return Math.round((total / reviews.length) * 10) / 10;
}

export function getGrade(score: number): string {
  if (score >= 4.5) return 'A';
  if (score >= 3.5) return 'B';
  if (score >= 2.5) return 'C';
  if (score >= 1.5) return 'D';
  return 'F';
}

export function getScoreBreakdown(reviews: Review[]) {
  if (reviews.length === 0) return null;

  const count = reviews.length;

  return {
    payment: Math.round((reviews.reduce((sum, r) => sum + r.score_payment, 0) / count) * 10) / 10,
    post_job: Math.round((reviews.reduce((sum, r) => sum + r.score_post_job, 0) / count) * 10) / 10,
    scope: Math.round((reviews.reduce((sum, r) => sum + r.score_scope, 0) / count) * 10) / 10,
    professionalism: Math.round((reviews.reduce((sum, r) => sum + r.score_professionalism, 0) / count) * 10) / 10,
    access: Math.round((reviews.reduce((sum, r) => sum + r.score_access, 0) / count) * 10) / 10,
  };
}
