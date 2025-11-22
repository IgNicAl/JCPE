-- Migration 2: Adicionar campos de revisão na tabela News (noticias)
-- Data: 2025-11-22

-- PASSO 1: Migrar dados existentes ANTES de alterar o tipo da coluna
-- Converter valores antigos para os novos valores do enum
UPDATE noticias SET status = 'PUBLISHED' WHERE status = 'PUBLICADO';

UPDATE noticias SET status = 'DRAFT' WHERE status = 'RASCUNHO';

-- PASSO 2: Alterar status de String para ENUM
ALTER TABLE noticias
MODIFY COLUMN status ENUM(
    'DRAFT',
    'PENDING_REVIEW',
    'APPROVED',
    'REJECTED',
    'PUBLISHED'
) NOT NULL DEFAULT 'DRAFT';

-- PASSO 3: Adicionar novos campos para workflow de aprovação
ALTER TABLE noticias
-- Adicionar novo campo de prioridade enum
ADD COLUMN news_priority ENUM(
    'LOW',
    'MEDIUM',
    'HIGH',
    'BREAKING'
) NOT NULL DEFAULT 'MEDIUM' AFTER status,

-- Campos de revisão
ADD COLUMN reviewed_by CHAR(36) NULL AFTER news_priority,
ADD COLUMN reviewed_at DATETIME NULL AFTER reviewed_by,
ADD COLUMN scheduled_publish_date DATETIME NULL AFTER reviewed_at,

-- Campos SEO
ADD COLUMN seo_title VARCHAR(255) NULL AFTER scheduled_publish_date,
ADD COLUMN seo_meta_description VARCHAR(512) NULL AFTER seo_title;

-- PASSO 4: Adicionar foreign key para reviewed_by
ALTER TABLE noticias
ADD CONSTRAINT fk_news_reviewer FOREIGN KEY (reviewed_by) REFERENCES users (id) ON DELETE SET NULL;

-- PASSO 5: Criar índices para performance
CREATE INDEX idx_news_status ON noticias (status);

CREATE INDEX idx_news_reviewed_at ON noticias (reviewed_at);

CREATE INDEX idx_news_scheduled_publish ON noticias (scheduled_publish_date);
