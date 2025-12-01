#!/bin/bash
# Script para reconstruir o container agents com cache limpo
# Execute: bash rebuild-agents.sh

echo "🔧 Reconstruindo container agents..."
echo ""

# Para containers em execução
echo "📦 Parando containers..."
/usr/local/bin/docker compose down 2>/dev/null || docker compose down 2>/dev/null

# Limpa cache de build do agents
echo "🧹 Limpando cache..."
/usr/local/bin/docker compose build --no-cache agents 2>/dev/null || docker compose build --no-cache agents

# Inicia os containers
echo "🚀 Iniciando containers..."
/usr/local/bin/docker compose up -d 2>/dev/null || docker compose up -d

echo ""
echo "✅ Processo concluído!"
echo "📊 Verifique o status com: docker compose ps"
echo "📋 Veja os logs com: docker compose logs -f agents"
