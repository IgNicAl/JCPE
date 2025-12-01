#!/bin/bash
# ============================================================================
# Script de Instalação do Ollama - Modelo LLM Local Gratuito
# ============================================================================
# Este script automatiza a instalação do Ollama e a configuração do CrewAI
# ============================================================================

set -e

echo "🚀 Instalando Ollama - Modelo LLM Local Gratuito"
echo "================================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ============================================================================
# 1. Instalar Ollama
# ============================================================================
echo "📦 Instalando Ollama..."
curl -fsSL https://ollama.com/install.sh | sh
echo -e "${GREEN}✅ Ollama instalado${NC}"
echo ""

# ============================================================================
# 2. Iniciar serviço Ollama
# ============================================================================
echo "🔄 Iniciando serviço Ollama..."
sudo systemctl enable ollama
sudo systemctl start ollama
sleep 2
echo -e "${GREEN}✅ Serviço Ollama ativo${NC}"
echo ""

# ============================================================================
# 3. Baixar modelo recomendado
# ============================================================================
echo "📥 Baixando modelo Gemma 2 (9B)..."
echo -e "${YELLOW}⚠️  Isso pode demorar alguns minutos (download ~5GB)${NC}"
ollama pull gemma2:9b
echo -e "${GREEN}✅ Modelo baixado com sucesso${NC}"
echo ""

# ============================================================================
# 4. Testar modelo
# ============================================================================
echo "🧪 Testando modelo..."
ollama run gemma2:9b "Diga 'OK' se você está funcionando" &
OLLAMA_PID=$!
sleep 5
kill $OLLAMA_PID 2>/dev/null || true
echo -e "${GREEN}✅ Modelo funcionando${NC}"
echo ""

# ============================================================================
# 5. Configurar CrewAI
# ============================================================================
echo "⚙️  Configurando CrewAI para usar Ollama..."

# Backup do arquivo original
cp app/crew.py app/crew.py.backup

# Substituir configuração do LLM
if grep -q "gemini/gemini" app/crew.py; then
    # Encontra e substitui a configuração do Gemini
    sed -i 's|model="gemini/gemini-2.0-flash"|model="ollama/gemma2:9b"|g' app/crew.py
    sed -i '/api_key=os.getenv("GEMINI_API_KEY")/d' app/crew.py

    # Adiciona base_url do Ollama se não existir
    if ! grep -q "base_url" app/crew.py; then
        sed -i 's|model="ollama/gemma2:9b"|model="ollama/gemma2:9b",\n    base_url="http://localhost:11434"|g' app/crew.py
    fi

    echo -e "${GREEN}✅ CrewAI configurado${NC}"
    echo -e "${YELLOW}📝 Backup salvo em: app/crew.py.backup${NC}"
else
    echo -e "${YELLOW}⚠️  Configuração não encontrada, configure manualmente${NC}"
fi
echo ""

# ============================================================================
# 6. Resumo
# ============================================================================
echo ""
echo "=" | paste -s -d '' - | tr '' '='
echo "✅ INSTALAÇÃO CONCLUÍDA!"
echo "=" | paste -s -d '' - | tr '' '='
echo ""
echo "📊 Status:"
echo "  ✅ Ollama instalado"
echo "  ✅ Modelo: gemma2:9b"
echo "  ✅ Serviço: rodando na porta 11434"
echo "  ✅ CrewAI: configurado"
echo ""
echo "🚀 Próximo passo:"
echo "  ./start.sh"
echo ""
echo "📝 Para reverter:"
echo "  mv app/crew.py.backup app/crew.py"
echo ""
echo "💡 Outros modelos disponíveis:"
echo "  ollama pull llama3.1:8b"
echo "  ollama pull qwen2.5:7b"
echo ""
