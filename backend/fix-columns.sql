-- Script para corrigir a coluna contentJson da tabela noticias
-- Execute este script se o Hibernate tiver problemas com o tipo JSON

-- Alterar coluna content_json para LONGTEXT
ALTER TABLE noticias MODIFY COLUMN content_json LONGTEXT NULL;

-- Adicionar coluna 'page' se não existir
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS page VARCHAR(50) DEFAULT 'noticias' NULL;

-- Adicionar coluna 'is_featured' se não existir  
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS is_featured TINYINT(1) DEFAULT 0 NOT NULL;

-- Criar índice para melhor performance ao filtrar por isFeatured
CREATE INDEX IF NOT EXISTS idx_is_featured ON noticias(is_featured);

-- Criar índice para filtrar por página e destaque
CREATE INDEX IF NOT EXISTS idx_page_featured ON noticias(page, is_featured);

-- Exibir estrutura da tabela para verificação
DESCRIBE noticias;
