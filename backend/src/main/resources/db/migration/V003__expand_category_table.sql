-- Migration 3: Expandir tabela Category (categorias)
-- Data: 2025-11-22

-- Adicionar novos campos para hierarquia, ícone e status
ALTER TABLE categorias
ADD COLUMN icon VARCHAR(255) NULL AFTER color,
ADD COLUMN parent_category_id CHAR(36) NULL AFTER icon,
ADD COLUMN active BOOLEAN NOT NULL DEFAULT TRUE AFTER parent_category_id,
ADD COLUMN display_order INT NOT NULL DEFAULT 0 AFTER active,
ADD CONSTRAINT fk_category_parent FOREIGN KEY (parent_category_id) REFERENCES categorias (id) ON DELETE SET NULL;

-- Criar índice para busca por parent
CREATE INDEX idx_category_parent ON categorias (parent_category_id);

CREATE INDEX idx_category_active ON categorias (active);
