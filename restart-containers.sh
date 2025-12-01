#!/bin/bash
# Script para reiniciar os containers com as configurações corrigidas

echo "===================================="
echo "REINICIANDO CONTAINERS"
echo "===================================="

echo -e "\n1. Parando todos os containers..."
sudo docker compose down

echo -e "\n2. Removendo volumes antigos do banco de dados (opcional)..."
echo "ATENÇÃO: Isso irá apagar todos os dados do banco de dados!"
read -p "Deseja remover os volumes? (s/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    sudo docker volume rm jcpe_mysql_data || echo "Volume já removido ou não existe"
fi

echo -e "\n3. Reconstruindo as imagens sem cache..."
sudo docker compose build --no-cache

echo -e "\n4. Iniciando os containers..."
sudo docker compose up -d

echo -e "\n5. Aguardando 30 segundos para os containers iniciarem..."
sleep 30

echo -e "\n6. Verificando logs do banco de dados..."
sudo docker compose logs database --tail 30

echo -e "\n7. Verificando logs do backend..."
sudo docker compose logs backend --tail 30

echo -e "\n8. Status dos containers:"
sudo docker compose ps

echo -e "\n===================================="
echo "Pressione Ctrl+C e execute 'sudo docker compose logs -f' para ver os logs em tempo real"
echo "===================================="
