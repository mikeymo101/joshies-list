-- RLS Policies for Joshie's List
-- Run this in Supabase SQL Editor

-- CLIENTS: any authenticated user can read all clients
create policy "authenticated users can read clients"
  on clients for select to authenticated using (true);

-- CLIENTS: any authenticated user can insert clients
create policy "authenticated users can insert clients"
  on clients for insert to authenticated with check (true);

-- CLIENTS: service role can update clients (for score recalculation)
create policy "service role can update clients"
  on clients for update using (true);

-- REVIEWS: any authenticated user can read reviews
create policy "authenticated users can read reviews"
  on reviews for select to authenticated using (true);

-- REVIEWS: authenticated users can insert reviews
create policy "authenticated users can insert reviews"
  on reviews for insert to authenticated with check (true);

-- CONTRACTORS: contractors can update own record
create policy "contractors can update own record"
  on contractors for update using (auth.uid() = auth_user_id);

-- VERIFICATION_SUBMISSIONS: contractors can read own submissions
create policy "contractors can read own submissions"
  on verification_submissions for select to authenticated
  using (contractor_id in (select id from contractors where auth_user_id = auth.uid()));

-- VERIFICATION_SUBMISSIONS: contractors can insert submissions
create policy "contractors can insert submissions"
  on verification_submissions for insert to authenticated with check (true);

-- INVITE_CODES: authenticated users can read invite codes
create policy "authenticated users can read invite codes"
  on invite_codes for select to authenticated using (true);

-- INVITE_CODES: authenticated users can update invite codes
create policy "authenticated users can update invite codes"
  on invite_codes for update to authenticated using (true);

-- SEED_JOBS: contractors can manage own seed jobs
create policy "contractors can read own seed jobs"
  on seed_jobs for select to authenticated
  using (contractor_id in (select id from contractors where auth_user_id = auth.uid()));

create policy "contractors can insert seed jobs"
  on seed_jobs for insert to authenticated with check (true);
