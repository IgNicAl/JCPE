-- Script para adicionar as colunas de featured news à tabela noticias
-- Execute este script no seu banco de dados se o Hibernate não conseguir criar as colunas

-- Adicionar coluna 'page' se não existir
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS page VARCHAR(50) DEFAULT 'noticias' NULL;

-- Adicionar coluna 'is_featured' se não existir  
ALTER TABLE noticias ADD COLUMN IF NOT EXISTS is_featured TINYINT(1) DEFAULT 0 NOT NULL;

-- Criar índice para melhor performance ao filtrar por isFeatured
CREATE INDEX IF NOT EXISTS idx_is_featured ON noticias(is_featured);

-- Criar índice para filtrar por página e destaque
CREATE INDEX IF NOT EXISTS idx_page_featured ON noticias(page, is_featured);
