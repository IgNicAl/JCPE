-- Migration 4: Criar tabela news_review_logs
-- Data: 2025-11-22

CREATE TABLE news_review_logs (
    id CHAR(36) PRIMARY KEY,
    news_id CHAR(36) NOT NULL,
    reviewer_id CHAR(36) NOT NULL,
    action VARCHAR(50) NOT NULL COMMENT 'APPROVED, REJECTED, REQUESTED_CHANGES',
    comment TEXT NULL,
    timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_review_log_news FOREIGN KEY (news_id) REFERENCES noticias (id) ON DELETE CASCADE,
    CONSTRAINT fk_review_log_reviewer FOREIGN KEY (reviewer_id) REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_review_log_news (news_id),
    INDEX idx_review_log_reviewer (reviewer_id),
    INDEX idx_review_log_timestamp (timestamp)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Audit log de revisões de notícias';
