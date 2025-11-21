-- Alterações para permitir deletar usuários sem violar constraints de foreign key

-- 1. Modificar a coluna autor_id na tabela noticias para aceitar NULL
ALTER TABLE noticias MODIFY COLUMN autor_id CHAR(36) NULL;

-- 2. Adicionar ON DELETE CASCADE para news_comments
-- Primeiro, identificar o nome da constraint existente
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_NAME = 'news_comments'
    AND COLUMN_NAME = 'user_id'
    AND TABLE_SCHEMA = 'jcpe_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Remover a constraint antiga (substitua FKb3m8xh8vkopvlsp3f05njymrd pelo nome correto se diferente)
ALTER TABLE news_comments
DROP FOREIGN KEY FKb3m8xh8vkopvlsp3f05njymrd;

-- Adicionar nova constraint com ON DELETE CASCADE
ALTER TABLE news_comments
ADD CONSTRAINT news_comments_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 3. Adicionar ON DELETE CASCADE para news_likes
-- Identificar constraint
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_NAME = 'news_likes'
    AND COLUMN_NAME = 'user_id'
    AND TABLE_SCHEMA = 'jcpe_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Remover constraint antiga
ALTER TABLE news_likes DROP FOREIGN KEY news_likes_ibfk_1;

-- Adicionar nova constraint
ALTER TABLE news_likes
ADD CONSTRAINT news_likes_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 4. Adicionar ON DELETE CASCADE para news_ratings
-- Identificar constraint
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_NAME = 'news_ratings'
    AND COLUMN_NAME = 'user_id'
    AND TABLE_SCHEMA = 'jcpe_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Remover constraint antiga
ALTER TABLE news_ratings DROP FOREIGN KEY news_ratings_ibfk_1;

-- Adicionar nova constraint
ALTER TABLE news_ratings
ADD CONSTRAINT news_ratings_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 5. Adicionar ON DELETE CASCADE para news_shares
-- Identificar constraint
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_NAME = 'news_shares'
    AND COLUMN_NAME = 'user_id'
    AND TABLE_SCHEMA = 'jcpe_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Remover constraint antiga
ALTER TABLE news_shares DROP FOREIGN KEY news_shares_ibfk_2;

-- Adicionar nova constraint
ALTER TABLE news_shares
ADD CONSTRAINT news_shares_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 6. Adicionar ON DELETE SET NULL para news (autor)
-- Identificar constraint
SELECT CONSTRAINT_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_NAME = 'noticias'
    AND COLUMN_NAME = 'autor_id'
    AND TABLE_SCHEMA = 'jcpe_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL;

-- Remover constraint antiga
ALTER TABLE noticias DROP FOREIGN KEY noticias_ibfk_1;

-- Adicionar nova constraint
ALTER TABLE noticias
ADD CONSTRAINT noticias_author_fk FOREIGN KEY (autor_id) REFERENCES users (id) ON DELETE SET NULL;
