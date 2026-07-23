-- News cover image alt text for SEO / accessibility
alter table public.news_articles
  add column if not exists cover_image_alt text;
