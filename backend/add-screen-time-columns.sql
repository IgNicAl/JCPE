-- Migration helper: adiciona colunas para rastrear tempo de tela e pontos
ALTER TABLE users ADD COLUMN IF NOT EXISTS total_screen_time_seconds BIGINT DEFAULT 0 NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS points INT DEFAULT 0 NOT NULL;

-- Índice para consultas por pontos (opcional)
CREATE INDEX IF NOT EXISTS idx_users_points ON users(points);
