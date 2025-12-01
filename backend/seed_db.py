import os
import pymysql
import uuid

# Database credentials
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = int(os.getenv("DB_PORT", 3306))
DB_USER = os.getenv("DB_USER", "root")
DB_PASSWORD = os.getenv("DB_PASSWORD", "51190290")
DB_NAME = os.getenv("DB_NAME", "jcpm_db")


def get_connection():
    return pymysql.connect(
        host=DB_HOST,
        port=DB_PORT,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        cursorclass=pymysql.cursors.DictCursor,
        autocommit=True,
    )


def run_seed():
    print(f"Connecting to {DB_NAME} at {DB_HOST}...")
    try:
        conn = get_connection()
    except Exception as e:
        print(f"Failed to connect: {e}")
        return

    try:
        with conn.cursor() as cursor:
            # 1. Create 'categorias' table
            print("Checking 'categorias' table...")
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS categorias (
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
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
            """)

            # 2. Add 'category_id' to 'noticias'
            print("Checking 'category_id' column in 'noticias'...")
            cursor.execute("SHOW COLUMNS FROM noticias LIKE 'category_id'")
            if not cursor.fetchone():
                print("Adding 'category_id' column...")
                cursor.execute("ALTER TABLE noticias ADD COLUMN category_id CHAR(36)")
                cursor.execute(
                    "ALTER TABLE noticias ADD CONSTRAINT fk_noticias_category FOREIGN KEY (category_id) REFERENCES categorias (id)"
                )
            else:
                print("'category_id' column already exists.")

            # 3. Seed Categories
            print("Seeding categories...")
            categories = [
                ("Política", "politica", "Notícias sobre política", "#FF6B6B"),
                ("Esportes", "esportes", "Notícias sobre esportes", "#4ECDC4"),
                ("Tecnologia", "tecnologia", "Notícias sobre tecnologia", "#98D8C8"),
                ("Economia", "economia", "Notícias sobre economia", "#45B7D1"),
                ("Cultura", "cultura", "Notícias sobre cultura", "#FFA07A"),
            ]

            for name, slug, desc, color in categories:
                cursor.execute("SELECT id FROM categorias WHERE slug = %s", (slug,))
                if not cursor.fetchone():
                    cursor.execute(
                        """
                        INSERT INTO categorias (id, name, slug, description, color, active, display_order, created_at, updated_at)
                        VALUES (%s, %s, %s, %s, %s, TRUE, 0, NOW(), NOW())
                    """,
                        (str(uuid.uuid4()), name, slug, desc, color),
                    )

            # 4. Seed News
            print("Seeding news...")

            # Helper to get category ID
            def get_cat_id(slug):
                cursor.execute("SELECT id FROM categorias WHERE slug = %s", (slug,))
                res = cursor.fetchone()
                return res["id"] if res else None

            # Helper to get admin ID
            cursor.execute("SELECT id FROM users WHERE username = 'admin'")
            res = cursor.fetchone()
            admin_id = res["id"] if res else None

            if not admin_id:
                print("Admin user not found, creating one...")
                admin_id = str(uuid.uuid4())
                cursor.execute(
                    "INSERT INTO users (id, username, password, email, name, tipo_user, ativo, data_cadastro) VALUES (%s, 'admin', 'hash', 'admin@example.com', 'Admin', 'ADMIN', TRUE, NOW())",
                    (admin_id,),
                )

            news_items = [
                {
                    "title": "Governo anuncia novo pacote de medidas econômicas",
                    "slug": "governo-anuncia-novo-pacote-medidas-economicas",
                    "cat_slug": "politica",
                    "summary": "O governo federal divulgou hoje um conjunto de ações para estimular o crescimento.",
                    "img": "https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=1000",
                },
                {
                    "title": "Final do campeonato estadual será neste domingo",
                    "slug": "final-campeonato-estadual-domingo",
                    "cat_slug": "esportes",
                    "summary": "Os dois maiores times do estado se enfrentam na grande final.",
                    "img": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000",
                },
                {
                    "title": "Nova IA revoluciona o mercado de desenvolvimento",
                    "slug": "nova-ia-revoluciona-mercado-desenvolvimento",
                    "cat_slug": "tecnologia",
                    "summary": "Ferramenta capaz de escrever código complexo ganha destaque.",
                    "img": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
                },
            ]

            for item in news_items:
                cursor.execute(
                    "SELECT id FROM noticias WHERE slug = %s", (item["slug"],)
                )
                if not cursor.fetchone():
                    cat_id = get_cat_id(item["cat_slug"])
                    if cat_id:
                        cursor.execute(
                            """
                            INSERT INTO noticias (
                                id, title, slug, summary, content, content_json,
                                featured_image_url, media_type, media_source,
                                priority, page, is_featured_home, is_featured_page,
                                publication_date, status, author_id, category_id,
                                created_at, updated_at
                            ) VALUES (
                                %s, %s, %s, %s, %s, '{}',
                                %s, 'image', 'external_url',
                                1, 'noticias', TRUE, TRUE,
                                NOW(), 'PUBLISHED', %s, %s,
                                NOW(), NOW()
                            )
                        """,
                            (
                                str(uuid.uuid4()),
                                item["title"],
                                item["slug"],
                                item["summary"],
                                item["summary"] + " Conteúdo completo...",
                                item["img"],
                                admin_id,
                                cat_id,
                            ),
                        )
                        print(f"Inserted news: {item['title']}")
                    else:
                        print(f"Category not found for {item['slug']}")

        print("Seeding completed successfully.")

    except Exception as e:
        print(f"Error during seeding: {e}")
    finally:
        conn.close()


if __name__ == "__main__":
    run_seed()
