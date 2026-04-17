-- Joshie's List — Supabase Schema
-- Paste this into Supabase SQL Editor and run

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- contractors
create table contractors (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  business_name text not null,
  trade_type text not null,
  phone text not null,
  primary_state text not null,
  years_in_business text not null,
  verification_status text not null default 'pending',
  access_tier text not null default 'registered',
  invite_code_used text,
  stripe_customer_id text,
  verified_at timestamptz,
  created_at timestamptz not null default now()
);

-- clients
create table clients (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_initial text not null,
  city text not null,
  state text not null,
  zip_code text not null,
  score float default null,
  grade text default null,
  review_count integer not null default 0,
  last_reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- reviews
create table reviews (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references contractors(id),
  client_id uuid not null references clients(id),
  score_payment integer not null check (score_payment between 1 and 5),
  score_post_job integer not null check (score_post_job between 1 and 5),
  score_scope integer not null check (score_scope between 1 and 5),
  score_professionalism integer not null check (score_professionalism between 1 and 5),
  score_access integer not null check (score_access between 1 and 5),
  weighted_score float not null,
  job_type text not null,
  job_value_range text not null,
  job_date_approx text not null,
  tos_acknowledged boolean not null default false,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  -- one review per contractor per client per year
  unique (contractor_id, client_id, job_date_approx)
);

-- verification_submissions
create table verification_submissions (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references contractors(id),
  license_number text not null,
  license_state text not null,
  document_url text,
  status text not null default 'pending',
  admin_notes text,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- invite_codes
create table invite_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  used boolean not null default false,
  used_by uuid references contractors(id),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

-- seed_jobs
create table seed_jobs (
  id uuid primary key default gen_random_uuid(),
  contractor_id uuid not null references contractors(id),
  client_first_name text not null,
  client_last_initial text not null,
  zip_code text not null,
  job_date_approx text not null,
  job_value_range text not null,
  created_at timestamptz not null default now()
);

-- Indexes for common queries
create index on clients (zip_code);
create index on clients (lower(first_name), lower(last_initial), zip_code);
create index on reviews (client_id, status);
create index on reviews (contractor_id, client_id, created_at);
create index on verification_submissions (status, created_at);

-- RLS: enable row level security
alter table contractors enable row level security;
alter table clients enable row level security;
alter table reviews enable row level security;
alter table verification_submissions enable row level security;
alter table invite_codes enable row level security;
alter table seed_jobs enable row level security;

-- Basic RLS policies (tighten per route as needed)
create policy "contractors can read own record"
  on contractors for select using (auth.uid() = auth_user_id);

create policy "service role bypasses rls"
  on contractors for all using (true);
