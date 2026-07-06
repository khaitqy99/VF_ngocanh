-- Admin user registry (bổ sung auth.users cho quản lý trong webadmin)

create table public.admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'super_admin')),
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index admin_users_email_idx on public.admin_users (email);
create index admin_users_role_idx on public.admin_users (role);

create trigger admin_users_updated_at
  before update on public.admin_users
  for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;

create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'super_admin',
    false
  );
$$;

create policy "Admin read admin_users"
  on public.admin_users for select
  using (public.is_admin());

create policy "Super admin manage admin_users"
  on public.admin_users for all
  using (public.is_super_admin())
  with check (public.is_super_admin());

grant select on public.admin_users to authenticated;
grant all on public.admin_users to authenticated;
