# VinFast 3S Cà Mau — Monorepo

Monorepo gồm **web client** (website công khai) và **web admin** (CMS), dùng chung một CSDL Supabase.

## Cấu trúc

```
vinfast3scamau/
├── apps/
│   ├── webclient/     # Website đại lý (Next.js 15) — port 3000
│   └── webadmin/      # Admin CMS (Next.js 15) — port 3001
├── packages/
│   └── supabase/      # Client Supabase dùng chung + TypeScript types
├── supabase/
│   ├── config.toml
│   └── migrations/    # Schema PostgreSQL
├── package.json       # npm workspaces
└── .env.example
```

## Yêu cầu

- Node.js >= 20
- npm >= 10
- [Supabase CLI](https://supabase.com/docs/guides/cli) (tùy chọn, cho dev local)

## Cài đặt

```bash
# Clone repo, sau đó:
cp .env.example .env
# Điền NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

npm install
```

## Chạy local

```bash
# Website công khai — http://localhost:3000
npm run dev:client

# Admin CMS — http://localhost:3001
npm run dev:admin
```

## Supabase

### Tạo project trên cloud

1. Tạo project tại [supabase.com/dashboard](https://supabase.com/dashboard)
2. Copy URL + anon key + service role key vào `.env`
3. Push migration:

```bash
npx supabase link --project-ref <your-project-ref>
npm run db:push
```

### Dev local (Docker)

```bash
npm run db:start    # Khởi động Postgres + Auth + Studio local
npm run db:reset    # Apply migrations
npm run db:types    # Regenerate TypeScript types
```

Studio local: http://localhost:54323

### Tạo admin user

Trong Supabase Dashboard → Authentication → Users → tạo user, sau đó set `app_metadata`:

```json
{ "role": "admin" }
```

RLS policy `is_admin()` kiểm tra `app_metadata.role` ∈ `admin` | `super_admin`.

## Deploy Vercel (2 project độc lập)

Tạo **2 Vercel projects** cùng trỏ vào repo này:

| Project | Root Directory | Domain gợi ý |
|---------|----------------|--------------|
| Web Client | `apps/webclient` | vinfast3scamau.com |
| Web Admin | `apps/webadmin` | admin.vinfast3scamau.com |

### Environment Variables (cả 2 project)

| Biến | Web Client | Web Admin | Ghi chú |
|------|:----------:|:---------:|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | ✅ | Cùng project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | ✅ | Cùng anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | ❌ | ✅ | Chỉ admin, server-only |
| `NEXT_PUBLIC_SITE_URL` | ✅ | — | URL website |
| `NEXT_PUBLIC_ADMIN_URL` | — | ✅ | URL admin |

> Bật **"Include source files outside of the Root Directory"** trong Vercel project settings để npm workspaces resolve `@vinfast3s/supabase`.

Mỗi app đã có `vercel.json` với `installCommand` và `buildCommand` chạy từ root monorepo.

## Package dùng chung

```ts
// Browser (client components)
import { createBrowserClient } from "@vinfast3s/supabase/client";

// Server (Server Components / Route Handlers)
import { createServerClient } from "@vinfast3s/supabase/server";

// Admin only (API routes — bypass RLS)
import { createAdminClient } from "@vinfast3s/supabase/admin";

// Types
import type { Tables } from "@vinfast3s/supabase";
type Vehicle = Tables<"vehicles">;
```

## Scripts

| Lệnh | Mô tả |
|------|-------|
| `npm run dev:client` | Dev webclient :3000 |
| `npm run dev:admin` | Dev webadmin :3001 |
| `npm run build:client` | Build webclient |
| `npm run build:admin` | Build webadmin |
| `npm run db:push` | Push migrations lên Supabase cloud |
| `npm run db:types` | Generate types từ schema local |
