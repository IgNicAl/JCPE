-- Migration 1: Adicionar REVIEWER ao UserType
-- Data: 2025-11-22

-- Atualizar enum na tabela users
ALTER TABLE users
MODIFY COLUMN user_type ENUM(
    'USER',
    'JOURNALIST',
    'REVIEWER',
    'ADMIN'
) NOT NULL DEFAULT 'USER';
