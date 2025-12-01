-- Migration: Adicionar sistema de visualizações de notícias
-- Data: 2025-12-01
-- Descrição: Adiciona tabela news_views e coluna read_count para rastreamento de visualizações

-- 1. Criar tabela news_views (sem foreign keys primeiro)
CREATE TABLE IF NOT EXISTS news_views (
    id CHAR(36) NOT NULL PRIMARY KEY,
    news_id CHAR(36) NOT NULL,
    user_id CHAR(36) NULL,
    session_id VARCHAR(255) NULL,
    viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_news_views_news_id (news_id),
    INDEX idx_news_views_user_id (user_id),
    INDEX idx_news_views_session_id (session_id),
    INDEX idx_news_views_viewed_at (viewed_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- 2. Adicionar coluna read_count à tabela noticias (ignora se já existir)
ALTER TABLE noticias ADD COLUMN read_count BIGINT NOT NULL DEFAULT 0;

-- 3. Criar índice para read_count (para queries de ordenação)
CREATE INDEX idx_noticias_read_count ON noticias (read_count);

-- 4. Criar índice composto para filtros mensais mais eficientes
CREATE INDEX idx_noticias_pubdate_status_readcount ON noticias (
    publication_date,
    status,
    read_count
);

-- 5. Atualizar read_count baseado em visualizações existentes (se houver)
-- Isso irá calcular o read_count inicial baseado em dados já existentes
UPDATE noticias n
SET
    read_count = (
        SELECT COUNT(*)
        FROM news_views nv
        WHERE
            nv.news_id = n.id
    )
WHERE
    EXISTS (
        SELECT 1
        FROM news_views nv
        WHERE
            nv.news_id = n.id
    );
