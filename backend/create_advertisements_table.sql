-- Script SQL para criar tabela de anúncios
-- Execute este script no banco de dados MySQL

CREATE TABLE IF NOT EXISTS advertisements (
    id CHAR(36) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(512) NOT NULL,
    link_url VARCHAR(512) NOT NULL,
    width INT NOT NULL,
    height INT NOT NULL,
    location VARCHAR(20) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    click_count INT NOT NULL DEFAULT 0,
    impression_count INT NOT NULL DEFAULT 0,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_is_active (is_active),
    INDEX idx_location (location),
    INDEX idx_is_active_location (is_active, location)
);

-- Dados de exemplo (opcional - remover em produção)
INSERT INTO
    advertisements (
        id,
        title,
        image_url,
        link_url,
        width,
        height,
        location,
        is_active
    )
VALUES (
        UUID(),
        'Anúncio de Demonstração',
        'https://via.placeholder.com/350x180/FF6B35/FFFFFF?text=Anúncio+Demo',
        'https://example.com',
        350,
        180,
        'id',
        TRUE
    );
