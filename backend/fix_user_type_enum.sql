-- Script manual para adicionar REVIEWER ao enum user_type
-- Execute este script diretamente no MySQL para corrigir o schema

USE jcpe_db;

-- Atualizar a coluna user_type para incluir REVIEWER
ALTER TABLE users
MODIFY COLUMN user_type ENUM(
    'USER',
    'JOURNALIST',
    'REVIEWER',
    'ADMIN'
) NOT NULL DEFAULT 'USER';

-- Verificar a alteração
SHOW COLUMNS FROM users LIKE 'user_type';
