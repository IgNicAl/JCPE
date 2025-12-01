#!/bin/bash
# Script para diagnosticar problemas do banco de dados

echo "===================================="
echo "DIAGNÓSTICO DO BANCO DE DADOS"
echo "===================================="

echo -e "\n1. Status de todos os containers:"
sudo docker compose ps -a

echo -e "\n2. Últimos 50 logs do container database:"
sudo docker compose logs database --tail 50

echo -e "\n3. Verificando se o container database está rodando:"
sudo docker ps -a | grep jcpe-database

echo -e "\n4. Tentando conectar ao MySQL de dentro do container backend:"
sudo docker compose exec backend sh -c 'echo "Testing MySQL connection..." && nc -zv database 3306; echo "Exit code: $?"' || echo "Falha ao executar teste de conexão"

echo -e "\n5. Verificando variáveis de ambiente do backend:"
sudo docker compose exec backend env | grep -E "DB_|MYSQL_" || echo "Container backend não está rodando"

echo -e "\n6. Verificando variáveis de ambiente do database:"
sudo docker compose exec database env | grep MYSQL || echo "Container database não está rodando"

echo -e "\n===================================="
echo "DIAGNÓSTICO CONCLUÍDO"
echo "===================================="
