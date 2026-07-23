-- SEO path redirects (301/302) managed from admin SEO hub
create table if not exists public.seo_redirects (
  id uuid primary key default gen_random_uuid(),
  from_path text not null unique,
  to_path text not null,
  status_code integer not null default 301
    check (status_code in (301, 302, 307, 308)),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists seo_redirects_enabled_from_path_idx
  on public.seo_redirects (from_path)
  where enabled = true;

alter table public.seo_redirects enable row level security;

create policy "Public read enabled seo redirects"
  on public.seo_redirects for select
  using (enabled = true);

create policy "Admin manage seo redirects"
  on public.seo_redirects for all
  using (public.is_admin())
  with check (public.is_admin());
