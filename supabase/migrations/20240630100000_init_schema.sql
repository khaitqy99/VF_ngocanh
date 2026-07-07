-- VinFast 3S Cà Mau — schema dùng chung webclient + webadmin

-- Enums
create type public.vehicle_type as enum ('car', 'scooter');
create type public.publish_status as enum ('draft', 'published', 'archived');
create type public.lead_status as enum ('new', 'in_progress', 'converted', 'closed');
create type public.banner_placement as enum (
  'home',
  'cars',
  'scooters',
  'accessories',
  'after_sales',
  'charging',
  'energy'
);

-- Site settings (dealership info, floating buttons, SEO defaults)
create table public.site_settings (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

-- Vehicles (ô tô + xe máy)
create table public.vehicles (
  id text primary key,
  type public.vehicle_type not null,
  name text not null,
  slug text not null unique,
  category text,
  tagline text,
  slogan text,
  overview text,
  starting_price bigint,
  status public.publish_status not null default 'draft',
  sort_order int not null default 0,
  featured boolean not null default false,
  hero_image_url text,
  gallery jsonb not null default '[]'::jsonb,
  variants jsonb not null default '[]'::jsonb,
  colors jsonb not null default '[]'::jsonb,
  spec_table jsonb not null default '[]'::jsonb,
  content jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index vehicles_type_status_idx on public.vehicles (type, status);
create index vehicles_featured_idx on public.vehicles (featured) where featured = true;

-- Accessories
create table public.accessories (
  id text primary key,
  name text not null,
  slug text not null unique,
  category text,
  description text,
  price bigint,
  image_url text,
  in_stock boolean not null default true,
  featured boolean not null default false,
  status public.publish_status not null default 'draft',
  sort_order int not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Banners
create table public.banners (
  id uuid primary key default gen_random_uuid(),
  placement public.banner_placement not null,
  title text not null,
  alt_text text,
  desktop_image_url text,
  mobile_image_url text,
  href text,
  status public.publish_status not null default 'draft',
  sort_order int not null default 0,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index banners_placement_status_idx on public.banners (placement, status);

-- CMS pages (about, after-sales, charging, energy, homepage sections)
create table public.cms_pages (
  slug text primary key,
  title text not null,
  status public.publish_status not null default 'draft',
  content jsonb not null default '{}'::jsonb,
  seo jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id)
);

-- News articles
create table public.news_articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text,
  body text,
  category text,
  cover_image_url text,
  status public.publish_status not null default 'draft',
  author_id uuid references auth.users (id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Job postings
create table public.job_postings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text,
  employment_type text,
  description text,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Leads (form submissions từ webclient)
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  vehicle_interest text,
  source text,
  message text,
  status public.lead_status not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index leads_status_created_idx on public.leads (status, created_at desc);

-- Media library
create table public.media_assets (
  id uuid primary key default gen_random_uuid(),
  filename text not null,
  url text not null,
  mime_type text,
  size_bytes bigint,
  folder text,
  alt_text text,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

-- Sync logs (admin đồng bộ VinFast HQ)
create table public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  module text not null,
  status text not null,
  details jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  finished_at timestamptz
);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger vehicles_updated_at before update on public.vehicles
  for each row execute function public.set_updated_at();
create trigger accessories_updated_at before update on public.accessories
  for each row execute function public.set_updated_at();
create trigger banners_updated_at before update on public.banners
  for each row execute function public.set_updated_at();
create trigger cms_pages_updated_at before update on public.cms_pages
  for each row execute function public.set_updated_at();
create trigger news_articles_updated_at before update on public.news_articles
  for each row execute function public.set_updated_at();
create trigger job_postings_updated_at before update on public.job_postings
  for each row execute function public.set_updated_at();
create trigger leads_updated_at before update on public.leads
  for each row execute function public.set_updated_at();

-- RLS
alter table public.site_settings enable row level security;
alter table public.vehicles enable row level security;
alter table public.accessories enable row level security;
alter table public.banners enable row level security;
alter table public.cms_pages enable row level security;
alter table public.news_articles enable row level security;
alter table public.job_postings enable row level security;
alter table public.leads enable row level security;
alter table public.media_assets enable row level security;
alter table public.sync_logs enable row level security;

-- Helper: admin check via app_metadata role
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'super_admin'),
    false
  );
$$;

-- Public read: published content
create policy "Public read published vehicles"
  on public.vehicles for select
  using (status = 'published');

create policy "Public read published accessories"
  on public.accessories for select
  using (status = 'published');

create policy "Public read published banners"
  on public.banners for select
  using (status = 'published');

create policy "Public read published cms pages"
  on public.cms_pages for select
  using (status = 'published');

create policy "Public read published news"
  on public.news_articles for select
  using (status = 'published');

create policy "Public read published jobs"
  on public.job_postings for select
  using (status = 'published');

create policy "Public read site settings"
  on public.site_settings for select
  using (true);

-- Public insert leads (contact forms)
create policy "Anyone can submit leads"
  on public.leads for insert
  with check (true);

-- Admin full access
create policy "Admin manage vehicles"
  on public.vehicles for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage accessories"
  on public.accessories for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage banners"
  on public.banners for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage cms pages"
  on public.cms_pages for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage news"
  on public.news_articles for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage jobs"
  on public.job_postings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage leads"
  on public.leads for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage site settings"
  on public.site_settings for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage media"
  on public.media_assets for all
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin manage sync logs"
  on public.sync_logs for all
  using (public.is_admin())
  with check (public.is_admin());

-- Grant API access
grant usage on schema public to anon, authenticated;
grant select on all tables in schema public to anon, authenticated;
grant insert on public.leads to anon, authenticated;
grant all on all tables in schema public to authenticated;
grant all on all sequences in schema public to authenticated;

-- Seed default CMS pages
insert into public.cms_pages (slug, title, status, content) values
  ('home', 'Trang chủ', 'draft', '{}'::jsonb),
  ('about', 'Giới thiệu', 'draft', '{}'::jsonb),
  ('after-sales', 'Dịch vụ hậu mãi', 'draft', '{}'::jsonb),
  ('charging', 'Pin & Trạm sạc', 'draft', '{}'::jsonb),
  ('energy', 'Lưu trữ năng lượng', 'draft', '{}'::jsonb)
on conflict (slug) do nothing;

insert into public.site_settings (key, value) values
  ('dealership', '{"name":"VinFast Ngọc Anh Cà Mau","address":"","hotline_sales":"","hotline_service":"","email":""}'::jsonb),
  ('seo', '{"title_template":"%s | VinFast Ngọc Anh Cà Mau - Cà Mau","default_description":""}'::jsonb)
on conflict (key) do nothing;
