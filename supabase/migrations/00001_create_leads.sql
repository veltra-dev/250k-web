-- Table: leads (contact form submissions)
create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  source text,
  created_at timestamptz not null default now()
);

-- RLS: enable
alter table public.leads enable row level security;

-- Policy: allow anonymous insert (for contact form)
create policy "Allow anonymous insert"
  on public.leads
  for insert
  to anon
  with check (true);

-- Policy: no public read (only service role can read)
create policy "Service role read only"
  on public.leads
  for select
  to service_role
  using (true);
