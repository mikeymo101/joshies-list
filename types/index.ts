export interface Contractor {
  id: string;
  auth_user_id: string;
  first_name: string;
  last_name: string;
  business_name: string;
  trade_type: string;
  phone: string;
  primary_state: string;
  years_in_business: string;
  verification_status: 'pending' | 'approved' | 'rejected';
  access_tier: 'registered' | 'verified' | 'premium';
  invite_code_used: string | null;
  stripe_customer_id: string | null;
  verified_at: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  first_name: string;
  last_initial: string;
  city: string;
  state: string;
  zip_code: string;
  score: number | null;
  grade: string | null;
  review_count: number;
  last_reviewed_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  contractor_id: string;
  client_id: string;
  score_payment: number;
  score_post_job: number;
  score_scope: number;
  score_professionalism: number;
  score_access: number;
  weighted_score: number;
  job_type: string;
  job_value_range: string;
  job_date_approx: string;
  tos_acknowledged: boolean;
  status: 'active' | 'flagged' | 'removed';
  created_at: string;
}

export interface VerificationSubmission {
  id: string;
  contractor_id: string;
  license_number: string;
  license_state: string;
  document_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface InviteCode {
  id: string;
  code: string;
  used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export interface SeedJob {
  id: string;
  contractor_id: string;
  client_first_name: string;
  client_last_initial: string;
  zip_code: string;
  job_date_approx: string;
  job_value_range: string;
  created_at: string;
}

export interface FeatureRequest {
  id: string;
  contractor_id: string | null;
  title: string;
  description: string;
  category: 'general' | 'search' | 'reviews' | 'scoring' | 'mobile' | 'other';
  status: 'new' | 'reviewed' | 'planned' | 'completed' | 'declined';
  admin_notes: string | null;
  created_at: string;
}

export type ScoreCategory =
  | 'payment'
  | 'post_job'
  | 'scope'
  | 'professionalism'
  | 'access';
