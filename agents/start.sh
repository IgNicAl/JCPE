#!/bin/bash
# ============================================================================
# Script de Inicialização do Sistema de Agentes JCPE
# ============================================================================
# Este script ajuda a configurar e iniciar o sistema de agentes corretamente
# ============================================================================

set -e  # Para em caso de erro

echo "🚀 Iniciando Sistema de Agentes JCPE..."
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# ============================================================================
# 1. Verificar se .env existe
# ============================================================================
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado${NC}"
    echo "📝 Criando .env a partir do template..."
    cp .env.example .env
    echo -e "${GREEN}✅ Arquivo .env criado${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  IMPORTANTE: Edite o arquivo .env e configure:${NC}"
    echo "   - DB_PASSWORD (senha do MySQL)"
    echo "   - GEMINI_API_KEY (se necessário)"
    echo ""
    read -p "Pressione ENTER após configurar o .env..."
fi

# ============================================================================
# 2. Carregar variáveis de ambiente
# ============================================================================
echo "📂 Carregando variáveis de ambiente..."
export $(grep -v '^#' .env | xargs)
echo -e "${GREEN}✅ Variáveis carregadas${NC}"
echo ""

# ============================================================================
# 3. Verificar conexão MySQL
# ============================================================================
echo "🔍 Verificando conexão com MySQL..."
if mysql -u "$DB_USER" -p"$DB_PASSWORD" -h "$DB_HOST" -e "SELECT 1" &>/dev/null; then
    echo -e "${GREEN}✅ MySQL conectado com sucesso${NC}"
else
    echo -e "${RED}❌ Falha ao conectar ao MySQL${NC}"
    echo -e "${YELLOW}💡 Dicas:${NC}"
    echo "   1. Verifique se o MySQL está rodando:"
    echo "      sudo service mysql status"
    echo "   2. Verifique a senha no arquivo .env"
    echo "   3. Tente resetar a senha do MySQL se necessário"
    echo ""
    read -p "Deseja continuar mesmo assim? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi
echo ""

# ============================================================================
# 4. Verificar Redis (opcional)
# ============================================================================
echo "🔍 Verificando Redis..."
if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping &>/dev/null; then
    echo -e "${GREEN}✅ Redis conectado${NC}"
else
    echo -e "${YELLOW}⚠️  Redis não está acessível (cache desabilitado)${NC}"
    echo "   Para habilitar: sudo service redis-server start"
fi
echo ""

# ============================================================================
# 5. Verificar quota do Gemini
# ============================================================================
echo "📊 Verificando quota da API Gemini..."
echo -e "${YELLOW}⚠️  Lembre-se dos limites do tier gratuito:${NC}"
echo "   - 15 requisições/minuto"
echo "   - 200 requisições/dia"
echo "   - Monitor: https://ai.dev/usage?tab=rate-limit"
echo ""

# ============================================================================
# 6. Instalar dependências (se necessário)
# ============================================================================
if ! python -c "import nest_asyncio" &>/dev/null; then
    echo "📦 Instalando nest_asyncio..."
    pip install nest-asyncio==1.6.0
    echo -e "${GREEN}✅ nest_asyncio instalado${NC}"
    echo ""
fi

# ============================================================================
# 7. Iniciar servidor
# ============================================================================
echo ""
echo "=" | paste -s -d '' - | tr '' '='
echo "🎯 Tudo pronto! Iniciando servidor..."
echo "=" | paste -s -d '' - | tr '' '='
echo ""
echo "📍 URL: http://0.0.0.0:8001"
echo "📖 Docs: http://0.0.0.0:8001/docs"
echo ""
echo "Para parar: Ctrl+C"
echo ""

# Ativar ambiente virtual se existir
if [ -d "venv" ]; then
    source venv/bin/activate
fi

# Iniciar Uvicorn
exec uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
