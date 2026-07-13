create index if not exists news_articles_scheduled_idx
  on public.news_articles (status, published_at)
  where status = 'scheduled';
