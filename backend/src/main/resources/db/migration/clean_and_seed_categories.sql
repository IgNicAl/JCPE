-- Script para LIMPAR e RECRIAR todas as categorias corretamente
-- ATENÇÃO: Este script vai DELETAR todas as categorias existentes!

-- Desabilitar verificação de foreign key temporariamente
SET FOREIGN_KEY_CHECKS = 0;

-- Deletar todas as categorias
DELETE FROM categorias;

-- Reabilitar verificação de foreign key
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================
-- CRIAR CATEGORIAS PRINCIPAIS (9)
-- ============================================

-- 1. Pernambuco
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Pernambuco', 'pernambuco', 'Notícias sobre Pernambuco', 1, 1, NOW());

-- 2. Política
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Política', 'politica', 'Notícias sobre Política', 1, 2, NOW());

-- 3. Economia
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Economia', 'economia', 'Notícias sobre Economia', 1, 3, NOW());

-- 4. Esportes
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Esportes', 'esportes', 'Notícias sobre Esportes', 1, 4, NOW());

-- 5. Cultura
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Cultura', 'cultura', 'Notícias sobre Cultura', 1, 5, NOW());

-- 6. Mundo
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Mundo', 'mundo', 'Notícias Internacionais', 1, 6, NOW());

-- 7. Saúde
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Saúde', 'saude', 'Notícias sobre Saúde', 1, 7, NOW());

-- 8. Educação
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Educação', 'educacao', 'Notícias sobre Educação', 1, 8, NOW());

-- 9. Tecnologia
INSERT INTO categorias (id, name, slug, description, active, display_order, created_at)
VALUES (UUID(), 'Tecnologia', 'tecnologia', 'Notícias sobre Tecnologia', 1, 9, NOW());

-- ============================================
-- CRIAR SUBCATEGORIAS (50)
-- ============================================

-- Pernambuco (7 subcategorias)
SET @pernambuco_id = (SELECT id FROM categorias WHERE slug = 'pernambuco');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Região Metropolitana', 'metropolitana', 'Notícias da Região Metropolitana', @pernambuco_id, 1, 1, NOW()),
  (UUID(), 'Segurança Pública', 'seguranca', 'Notícias sobre Segurança Pública', @pernambuco_id, 1, 2, NOW()),
  (UUID(), 'Mobilidade', 'mobilidade', 'Notícias sobre Mobilidade', @pernambuco_id, 1, 3, NOW()),
  (UUID(), 'Interior', 'interior', 'Notícias do Interior', @pernambuco_id, 1, 4, NOW()),
  (UUID(), 'Educação Estadual', 'educacao-estadual', 'Notícias sobre Educação Estadual', @pernambuco_id, 1, 5, NOW()),
  (UUID(), 'Saúde Pública', 'saude-publica', 'Notícias sobre Saúde Pública', @pernambuco_id, 1, 6, NOW()),
  (UUID(), 'Turismo Local', 'turismo', 'Notícias sobre Turismo Local', @pernambuco_id, 1, 7, NOW());

-- Política (6 subcategorias)
SET @politica_id = (SELECT id FROM categorias WHERE slug = 'politica');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Governo Federal', 'federal', 'Notícias do Governo Federal', @politica_id, 1, 1, NOW()),
  (UUID(), 'Congresso e STF', 'congresso-stf', 'Notícias do Congresso e STF', @politica_id, 1, 2, NOW()),
  (UUID(), 'Eleições', 'eleicoes', 'Notícias sobre Eleições', @politica_id, 1, 3, NOW()),
  (UUID(), 'Bastidores', 'bastidores', 'Bastidores da Política', @politica_id, 1, 4, NOW()),
  (UUID(), 'Partidos', 'partidos', 'Notícias sobre Partidos', @politica_id, 1, 5, NOW()),
  (UUID(), 'Reforma Tributária', 'reforma', 'Notícias sobre Reforma Tributária', @politica_id, 1, 6, NOW());

-- Economia (6 subcategorias)
SET @economia_id = (SELECT id FROM categorias WHERE slug = 'economia');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Negócios', 'negocios', 'Notícias sobre Negócios', @economia_id, 1, 1, NOW()),
  (UUID(), 'Finanças Pessoais', 'financas', 'Notícias sobre Finanças Pessoais', @economia_id, 1, 2, NOW()),
  (UUID(), 'Emprego e Concursos', 'emprego', 'Notícias sobre Emprego e Concursos', @economia_id, 1, 3, NOW()),
  (UUID(), 'Agro', 'agro', 'Notícias sobre Agronegócio', @economia_id, 1, 4, NOW()),
  (UUID(), 'Mercado Imobiliário', 'imoveis', 'Notícias sobre Mercado Imobiliário', @economia_id, 1, 5, NOW()),
  (UUID(), 'Criptomoedas', 'cripto', 'Notícias sobre Criptomoedas', @economia_id, 1, 6, NOW());

