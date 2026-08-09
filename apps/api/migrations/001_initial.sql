CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY, github_id BIGINT UNIQUE NOT NULL, login TEXT NOT NULL,
  avatar_url TEXT NOT NULL DEFAULT '', role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user','admin')),
  banned_at TIMESTAMPTZ, created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS articles (slug TEXT PRIMARY KEY, created_at TIMESTAMPTZ NOT NULL DEFAULT now());
CREATE TABLE IF NOT EXISTS comments (
  id BIGSERIAL PRIMARY KEY, article_slug TEXT NOT NULL, user_id BIGINT NOT NULL REFERENCES users(id),
  parent_id BIGINT REFERENCES comments(id), body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 2000),
  status TEXT NOT NULL DEFAULT 'visible' CHECK (status IN ('visible','hidden','deleted')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS comments_article_idx ON comments(article_slug, created_at);
CREATE TABLE IF NOT EXISTS likes (
  article_slug TEXT NOT NULL, user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(article_slug,user_id)
);
CREATE TABLE IF NOT EXISTS article_views (
  article_slug TEXT NOT NULL, view_date DATE NOT NULL DEFAULT CURRENT_DATE, visitor_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(), PRIMARY KEY(article_slug,view_date,visitor_hash)
);
CREATE TABLE IF NOT EXISTS moderation_logs (
  id BIGSERIAL PRIMARY KEY, admin_id BIGINT NOT NULL REFERENCES users(id), action TEXT NOT NULL,
  target_type TEXT NOT NULL, target_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
