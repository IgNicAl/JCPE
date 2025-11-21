-- Script para corrigir constraints de foreign key e permitir deletar usuários

-- 1. Modificar a coluna autor_id na tabela noticias para aceitar NULL
ALTER TABLE noticias MODIFY COLUMN autor_id CHAR(36) NULL;

-- 2. news_comments: ON DELETE CASCADE
ALTER TABLE news_comments
DROP FOREIGN KEY FKb3m8xh8vkopvlsp3f05njymrd;

ALTER TABLE news_comments
ADD CONSTRAINT news_comments_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 3. news_likes: ON DELETE CASCADE
ALTER TABLE news_likes DROP FOREIGN KEY news_likes_ibfk_1;

ALTER TABLE news_likes
ADD CONSTRAINT news_likes_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 4. news_ratings: ON DELETE CASCADE
ALTER TABLE news_ratings DROP FOREIGN KEY news_ratings_ibfk_1;

ALTER TABLE news_ratings
ADD CONSTRAINT news_ratings_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 5. news_shares: ON DELETE CASCADE
ALTER TABLE news_shares DROP FOREIGN KEY news_shares_ibfk_2;

ALTER TABLE news_shares
ADD CONSTRAINT news_shares_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- 6. noticias: ON DELETE SET NULL (autor)
ALTER TABLE noticias DROP FOREIGN KEY noticias_ibfk_1;

ALTER TABLE noticias
ADD CONSTRAINT noticias_author_fk FOREIGN KEY (autor_id) REFERENCES users (id) ON DELETE SET NULL;
