#!/bin/bash
# Script para reiniciar containers SEM apagar dados do banco

echo "===================================="
echo "REINÍCIO SEGURO - MANTÉM DADOS"
echo "===================================="

echo -e "\n1. Parando todos os containers..."
sudo docker compose down

echo -e "\n2. Reconstruindo apenas o backend (onde está o problema)..."
sudo docker compose build backend

echo -e "\n3. Iniciando todos os containers novamente..."
sudo docker compose up -d

echo -e "\n4. Aguardando 10 segundos para inicialização..."
sleep 10

echo -e "\n5. Verificando status dos containers:"
sudo docker compose ps

echo -e "\n6. Logs do database (últimas 20 linhas):"
sudo docker compose logs database --tail 20

echo -e "\n7. Logs do backend (últimas 30 linhas):"
sudo docker compose logs backend --tail 30

echo -e "\n===================================="
echo "Para acompanhar os logs em tempo real:"
echo "  sudo docker compose logs -f backend"
echo "===================================="
