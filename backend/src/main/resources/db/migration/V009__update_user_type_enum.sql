-- Atualiza a coluna user_type para incluir REVIEWER
ALTER TABLE users
MODIFY COLUMN user_type ENUM(
    'USER',
    'ADMIN',
    'JOURNALIST',
    'REVIEWER'
) NOT NULL;
