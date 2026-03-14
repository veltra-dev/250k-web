-- Table: landing_pages (block-based landing page content)
create table if not exists public.landing_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  content jsonb not null default '[]'::jsonb
);

-- RLS: enable
alter table public.landing_pages enable row level security;

-- Policy: public read (anon can select for public rendering)
create policy "Public read landing_pages"
  on public.landing_pages
  for select
  to anon
  using (true);

-- Policy: authenticated users can insert
create policy "Authenticated insert landing_pages"
  on public.landing_pages
  for insert
  to authenticated
  with check (true);

-- Policy: authenticated users can update
create policy "Authenticated update landing_pages"
  on public.landing_pages
  for update
  to authenticated
  using (true)
  with check (true);

-- Policy: authenticated users can delete
create policy "Authenticated delete landing_pages"
  on public.landing_pages
  for delete
  to authenticated
  using (true);
