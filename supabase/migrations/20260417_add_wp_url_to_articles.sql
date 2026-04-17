-- Adiciona campo wp_url para armazenar o link do post publicado no WordPress
-- e published_at para rastrear quando foi publicado

ALTER TABLE articles
  ADD COLUMN IF NOT EXISTS wp_url text,
  ADD COLUMN IF NOT EXISTS published_at timestamptz;

-- Índice para facilitar queries de artigos publicados
CREATE INDEX IF NOT EXISTS idx_articles_published
  ON articles (approved, published_at)
  WHERE approved = true;

COMMENT ON COLUMN articles.wp_url IS 'URL do post publicado no WordPress (response.link da WP REST API)';
COMMENT ON COLUMN articles.published_at IS 'Timestamp de publicação no WordPress';
