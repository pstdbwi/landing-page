create table if not exists public.landing_configs (
  slug text primary key,
  config jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.landing_configs enable row level security;

drop policy if exists "landing_configs_service_role_all" on public.landing_configs;

create policy "landing_configs_service_role_all"
on public.landing_configs
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'landing-assets',
  'landing-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
