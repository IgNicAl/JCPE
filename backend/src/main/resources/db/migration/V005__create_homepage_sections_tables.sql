-- Migration 5: Criar tabelas homepage_sections e news_homepage_sections
-- Data: 2025-11-22

-- Tabela de seções da homepage
CREATE TABLE homepage_sections (
    id CHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE COMMENT 'Nome da seção ex: Latest Videos',
    slug VARCHAR(100) NOT NULL UNIQUE COMMENT 'Identificador único ex: latest-videos',
    description VARCHAR(512) NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_homepage_section_slug (slug),
    INDEX idx_homepage_section_active (active)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Seções da homepage onde notícias podem ser destacadas';

-- Tabela de relacionamento many-to-many entre News e HomepageSection
CREATE TABLE news_homepage_sections (
    news_id CHAR(36) NOT NULL,
    section_id CHAR(36) NOT NULL,
    PRIMARY KEY (news_id, section_id),
    CONSTRAINT fk_nhs_news FOREIGN KEY (news_id) REFERENCES noticias (id) ON DELETE CASCADE,
    CONSTRAINT fk_nhs_section FOREIGN KEY (section_id) REFERENCES homepage_sections (id) ON DELETE CASCADE,
    INDEX idx_nhs_section (section_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci COMMENT = 'Relacionamento entre notícias e seções da homepage';
