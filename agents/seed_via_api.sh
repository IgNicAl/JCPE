#!/bin/bash

BASE_URL="http://localhost:8080/api"

echo "Starting API seeding..."

# 1. Register Admin
echo "Registering admin..."
REG_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seed_admin",
    "email": "seed_admin@jcpe.com",
    "password": "password123",
    "confirmPassword": "password123",
    "name": "Seed Admin",
    "userType": "ADMIN"
  }')

echo "Registration Response: $REG_RESPONSE"

# 2. Login
echo "Logging in..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "seed_admin",
    "password": "password123"
  }')

echo "Login Response: $LOGIN_RESPONSE"

TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed."
  exit 1
fi

echo "Login successful. Token: ${TOKEN:0:10}..."

# 3. Fetch Categories
echo "Fetching categories..."
CATEGORIES_JSON=$(curl -s -H "Authorization: Bearer $TOKEN" "$BASE_URL/categories")

# echo "Categories Response: $CATEGORIES_JSON"

get_cat_id() {
  echo "$CATEGORIES_JSON" | jq -r ".[] | select(.name == \"$1\") | .id"
}

CAT_POLITICA=$(get_cat_id "Política")
CAT_ESPORTES=$(get_cat_id "Esportes")
CAT_TECNOLOGIA=$(get_cat_id "Tecnologia")
CAT_ECONOMIA=$(get_cat_id "Economia")
CAT_CULTURA=$(get_cat_id "Cultura")

echo "Category IDs:"
echo "Política: $CAT_POLITICA"
echo "Esportes: $CAT_ESPORTES"
echo "Tecnologia: $CAT_TECNOLOGIA"

create_news() {
  TITLE="$1"
  SUMMARY="$2"
  CONTENT="$3"
  CAT_ID="$4"
  IMAGE="$5"

  if [ -z "$CAT_ID" ] || [ "$CAT_ID" == "null" ]; then
    echo "Skipping '$TITLE' (Category not found)"
    return
  fi

  echo "Creating news: $TITLE"
  RESPONSE=$(curl -s -X POST "$BASE_URL/noticias" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
      \"title\": \"$TITLE\",
      \"summary\": \"$SUMMARY\",
      \"content\": \"$CONTENT\",
      \"contentJson\": \"{}\",
      \"featuredImageUrl\": \"$IMAGE\",
      \"mediaType\": \"image\",
      \"mediaSource\": \"external_url\",
      \"priority\": 1,
      \"status\": \"PUBLISHED\",
      \"page\": \"noticias\",
      \"isFeaturedHome\": true,
      \"isFeaturedPage\": true,
      \"categoryId\": \"$CAT_ID\",
      \"tagIds\": []
    }")
  echo "Creation Response: $RESPONSE"
}

# 4. Create News
create_news "Governo anuncia novo pacote de medidas econômicas" \
  "O governo federal divulgou hoje um conjunto de ações para estimular o crescimento." \
  "O governo federal divulgou hoje um conjunto de ações para estimular o crescimento econômico. As medidas incluem redução de impostos para setores estratégicos e incentivos à inovação." \
  "$CAT_POLITICA" \
  "https://images.unsplash.com/photo-1541872703-74c5963631df?auto=format&fit=crop&q=80&w=1000"

create_news "Final do campeonato estadual será neste domingo" \
  "Os dois maiores times do estado se enfrentam na grande final." \
  "A expectativa é grande para a final do campeonato estadual. Os ingressos já estão esgotados e as torcidas prometem uma grande festa." \
  "$CAT_ESPORTES" \
  "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&q=80&w=1000"

create_news "Nova IA revoluciona o mercado de desenvolvimento" \
  "Ferramenta capaz de escrever código complexo ganha destaque." \
  "Uma nova inteligência artificial está mudando a forma como programadores trabalham. Capaz de gerar código complexo e resolver bugs." \
  "$CAT_TECNOLOGIA" \
  "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=1000"

echo "Seeding completed."
