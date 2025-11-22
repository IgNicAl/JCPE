-- Migration 8: Corrigir valores antigos de status nas notícias existentes
-- Data: 2025-11-22

-- Converter valores antigos do status para os valores do enum NewsStatus
UPDATE noticias SET status = 'PUBLISHED' WHERE status = 'PUBLICADO';

UPDATE noticias SET status = 'DRAFT' WHERE status = 'RASCUNHO';
