#!/bin/bash

# Script para executar seed de categorias
# Execute: bash execute_seed.sh

echo "🚀 Executando seed de categorias..."
echo ""

# Solicitar credenciais
read -p "Digite o usuário MySQL: " MYSQL_USER
read -sp "Digite a senha MySQL: " MYSQL_PASSWORD
echo ""
read -p "Digite o nome do banco de dados: " MYSQL_DATABASE
echo ""

# Executar o script SQL
mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" < backend/src/main/resources/db/migration/seed_categories.sql

# Verificar se funcionou
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Seed executado com sucesso!"
    echo ""
    echo "Verificando categorias criadas..."
    mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT COUNT(*) as total_categorias FROM categorias;"
    echo ""
    echo "Categorias principais:"
    mysql -u "$MYSQL_USER" -p"$MYSQL_PASSWORD" "$MYSQL_DATABASE" -e "SELECT id, name, slug FROM categorias WHERE parent_category_id IS NULL ORDER BY display_order;"
else
    echo ""
    echo "❌ Erro ao executar o seed. Verifique suas credenciais e tente novamente."
fi
