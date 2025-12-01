-- Script to seed news with categories for Agent testing
-- Uses subqueries to find category IDs by name

-- 1. Política
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        media_type,
        media_source,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        author_id,
        category_id,
        created_at,
        updated_at
    )
SELECT
    UUID(),
    'Governo anuncia novo pacote de medidas econômicas',
    'governo-anuncia-novo-pacote-medidas-economicas',
    'O governo federal divulgou hoje um conjunto de ações para estimular o crescimento.',
    'O governo federal divulgou hoje um conjunto de ações para estimular o crescimento econômico. As medidas incluem redução de impostos para setores estratégicos e incentivos à inovação. Especialistas analisam o impacto fiscal...',
    '{}',
    'https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=1000',
    'image',
    'external_url',
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
    NOW(),
    NOW()
WHERE
    EXISTS (
        SELECT 1
        FROM categorias
        WHERE
            name = 'Política'
    );

-- 2. Esportes
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        media_type,
        media_source,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        author_id,
        category_id,
        created_at,
        updated_at
    )
SELECT
    UUID(),
    'Final do campeonato estadual será neste domingo',
    'final-campeonato-estadual-domingo',
    'Os dois maiores times do estado se enfrentam na grande final.',
    'A expectativa é grande para a final do campeonato estadual. Os ingressos já estão esgotados e as torcidas prometem uma grande festa. O jogo decisivo acontecerá no estádio principal...',
    '{}',
    'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000',
    'image',
    'external_url',
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
    NOW(),
    NOW()
WHERE
    EXISTS (
        SELECT 1
        FROM categorias
        WHERE
            name = 'Esportes'
    );

-- 3. Tecnologia
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        media_type,
        media_source,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        author_id,
        category_id,
        created_at,
        updated_at
    )
SELECT
    UUID(),
    'Nova IA revoluciona o mercado de desenvolvimento',
    'nova-ia-revoluciona-mercado-desenvolvimento',
    'Ferramenta capaz de escrever código complexo ganha destaque.',
    'Uma nova inteligência artificial está mudando a forma como programadores trabalham. Capaz de gerar código complexo e resolver bugs, a ferramenta promete aumentar a produtividade em até 50%...',
    '{}',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000',
    'image',
    'external_url',
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
    NOW(),
    NOW()
WHERE
    EXISTS (
        SELECT 1
        FROM categorias
        WHERE
            name = 'Tecnologia'
    );

-- 4. Economia
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        media_type,
        media_source,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        author_id,
        category_id,
        created_at,
        updated_at
    )
SELECT
    UUID(),
    'Bolsa de valores fecha em alta com otimismo externo',
    'bolsa-valores-fecha-alta-otimismo',
    'Investidores reagem positivamente aos dados internacionais.',
    'O índice Ibovespa fechou em alta nesta quarta-feira, impulsionado pelo otimismo nos mercados internacionais. Ações de commodities e bancos lideraram os ganhos...',
    '{}',
    'https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=1000',
    'image',
    'external_url',
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
            name = 'Economia'
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    EXISTS (
        SELECT 1
        FROM categorias
        WHERE
            name = 'Economia'
    );

-- 5. Cultura
INSERT INTO
    noticias (
        id,
        title,
        slug,
        summary,
        content,
        content_json,
        featured_image_url,
        media_type,
        media_source,
        priority,
        page,
        is_featured_home,
        is_featured_page,
        publication_date,
        status,
        author_id,
        category_id,
        created_at,
        updated_at
    )
SELECT
    UUID(),
    'Festival de cinema premia produções locais',
    'festival-cinema-premia-producoes-locais',
    'O evento destacou o talento dos cineastas da região.',
    'A noite de premiação do Festival de Cinema foi marcada pela emoção. Diversas produções locais foram reconhecidas, mostrando a força e a criatividade do cinema regional...',
    '{}',
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000',
    'image',
    'external_url',
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
            name = 'Cultura'
        LIMIT 1
    ),
    NOW(),
    NOW()
WHERE
    EXISTS (
        SELECT 1
        FROM categorias
        WHERE
            name = 'Cultura'
    );
