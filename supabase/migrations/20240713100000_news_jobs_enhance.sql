-- Enhance job_postings for public career pages
alter table public.job_postings
  add column if not exists slug text,
  add column if not exists location text,
  add column if not exists salary_range text,
  add column if not exists deadline date,
  add column if not exists requirements text,
  add column if not exists benefits text,
  add column if not exists quantity int not null default 1,
  add column if not exists sort_order int not null default 0;

create unique index if not exists job_postings_slug_key on public.job_postings (slug)
  where slug is not null;

create index if not exists news_articles_published_idx
  on public.news_articles (status, published_at desc nulls last);

create index if not exists job_postings_published_idx
  on public.job_postings (status, sort_order asc, created_at desc);

-- Job applications from public careers form
create type public.job_application_status as enum (
  'new',
  'reviewing',
  'interviewed',
  'hired',
  'rejected'
);

create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.job_postings (id) on delete set null,
  full_name text not null,
  phone text not null,
  email text,
  cover_letter text,
  status public.job_application_status not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger job_applications_updated_at
  before update on public.job_applications
  for each row execute function public.set_updated_at();

alter table public.job_applications enable row level security;

create policy "Public submit job applications"
  on public.job_applications for insert
  with check (true);

create policy "Admin manage job applications"
  on public.job_applications for all
  using (public.is_admin())
  with check (public.is_admin());

grant insert on public.job_applications to anon, authenticated;
