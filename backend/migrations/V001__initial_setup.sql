-- =======================================================================
-- MIGRAÇÃO INICIAL DOCKER - V001
-- =======================================================================
-- Este arquivo é executado ANTES do Spring Boot iniciar, através do
-- docker-entrypoint.sh. Contém configurações que precisam estar prontas
-- antes das migrações Flyway.
--
-- Data: 2025-12-01
-- Descrição: Consolidação de scripts de configuração inicial do banco
-- =======================================================================

-- =======================================================================
-- SEÇÃO 1: CORREÇÕES DE FOREIGN KEYS COM CASCADE
-- =======================================================================
-- Permite deletar usuários sem violar constraints de foreign key

-- 1.1. Modificar a coluna autor_id na tabela noticias para aceitar NULL
ALTER TABLE noticias
MODIFY COLUMN autor_id CHAR(36) NULL;

-- 1.2. Adicionar ON DELETE CASCADE para news_comments
ALTER TABLE news_comments
DROP FOREIGN KEY IF EXISTS news_comments_ibfk_2,
DROP FOREIGN KEY IF EXISTS news_comments_user_fk;

ALTER TABLE news_comments
ADD CONSTRAINT news_comments_user_fk
FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 1.3. Adicionar ON DELETE CASCADE para news_likes
ALTER TABLE news_likes
DROP FOREIGN KEY IF EXISTS news_likes_ibfk_1,
DROP FOREIGN KEY IF EXISTS news_likes_user_fk;

ALTER TABLE news_likes
ADD CONSTRAINT news_likes_user_fk
FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 1.4. Adicionar ON DELETE CASCADE para news_ratings
ALTER TABLE news_ratings
DROP FOREIGN KEY IF EXISTS news_ratings_ibfk_1,
DROP FOREIGN KEY IF EXISTS news_ratings_user_fk;

ALTER TABLE news_ratings
ADD CONSTRAINT news_ratings_user_fk
FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 1.5. Adicionar ON DELETE CASCADE para news_shares
ALTER TABLE news_shares
DROP FOREIGN KEY IF EXISTS news_shares_ibfk_2,
DROP FOREIGN KEY IF EXISTS news_shares_user_fk;

ALTER TABLE news_shares
ADD CONSTRAINT news_shares_user_fk
FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 1.6. Adicionar ON DELETE SET NULL para noticias (autor)
ALTER TABLE noticias
DROP FOREIGN KEY IF EXISTS noticias_ibfk_1,
DROP FOREIGN KEY IF EXISTS noticias_author_fk;

ALTER TABLE noticias
ADD CONSTRAINT noticias_author_fk
FOREIGN KEY (autor_id) REFERENCES users (id) ON DELETE SET NULL;

-- =======================================================================
-- SEÇÃO 2: SISTEMA DE VISUALIZAÇÕES DE NOTÍCIAS
-- =======================================================================
-- Adiciona tabela news_views e coluna read_count para rastreamento

-- 2.1. Criar tabela news_views
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

-- 2.2. Adicionar coluna read_count à tabela noticias (ignora se já existir)
SET @col_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'noticias'
    AND COLUMN_NAME = 'read_count'
);

SET @sql = IF(@col_exists = 0,
    'ALTER TABLE noticias ADD COLUMN read_count BIGINT NOT NULL DEFAULT 0',
    'SELECT "Coluna read_count já existe" AS Info'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- 2.3. Criar índice para read_count (para queries de ordenação)
CREATE INDEX IF NOT EXISTS idx_noticias_read_count ON noticias (read_count);

-- 2.4. Criar índice composto para filtros mensais mais eficientes
CREATE INDEX IF NOT EXISTS idx_noticias_pubdate_status_readcount ON noticias (
    publication_date,
    status,
    read_count
);

-- 2.5. Atualizar read_count baseado em visualizações existentes (se houver)
UPDATE noticias n
SET read_count = (
    SELECT COUNT(*)
    FROM news_views nv
    WHERE nv.news_id = n.id
)
WHERE EXISTS (
    SELECT 1
    FROM news_views nv
    WHERE nv.news_id = n.id
);

-- =======================================================================
-- SEÇÃO 3: TABELA DE ANÚNCIOS
-- =======================================================================
-- Sistema de gerenciamento de anúncios/publicidade

CREATE TABLE IF NOT EXISTS advertisements (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    link_url VARCHAR(512) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    location VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    click_count INT NOT NULL DEFAULT 0,
    impression_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_location (location),
    INDEX idx_is_active_location (is_active, location)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- =======================================================================
-- SEÇÃO 4: USUÁRIO ADMINISTRADOR PADRÃO
-- =======================================================================
-- Cria usuário admin se não existir
-- Credenciais: username=admin, senha=admcesar

INSERT INTO users (
    id,
    user_type,
    name,
    username,
    email,
    password,
    profile_image_url,
    biography,
    active,
    registration_date,
    total_screen_time_seconds,
    points
)
SELECT
    UUID(),
    'ADMIN',
    'Administrador do Sistema',
    'admin',
    'admin@jcpe.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'https://via.placeholder.com/150',
    'Administrador responsável pelo sistema JCPE',
    TRUE,
    NOW(),
    0,
    0
WHERE NOT EXISTS (
    SELECT 1 FROM users WHERE username = 'admin'
);

-- =======================================================================
-- FIM DA MIGRAÇÃO
-- =======================================================================
