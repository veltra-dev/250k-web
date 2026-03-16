-- Landing pages: title, description, schedule, soft delete; drop slug unique

alter table public.landing_pages
  add column if not exists title text not null default '',
  add column if not exists description text not null default '',
  add column if not exists starts_at timestamptz,
  add column if not exists ends_at timestamptz,
  add column if not exists deleted_at timestamptz,
  add column if not exists created_at timestamptz not null default now();

alter table public.landing_pages drop constraint if exists landing_pages_slug_key;
