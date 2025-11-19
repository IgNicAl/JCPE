-- Script para migração: separar destaque da Home (is_featured_home) e destaque da página específica (is_featured_page)
-- Execute este script após garantir que o backend está parado

-- 1. Adicionar novas colunas
ALTER TABLE noticias 
ADD COLUMN IF NOT EXISTS is_featured_home TINYINT(1) DEFAULT 0 NOT NULL,
ADD COLUMN IF NOT EXISTS is_featured_page TINYINT(1) DEFAULT 0 NOT NULL;

-- 2. Migrar dados existentes: notícias que eram destaque ficam como destaque na Home
UPDATE noticias 
SET is_featured_home = is_featured 
WHERE is_featured = 1;

-- 3. Opcional: Remover a coluna antiga is_featured após verificar que tudo está funcionando
-- DESCOMENTE a linha abaixo apenas após testar e confirmar que está tudo OK
-- ALTER TABLE noticias DROP COLUMN is_featured;

-- 4. Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_is_featured_home ON noticias(is_featured_home);
CREATE INDEX IF NOT EXISTS idx_page_featured_page ON noticias(page, is_featured_page);

-- 5. Verificar as mudanças
SELECT id, title, page, is_featured_home, is_featured_page, status
FROM noticias 
ORDER BY publication_date DESC
LIMIT 10;
