-- Script para corrigir constraints de foreign key (versão segura)
-- Este script verifica a existência de constraints antes de modificá-las

-- 1. Modificar a coluna autor_id na tabela noticias para aceitar NULL (sempre seguro executar)
ALTER TABLE noticias MODIFY COLUMN autor_id CHAR(36) NULL;

-- 2. Criar procedure temporária para dropar constraint se existir
DELIMITER $$

DROP PROCEDURE IF EXISTS drop_fk_if_exists$$

CREATE PROCEDURE drop_fk_if_exists(
    IN tableName VARCHAR(64),
    IN constraintName VARCHAR(64)
)
BEGIN
    DECLARE constraint_count INT;

    SELECT COUNT(*) INTO constraint_count
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
        AND TABLE_NAME = tableName
        AND CONSTRAINT_NAME = constraintName
        AND CONSTRAINT_TYPE = 'FOREIGN KEY';

    IF constraint_count > 0 THEN
        SET @sql = CONCAT('ALTER TABLE ', tableName, ' DROP FOREIGN KEY ', constraintName);
        PREPARE stmt FROM @sql;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
END$$

DELIMITER;

-- 3. Aplicar correções usando a procedure

-- news_comments
CALL drop_fk_if_exists (
    'news_comments',
    'FKb3m8xh8vkopvlsp3f05njymrd'
);

CALL drop_fk_if_exists ( 'news_comments', 'news_comments_ibfk_1' );

CALL drop_fk_if_exists ( 'news_comments', 'news_comments_ibfk_2' );

CALL drop_fk_if_exists ( 'news_comments', 'news_comments_user_fk' );

ALTER TABLE news_comments
ADD CONSTRAINT news_comments_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- news_likes
CALL drop_fk_if_exists ( 'news_likes', 'news_likes_ibfk_1' );

CALL drop_fk_if_exists ( 'news_likes', 'news_likes_user_fk' );

CALL drop_fk_if_exists ( 'news_likes', 'FKoq30tqwiogq8jwm3d55qxy5ex' );

ALTER TABLE news_likes
ADD CONSTRAINT news_likes_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- news_ratings
CALL drop_fk_if_exists ( 'news_ratings', 'news_ratings_ibfk_1' );

CALL drop_fk_if_exists ( 'news_ratings', 'news_ratings_user_fk' );

CALL drop_fk_if_exists (
    'news_ratings',
    'FKa30xqd1qx6li2bxykt6tx8h3j'
);

ALTER TABLE news_ratings
ADD CONSTRAINT news_ratings_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- news_shares
CALL drop_fk_if_exists ( 'news_shares', 'news_shares_ibfk_1' );

CALL drop_fk_if_exists ( 'news_shares', 'news_shares_ibfk_2' );

CALL drop_fk_if_exists ( 'news_shares', 'news_shares_user_fk' );

CALL drop_fk_if_exists ( 'news_shares', 'FK6uyjp8pdkvqh46bh1vywpkfjo' );

ALTER TABLE news_shares
ADD CONSTRAINT news_shares_user_fk FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE;

-- noticias (autor)
CALL drop_fk_if_exists ('noticias', 'noticias_ibfk_1');

CALL drop_fk_if_exists ( 'noticias', 'noticias_author_fk' );

CALL drop_fk_if_exists ( 'noticias', 'FK8pabpy4vqfj0c8hqxc8b9fw81' );

ALTER TABLE noticias
ADD CONSTRAINT noticias_author_fk FOREIGN KEY (autor_id) REFERENCES users (id) ON DELETE SET NULL;

-- 4. Remover a procedure temporária
DROP PROCEDURE IF EXISTS drop_fk_if_exists;

-- Mensagem de sucesso
SELECT '✅ Constraints atualizadas com sucesso!' AS Status;
