#!/bin/bash
# Script para executar migrações do banco de dados
# Este script é executado quando o backend inicia no Docker

set -e

echo "Aguardando banco de dados estar pronto..."
until mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" -e "SELECT 1" &>/dev/null; do
  echo "Banco de dados ainda não está pronto. Aguardando..."
  sleep 2
done

echo "Banco de dados pronto! Executando migrações..."

# Executar todos os arquivos SQL na pasta migrations
for migration in /app/migrations/*.sql; do
  if [ -f "$migration" ]; then
    echo "Executando migração: $(basename $migration)"
    mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "$migration" || {
      echo "Erro ao executar migração: $(basename $migration)"
      # Continuar mesmo se houver erro (tabela já pode existir)
    }
  fi
done

echo "Migrações concluídas!"

# Iniciar a aplicação Spring Boot
exec java $JAVA_OPTS -jar app.jar
