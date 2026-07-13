-- News article enhancements: SEO, featured, related products, scheduled publish, rich body

alter type public.publish_status add value if not exists 'scheduled';

alter table public.news_articles
  add column if not exists seo jsonb not null default '{}'::jsonb,
  add column if not exists is_featured boolean not null default false,
  add column if not exists related_products jsonb not null default '[]'::jsonb,
  add column if not exists body_format text not null default 'plain',
  add column if not exists author_name text;

create index if not exists news_articles_featured_idx
  on public.news_articles (is_featured)
  where is_featured = true;
