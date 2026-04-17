// Shared category constants — single source of truth for all display labels
// Database column names (score_payment, score_post_job, etc.) are unchanged

export interface Category {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  weight: string;
  weightValue: number;
}

export const CATEGORIES: Category[] = [
  {
    id: 'payment',
    label: 'Pays on Time',
    shortLabel: 'Pays',
    description: 'Paid what was agreed, when it was agreed',
    weight: '30%',
    weightValue: 0.30,
  },
  {
    id: 'post_job',
    label: 'No Surprises After',
    shortLabel: 'After',
    description: 'No callbacks, complaints, or bad reviews after the job',
    weight: '20%',
    weightValue: 0.20,
  },
  {
    id: 'scope',
    label: 'Sticks to the Plan',
    shortLabel: 'Plan',
    description: "Didn't expand scope or change their mind mid-job",
    weight: '20%',
    weightValue: 0.20,
  },
  {
    id: 'professionalism',
    label: 'Easy to Work With',
    shortLabel: 'Easy',
    description: 'Respectful, reasonable, and communicates well',
    weight: '15%',
    weightValue: 0.15,
  },
  {
    id: 'access',
    label: 'Site Ready & On Time',
    shortLabel: 'Site',
    description: 'Job site was accessible and schedule was respected',
    weight: '15%',
    weightValue: 0.15,
  },
];

export function getCategoryById(id: string): Category | undefined {
  return CATEGORIES.find(c => c.id === id);
}