-- Esportes (5 subcategorias)
SET @esportes_id = (SELECT id FROM categorias WHERE slug = 'esportes');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Futebol Pernambucano', 'futebol-pe', 'Notícias sobre Futebol Pernambucano', @esportes_id, 1, 1, NOW()),
  (UUID(), 'Futebol Nacional', 'futebol-br', 'Notícias sobre Futebol Nacional', @esportes_id, 1, 2, NOW()),
  (UUID(), 'Futebol Internacional', 'futebol-int', 'Notícias sobre Futebol Internacional', @esportes_id, 1, 3, NOW()),
  (UUID(), 'Outros Esportes', 'outros', 'Notícias sobre Outros Esportes', @esportes_id, 1, 4, NOW()),
  (UUID(), 'Tabela do Brasileirão', 'tabela', 'Tabela do Brasileirão', @esportes_id, 1, 5, NOW());

-- Cultura (6 subcategorias)
SET @cultura_id = (SELECT id FROM categorias WHERE slug = 'cultura');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Música', 'musica', 'Notícias sobre Música', @cultura_id, 1, 1, NOW()),
  (UUID(), 'Cinema', 'cinema', 'Notícias sobre Cinema', @cultura_id, 1, 2, NOW()),
  (UUID(), 'Teatro', 'teatro', 'Notícias sobre Teatro', @cultura_id, 1, 3, NOW()),
  (UUID(), 'Literatura', 'literatura', 'Notícias sobre Literatura', @cultura_id, 1, 4, NOW()),
  (UUID(), 'Artes Plásticas', 'artes', 'Notícias sobre Artes Plásticas', @cultura_id, 1, 5, NOW()),
  (UUID(), 'Agenda Cultural', 'agenda', 'Agenda Cultural', @cultura_id, 1, 6, NOW());

-- Mundo (5 subcategorias)
SET @mundo_id = (SELECT id FROM categorias WHERE slug = 'mundo');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Américas', 'americas', 'Notícias das Américas', @mundo_id, 1, 1, NOW()),
  (UUID(), 'Europa', 'europa', 'Notícias da Europa', @mundo_id, 1, 2, NOW()),
  (UUID(), 'Ásia e Oceania', 'asia-oceania', 'Notícias da Ásia e Oceania', @mundo_id, 1, 3, NOW()),
  (UUID(), 'Oriente Médio', 'oriente-medio', 'Notícias do Oriente Médio', @mundo_id, 1, 4, NOW()),
  (UUID(), 'Guerra na Ucrânia', 'ucrania', 'Cobertura da Guerra na Ucrânia', @mundo_id, 1, 5, NOW());

-- Saúde (5 subcategorias)
SET @saude_id = (SELECT id FROM categorias WHERE slug = 'saude');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Nutrição', 'nutricao', 'Notícias sobre Nutrição', @saude_id, 1, 1, NOW()),
  (UUID(), 'Fitness', 'fitness', 'Notícias sobre Fitness', @saude_id, 1, 2, NOW()),
  (UUID(), 'Saúde Mental', 'mental', 'Notícias sobre Saúde Mental', @saude_id, 1, 3, NOW()),
  (UUID(), 'Medicina', 'medicina', 'Notícias sobre Medicina', @saude_id, 1, 4, NOW()),
  (UUID(), 'Bem-Estar', 'bem-estar', 'Notícias sobre Bem-Estar', @saude_id, 1, 5, NOW());

-- Educação (5 subcategorias)
SET @educacao_id = (SELECT id FROM categorias WHERE slug = 'educacao');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Provas e Gabaritos', 'provas', 'Provas e Gabaritos', @educacao_id, 1, 1, NOW()),
  (UUID(), 'Dicas de Estudo', 'dicas', 'Dicas de Estudo', @educacao_id, 1, 2, NOW()),
  (UUID(), 'Profissões', 'profissoes', 'Notícias sobre Profissões', @educacao_id, 1, 3, NOW()),
  (UUID(), 'Universidades', 'universidades', 'Notícias sobre Universidades', @educacao_id, 1, 4, NOW()),
  (UUID(), 'Enem', 'enem', 'Notícias sobre Enem', @educacao_id, 1, 5, NOW());

-- Tecnologia (5 subcategorias)
SET @tecnologia_id = (SELECT id FROM categorias WHERE slug = 'tecnologia');
INSERT INTO categorias (id, name, slug, description, parent_category_id, active, display_order, created_at) VALUES
  (UUID(), 'Inovação', 'inovacao', 'Notícias sobre Inovação', @tecnologia_id, 1, 1, NOW()),
  (UUID(), 'Startups', 'startups', 'Notícias sobre Startups', @tecnologia_id, 1, 2, NOW()),
  (UUID(), 'Games', 'games', 'Notícias sobre Games', @tecnologia_id, 1, 3, NOW()),
  (UUID(), 'Ciência', 'ciencia', 'Notícias sobre Ciência', @tecnologia_id, 1, 4, NOW()),
  (UUID(), 'Gadgets', 'gadgets', 'Notícias sobre Gadgets', @tecnologia_id, 1, 5, NOW());

-- ============================================
-- VERIFICAÇÃO
-- ============================================
SELECT 'Script executado com sucesso!' as status;
SELECT COUNT(*) as total_categorias FROM categorias;
SELECT COUNT(*) as categorias_principais FROM categorias WHERE parent_category_id IS NULL;
SELECT COUNT(*) as subcategorias FROM categorias WHERE parent_category_id IS NOT NULL;
