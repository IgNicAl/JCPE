-- Seed: Homepage Sections Padrão
-- Data: 2025-11-22

INSERT INTO
    homepage_sections (
        id,
        name,
        slug,
        description,
        active,
        created_at
    )
VALUES (
        UUID(),
        'Latest Videos',
        'latest-videos',
        'Últimos vídeos publicados',
        TRUE,
        NOW()
    ),
    (
        UUID(),
        'New Posts',
        'new-posts',
        'Novas publicações recentes',
        TRUE,
        NOW()
    ),
    (
        UUID(),
        'Popular Posts',
        'popular-posts',
        'Postagens mais populares',
        TRUE,
        NOW()
    ),
    (
        UUID(),
        'Trendy Posts',
        'trendy-posts',
        'Postagens em alta no momento',
        TRUE,
        NOW()
    ),
    (
        UUID(),
        'Top Posts',
        'top-posts',
        'Melhores postagens selecionadas',
        TRUE,
        NOW()
    ),
    (
        UUID(),
        'Featured',
        'featured',
        'Destaque principal / Banner da homepage',
        TRUE,
        NOW()
    )
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description);
