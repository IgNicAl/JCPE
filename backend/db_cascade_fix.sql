-- Alterações para permitir deletar usuários sem violar constraints de foreign key

-- 1. Modificar a coluna autor_id na tabela noticias para aceitar NULL
ALTER TABLE noticias MODIFY COLUMN autor_id CHAR(36) NULL;

-- 2. Adicionar ON DELETE CASCADE para news_comments
ALTER TABLE news_comments
DROP FOREIGN KEY IF EXISTS news_comments_ibfk_2;

ALTER TABLE news_comments
ADD CONSTRAINT news_comments_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 3. Adicionar ON DELETE CASCADE para news_likes
ALTER TABLE news_likes DROP FOREIGN KEY IF EXISTS news_likes_ibfk_1;

ALTER TABLE news_likes
ADD CONSTRAINT news_likes_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 4. Adicionar ON DELETE CASCADE para news_ratings
ALTER TABLE news_ratings
DROP FOREIGN KEY IF EXISTS news_ratings_ibfk_1;

ALTER TABLE news_ratings
ADD CONSTRAINT news_ratings_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 5. Adicionar ON DELETE CASCADE para news_shares
ALTER TABLE news_shares
DROP FOREIGN KEY IF EXISTS news_shares_ibfk_2;

ALTER TABLE news_shares
ADD CONSTRAINT news_shares_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 6. Adicionar ON DELETE SET NULL para news (autor)
ALTER TABLE noticias DROP FOREIGN KEY IF EXISTS noticias_ibfk_1;

ALTER TABLE noticias
ADD CONSTRAINT noticias_author_fk FOREIGN KEY (autor_id) REFERENCES users (id) ON DELETE SET NULL;
