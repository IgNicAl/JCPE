-- Fix Schema and Seed Data (Complete)

-- 1. Drop 'categorias' to recreate with correct collation
DROP TABLE IF EXISTS categorias;

-- 2. Create 'categorias' table with matching collation
CREATE TABLE categorias (
    id CHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    color VARCHAR(255),
    icon VARCHAR(255),
    parent_category_id CHAR(36),
    active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    UNIQUE KEY uk_slug (slug),
    KEY idx_category_parent (parent_category_id),
    KEY idx_category_active (active),
    CONSTRAINT fk_category_parent FOREIGN KEY (parent_category_id) REFERENCES categorias (id) ON DELETE SET NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;

-- 3. Ensure 'category_id' exists and has correct collation
ALTER TABLE noticias
MODIFY COLUMN category_id CHAR(36) COLLATE utf8mb4_0900_ai_ci;

-- 4. Seed Admin User (Required for News)
INSERT INTO
    users (
        id,
        active,
        email,
        name,
        password,
        points,
        registration_date,
        total_screen_time_seconds,
        user_type,
        username
    )
VALUES (
        UUID(),
        TRUE,
        'admin@jcpe.com',
        'Admin',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- hash
        0,
        NOW(),
        0,
        'ADMIN',
        'admin'
    )
ON DUPLICATE KEY UPDATE
    name = VALUES(name);

-- 5. Seed Categories
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
        'Notícias sobre política',
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
        'Notícias sobre esportes',
        '#4ECDC4',
        TRUE,
        2,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Tecnologia',
        'tecnologia',
        'Notícias sobre tecnologia',
        '#98D8C8',
        TRUE,
        3,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Economia',
        'economia',
        'Notícias sobre economia',
        '#45B7D1',
        TRUE,
        4,
        NOW(),
        NOW()
    ),
    (
        UUID(),
        'Cultura',
        'cultura',
        'Notícias sobre cultura',
        '#FFA07A',
        TRUE,
        5,
        NOW(),
        NOW()
    );

-- 6. Seed News linked to Categories
-- Política
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        autor_id,
        category_id,
        update_date
    )
SELECT
    UUID(),
    'Governo anuncia novo pacote de medidas econômicas',
    'governo-anuncia-novo-pacote-medidas-economicas',
    'O governo federal divulgou hoje um conjunto de ações para estimular o crescimento.',
    'O governo federal divulgou hoje um conjunto de ações para estimular o crescimento econômico. As medidas incluem redução de impostos para setores estratégicos e incentivos à inovação. Especialistas analisam o impacto fiscal...',
    '{}',
    'https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=1000',
    1,
    'noticias',
    TRUE,
    TRUE,
    NOW(),
    'PUBLISHED',
    (
        SELECT id
        FROM users
        WHERE
            username = 'admin'
        LIMIT 1
    ),
    (
        SELECT id
        FROM categorias
        WHERE
            name = 'Política'
        LIMIT 1
    ),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM noticias
        WHERE
            slug = 'governo-anuncia-novo-pacote-medidas-economicas'
    );

-- Esportes
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        autor_id,
        category_id,
        update_date
    )
SELECT
    UUID(),
    'Final do campeonato estadual será neste domingo',
    'final-campeonato-estadual-domingo',
    'Os dois maiores times do estado se enfrentam na grande final.',
    'A expectativa é grande para a final do campeonato estadual. Os ingressos já estão esgotados e as torcidas prometem uma grande festa. O jogo decisivo acontecerá no estádio principal...',
    '{}',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000',
    1,
    'noticias',
    TRUE,
    TRUE,
    NOW(),
    'PUBLISHED',
    (
        SELECT id
        FROM users
        WHERE
            username = 'admin'
        LIMIT 1
    ),
    (
        SELECT id
        FROM categorias
        WHERE
            name = 'Esportes'
        LIMIT 1
    ),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM noticias
        WHERE
            slug = 'final-campeonato-estadual-domingo'
    );

-- Tecnologia
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        autor_id,
        category_id,
        update_date
    )
SELECT
    UUID(),
    'Nova IA revoluciona o mercado de desenvolvimento',
    'nova-ia-revoluciona-mercado-desenvolvimento',
    'Ferramenta capaz de escrever código complexo ganha destaque.',
    'Uma nova inteligência artificial está mudando a forma como programadores trabalham. Capaz de gerar código complexo e resolver bugs, a ferramenta promete aumentar a produtividade em até 50%...',
    '{}',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
    1,
    'noticias',
    TRUE,
    TRUE,
    NOW(),
    'PUBLISHED',
    (
        SELECT id
        FROM users
        WHERE
            username = 'admin'
        LIMIT 1
    ),
    (
        SELECT id
        FROM categorias
        WHERE
            name = 'Tecnologia'
        LIMIT 1
    ),
    NOW()
WHERE
    NOT EXISTS (
        SELECT 1
        FROM noticias
        WHERE
            slug = 'nova-ia-revoluciona-mercado-desenvolvimento'
    );

-- 7. Add Constraint
ALTER TABLE noticias
ADD CONSTRAINT fk_noticias_category FOREIGN KEY (category_id) REFERENCES categorias (id);
