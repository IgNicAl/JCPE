-- Seed: Categorias Padrão
-- Data: 2025-11-22

INSERT INTO
    categorias (
        id,
        name,
        slug,
        description,
        color,
        active,
        display_order,
        created_at,
        updated_at
    )
VALUES (
        UUID(),
        'Política',
        'politica',
        'Notícias sobre política local, estadual e nacional',
        '#FF6B6B',
        TRUE,
        1,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Esportes',
        'esportes',
        'Cobertura esportiva completa - futebol, olimpíadas e mais',
        '#4ECDC4',
        TRUE,
        2,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Economia',
        'economia',
        'Notícias econômicas, mercado financeiro e negócios',
        '#45B7D1',
        TRUE,
        3,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Cultura',
        'cultura',
        'Arte, cinema, música, teatro e entretenimento',
        '#FFA07A',
        TRUE,
        4,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Tecnologia',
        'tecnologia',
        'Inovação, ciência e avanços tecnológicos',
        '#98D8C8',
        TRUE,
        5,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Saúde',
        'saude',
        'Saúde, bem-estar e qualidade de vida',
        '#95E1D3',
        TRUE,
        6,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Educação',
        'educacao',
        'Educação, ensino e desenvolvimento acadêmico',
        '#F38181',
        TRUE,
        7,
        NOW(),
        NOW()
    )
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    color = VALUES(color);
