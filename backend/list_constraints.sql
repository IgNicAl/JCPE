-- Script para identificar constraints de foreign key existentes

SELECT
    TABLE_NAME,
    COLUMN_NAME,
    CONSTRAINT_NAME,
    REFERENCED_TABLE_NAME,
    REFERENCED_COLUMN_NAME
FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE
WHERE
    TABLE_SCHEMA = 'jcpe_db'
    AND REFERENCED_TABLE_NAME IS NOT NULL
    AND (
        (
            TABLE_NAME = 'news_comments'
            AND COLUMN_NAME = 'user_id'
        )
        OR (
            TABLE_NAME = 'news_likes'
            AND COLUMN_NAME = 'user_id'
        )
        OR (
            TABLE_NAME = 'news_ratings'
            AND COLUMN_NAME = 'user_id'
        )
        OR (
            TABLE_NAME = 'news_shares'
            AND COLUMN_NAME = 'user_id'
        )
        OR (
            TABLE_NAME = 'noticias'
            AND COLUMN_NAME = 'autor_id'
        )
    )
ORDER BY TABLE_NAME, COLUMN_NAME;
