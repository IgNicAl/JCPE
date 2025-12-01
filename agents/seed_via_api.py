import requests
import json
import sys

BASE_URL = "http://localhost:8080/api"


def seed_data():
    print("Starting API seeding...")

    # 1. Register Admin User (if not exists)
    print("Registering admin user...")
    register_payload = {
        "username": "seed_admin",
        "email": "seed_admin@jcpe.com",
        "password": "password123",
        "confirmPassword": "password123",
        "name": "Seed Admin",
        "userType": "ADMIN",
    }
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=register_payload)
        if resp.status_code == 200:
            print("Admin registered successfully.")
        elif resp.status_code == 400 and "Username is already taken" in resp.text:
            print("Admin user already exists.")
        else:
            print(f"Registration status: {resp.status_code} - {resp.text}")
    except Exception as e:
        print(f"Error registering: {e}")

    # 2. Login to get JWT
    print("Logging in...")
    login_payload = {"username": "seed_admin", "password": "password123"}
    token = None
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json=login_payload)
        if resp.status_code == 200:
            data = resp.json()
            token = data.get("accessToken")
            print("Login successful.")
        else:
            print(f"Login failed: {resp.status_code} - {resp.text}")
            return
    except Exception as e:
        print(f"Error logging in: {e}")
        return

    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

    # 3. Fetch Categories
    print("Fetching categories...")
    categories_map = {}
    try:
        resp = requests.get(f"{BASE_URL}/categories")
        if resp.status_code == 200:
            cats = resp.json()
            for c in cats:
                categories_map[c["name"]] = c["id"]
            print(
                f"Found {len(categories_map)} categories: {list(categories_map.keys())}"
            )
        else:
            print(f"Failed to fetch categories: {resp.status_code}")
            return
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return

    # 4. Create News
    news_items = [
        {
            "title": "Governo anuncia novo pacote de medidas econômicas",
            "summary": "O governo federal divulgou hoje um conjunto de ações para estimular o crescimento.",
            "content": "O governo federal divulgou hoje um conjunto de ações para estimular o crescimento econômico. As medidas incluem redução de impostos para setores estratégicos e incentivos à inovação.",
            "category": "Política",
            "image": "https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=1000",
        },
        {
            "title": "Final do campeonato estadual será neste domingo",
            "summary": "Os dois maiores times do estado se enfrentam na grande final.",
            "content": "A expectativa é grande para a final do campeonato estadual. Os ingressos já estão esgotados e as torcidas prometem uma grande festa.",
            "category": "Esportes",
            "image": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000",
        },
        {
            "title": "Nova IA revoluciona o mercado de desenvolvimento",
            "summary": "Ferramenta capaz de escrever código complexo ganha destaque.",
            "content": "Uma nova inteligência artificial está mudando a forma como programadores trabalham. Capaz de gerar código complexo e resolver bugs.",
            "category": "Tecnologia",
            "image": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000",
        },
        {
            "title": "Bolsa de valores fecha em alta com otimismo externo",
            "summary": "Investidores reagem positivamente aos dados internacionais.",
            "content": "O índice Ibovespa fechou em alta nesta quarta-feira, impulsionado pelo otimismo nos mercados internacionais.",
            "category": "Economia",
            "image": "https://images.unsplash.com/photo-1611974765270-ca1258634369?auto=format&fit=crop&q=80&w=1000",
        },
        {
            "title": "Festival de cinema premia produções locais",
            "summary": "O evento destacou o talento dos cineastas da região.",
            "content": "A noite de premiação do Festival de Cinema foi marcada pela emoção. Diversas produções locais foram reconhecidas.",
            "category": "Cultura",
            "image": "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=1000",
        },
    ]

    for item in news_items:
        cat_id = categories_map.get(item["category"])
        if not cat_id:
            print(f"Category '{item['category']}' not found, skipping.")
            continue

        payload = {
            "title": item["title"],
            "summary": item["summary"],
            "content": item["content"],
            "contentJson": "{}",
            "featuredImageUrl": item["image"],
            "mediaType": "image",
            "mediaSource": "external_url",
            "priority": 1,
            "status": "PUBLISHED",
            "page": "noticias",
            "isFeaturedHome": True,
            "isFeaturedPage": True,
            "categoryId": cat_id,
            "tagIds": [],
        }

        try:
            # Check if exists (by slug logic? API doesn't have check, but duplicate slug throws 500 or 400)
            # We just try to create.
            resp = requests.post(f"{BASE_URL}/noticias", json=payload, headers=headers)
            if resp.status_code == 201:
                print(f"Created news: {item['title']}")
            else:
                print(
                    f"Failed to create '{item['title']}': {resp.status_code} - {resp.text}"
                )
        except Exception as e:
            print(f"Error creating news: {e}")

    print("Seeding completed.")


if __name__ == "__main__":
    seed_data()
